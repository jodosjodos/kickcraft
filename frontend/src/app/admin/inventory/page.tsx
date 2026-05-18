"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useSkus, useUpdateSku, useCreateSku, useDeleteSku } from "@/hooks/api/use-inventory";
import { useProducts } from "@/hooks/api/use-products";
import type { StockStatus, Sku } from "@/types/api/inventory";
import type { ApiError } from "@/types/api/common";

type InventoryTab = "all" | "low" | "out";

const STATUS_CONFIG: Record<StockStatus, { label: string; classes: string }> = {
  in_stock: { label: "In Stock", classes: "text-secondary bg-secondary/10" },
  low_stock: { label: "Low Stock", classes: "text-[#ffb5a0] bg-[#ffb5a0]/10" },
  out_of_stock: { label: "Out of Stock", classes: "text-error bg-error/10" },
};

function skuCode(sku: Sku): string {
  const brand = sku.productBrand.slice(0, 2).toUpperCase();
  const color = sku.color ? `-${sku.color.slice(0, 3).toUpperCase()}` : "";
  return `${brand}-${sku.size}${color}`;
}

interface CreateSkuFormProps {
  productOptions: { id: string; name: string; brand: string }[];
  onClose: () => void;
}

function CreateSkuForm({ productOptions, onClose }: CreateSkuFormProps) {
  const createSku = useCreateSku();
  const [form, setForm] = useState({
    productId: "",
    size: "",
    color: "",
    stock: "0",
    threshold: "5",
  });
  const [error, setError] = useState<string | null>(null);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.productId || !form.size) {
      setError("Product and size are required.");
      return;
    }
    try {
      await createSku.mutateAsync({
        productId: form.productId,
        size: form.size,
        color: form.color || undefined,
        stock: parseInt(form.stock, 10) || 0,
        threshold: parseInt(form.threshold, 10) || 5,
      });
      onClose();
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr?.message ?? "Failed to create SKU");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-primary/30 bg-primary/5 p-4 space-y-3">
      <p className="font-body text-xs font-semibold text-text">Add new inventory SKU</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div className="col-span-2 md:col-span-3">
          <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">Product</label>
          <select
            value={form.productId}
            onChange={(e) => set("productId", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">Select product…</option>
            {productOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.brand}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">Size</label>
          <input
            value={form.size}
            onChange={(e) => set("size", e.target.value)}
            placeholder="e.g. 42"
            className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">Color (optional)</label>
          <input
            value={form.color}
            onChange={(e) => set("color", e.target.value)}
            placeholder="e.g. Black"
            className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">Stock</label>
          <input
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => set("stock", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">Low Stock Threshold</label>
          <input
            type="number"
            min={1}
            value={form.threshold}
            onChange={(e) => set("threshold", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>
      {error && <p className="font-body text-xs text-error">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={createSku.isPending}
          className="bg-primary text-white px-3.5 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors disabled:opacity-50"
        >
          {createSku.isPending ? "Adding…" : "Add SKU"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-2 border border-border text-text-muted hover:text-text transition-colors"
        >
          <span className="material-symbols-outlined icon-outline text-[16px]">close</span>
        </button>
      </div>
    </form>
  );
}

export default function AdminInventoryPage() {
  const { data: skus = [], isLoading, error } = useSkus();
  const { data: productsData } = useProducts({ limit: 100 });
  const updateSku = useUpdateSku();
  const deleteSku = useDeleteSku();

  const [tab, setTab] = useState<InventoryTab>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const productOptions = useMemo(
    () => (productsData?.data ?? []).map((p) => ({ id: p.id, name: p.name, brand: p.brand })),
    [productsData],
  );

  const totalUnits = skus.reduce((s, i) => s + i.stock, 0);
  const lowCount = skus.filter((i) => i.status === "low_stock").length;
  const outCount = skus.filter((i) => i.status === "out_of_stock").length;

  const filtered = useMemo(() => {
    if (tab === "low") return skus.filter((s) => s.status === "low_stock");
    if (tab === "out") return skus.filter((s) => s.status === "out_of_stock");
    return skus;
  }, [skus, tab]);

  function startEdit(sku: Sku) {
    setEditingId(sku.id);
    setEditValue(String(sku.stock));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  async function commitEdit(id: string) {
    const val = parseInt(editValue, 10);
    if (!isNaN(val) && val >= 0) {
      await updateSku.mutateAsync({ id, payload: { stock: val } });
    }
    setEditingId(null);
    setEditValue("");
  }

  async function handleRestock(sku: Sku) {
    const val = window.prompt(`New stock quantity for ${sku.productName} size ${sku.size}:`, String(sku.stock));
    if (val === null) return;
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      await updateSku.mutateAsync({
        id: sku.id,
        payload: { stock: num, lastRestocked: new Date().toISOString() },
      });
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this SKU? This cannot be undone.")) return;
    await deleteSku.mutateAsync(id);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">Catalog</p>
          <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mt-0.5">Inventory</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <span className="material-symbols-outlined icon-outline text-[32px] text-text-muted/30 animate-spin">progress_activity</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">Catalog</p>
          <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mt-0.5">Inventory</h1>
        </div>
        <div className="border border-error/30 bg-error/5 px-5 py-4">
          <p className="font-body text-sm text-error">Failed to load inventory. Try refreshing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">Catalog</p>
          <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mt-0.5">Inventory</h1>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 bg-primary text-white px-3.5 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors shrink-0"
        >
          <span className="material-symbols-outlined icon-outline text-[15px]">add</span>
          Add SKU
        </button>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total SKUs", value: String(skus.length), icon: "qr_code", color: "text-text-muted" },
          { label: "Total Units", value: String(totalUnits), icon: "inventory_2", color: "text-primary" },
          { label: "Low Stock", value: String(lowCount), icon: "warning", color: "text-[#ffb5a0]" },
          { label: "Out of Stock", value: String(outCount), icon: "remove_shopping_cart", color: "text-error" },
        ].map((m) => (
          <div key={m.label} className="border border-border bg-surface px-4 py-3 flex items-center gap-3">
            <span className={`material-symbols-outlined icon-filled text-[20px] ${m.color}`}>{m.icon}</span>
            <div>
              <p className="font-heading text-lg font-extrabold text-text leading-none">{m.value}</p>
              <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-0.5">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Low stock banner */}
      {lowCount > 0 && (
        <div className="border-l-4 border-l-[#ffb5a0] bg-[#ffb5a0]/5 border border-[#ffb5a0]/20 px-5 py-3 flex items-center gap-3">
          <span className="material-symbols-outlined icon-filled text-[18px] text-[#ffb5a0]">warning</span>
          <p className="font-body text-sm text-text">
            <span className="font-semibold">{lowCount} variant{lowCount > 1 ? "s are" : " is"} running low</span>
            {" "}— consider restocking soon
          </p>
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <CreateSkuForm
          productOptions={productOptions}
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {([
          { value: "all" as InventoryTab, label: "All Stock", count: skus.length },
          { value: "low" as InventoryTab, label: "Low Stock", count: lowCount },
          { value: "out" as InventoryTab, label: "Out of Stock", count: outCount },
        ]).map(({ value, label, count }) => (
          <button key={value} onClick={() => setTab(value)}
            className={cn("flex items-center gap-2 px-3.5 py-1.5 font-body text-xs font-semibold uppercase tracking-wider border transition-all duration-150",
              tab === value ? "bg-primary text-white border-primary" : "bg-surface text-text-muted border-border hover:text-text hover:border-outline"
            )}>
            {label}
            {count > 0 && (
              <span className={cn("min-w-[18px] h-[18px] flex items-center justify-center font-body text-[10px] font-bold px-1",
                tab === value ? "bg-white/20 text-white" : value === "out" ? "bg-error text-white" : value === "low" ? "bg-[#ffb5a0]/20 text-[#ffb5a0]" : "bg-surface-elevated text-text-muted"
              )}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-border bg-surface overflow-x-auto">
        <div className="hidden xl:grid grid-cols-[1fr_90px_80px_90px_80px_80px_80px_110px_100px_100px] gap-3 px-5 py-2.5 border-b border-border bg-surface-elevated">
          {["Product / SKU", "Brand", "Size", "Color", "Stock", "Reserved", "Available", "Status", "Last Restocked", ""].map((h) => (
            <p key={h} className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">{h}</p>
          ))}
        </div>

        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <span className="material-symbols-outlined icon-outline text-[40px] text-text-muted/20 block mb-3">inventory_2</span>
              <p className="font-body text-sm text-text-muted">
                {skus.length === 0 ? "No SKUs yet — click \"Add SKU\" to create your first." : "No items in this category"}
              </p>
            </div>
          ) : (
            filtered.map((sku) => {
              const isEditing = editingId === sku.id;
              return (
                <div
                  key={sku.id}
                  className={cn(
                    "flex xl:grid xl:grid-cols-[1fr_90px_80px_90px_80px_80px_80px_110px_100px_100px] gap-3 items-center px-5 py-3 hover:bg-surface-elevated transition-colors",
                    sku.status === "out_of_stock" && "opacity-70",
                    sku.status === "low_stock" && "border-l-2 border-l-[#ffb5a0]"
                  )}
                >
                  {/* Name + SKU code */}
                  <div className="min-w-0">
                    <p className="font-body text-sm font-semibold text-text truncate">{sku.productName}</p>
                    <p className="font-body text-[10px] font-mono text-text-muted">{skuCode(sku)}</p>
                  </div>

                  <p className="hidden xl:block font-body text-xs text-text-muted">{sku.productBrand}</p>
                  <p className="hidden xl:block font-body text-sm text-text">{sku.size}</p>
                  <p className="hidden xl:block font-body text-sm text-text">{sku.color ?? "—"}</p>

                  {/* Stock — inline editable */}
                  <div className="hidden xl:block">
                    {isEditing ? (
                      <input
                        autoFocus
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => commitEdit(sku.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") void commitEdit(sku.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        className="w-16 px-2 py-1 bg-background border border-primary font-heading text-sm font-extrabold text-text focus:outline-none"
                      />
                    ) : (
                      <button
                        onClick={() => startEdit(sku)}
                        className={cn("font-heading text-sm font-extrabold hover:text-primary transition-colors",
                          sku.stock === 0 ? "text-error" : sku.status === "low_stock" ? "text-[#ffb5a0]" : "text-text"
                        )}
                      >
                        {sku.stock}
                      </button>
                    )}
                  </div>

                  <p className="hidden xl:block font-body text-xs text-text-muted">{sku.reserved}</p>
                  <p className={cn("hidden xl:block font-heading text-sm font-extrabold", sku.available <= 0 ? "text-error" : "text-text")}>
                    {sku.available}
                  </p>

                  <div className="hidden xl:block">
                    <span className={cn("px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider whitespace-nowrap", STATUS_CONFIG[sku.status].classes)}>
                      {STATUS_CONFIG[sku.status].label}
                    </span>
                  </div>

                  <p className="hidden xl:block font-body text-[10px] text-text-muted">
                    {sku.lastRestocked
                      ? new Date(sku.lastRestocked).toLocaleDateString("en-RW", { month: "short", day: "numeric", year: "numeric" })
                      : "—"}
                  </p>

                  {/* Mobile status */}
                  <div className="flex xl:hidden items-center gap-2 ml-auto shrink-0">
                    <span className={cn("px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider", STATUS_CONFIG[sku.status].classes)}>
                      {sku.stock}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="hidden xl:flex items-center gap-1">
                    <button
                      onClick={() => startEdit(sku)}
                      className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Edit stock"
                    >
                      <span className="material-symbols-outlined icon-outline text-[15px]">edit</span>
                    </button>
                    <button
                      onClick={() => void handleRestock(sku)}
                      className="flex items-center gap-1 px-2 py-1 border border-secondary/40 font-body text-[10px] font-semibold text-secondary hover:bg-secondary/10 transition-colors whitespace-nowrap"
                    >
                      Restock
                    </button>
                    <button
                      onClick={() => void handleDelete(sku.id)}
                      className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                      title="Delete SKU"
                    >
                      <span className="material-symbols-outlined icon-outline text-[15px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-5 py-3 border-t border-border bg-surface-elevated">
          <p className="font-body text-[10px] text-text-muted">
            Showing {filtered.length} of {skus.length} SKUs · Click a stock number to edit inline
          </p>
        </div>
      </div>
    </div>
  );
}
