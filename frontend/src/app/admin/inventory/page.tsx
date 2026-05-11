"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
type InventoryTab = "all" | "low" | "out";

interface InventoryItem {
  id: string;
  name: string;
  brand: string;
  sku: string;
  size: string;
  color: string;
  current: number;
  reserved: number;
  threshold: number;
  lastRestocked: string;
  supplier: string;
}

const MOCK_INVENTORY: InventoryItem[] = [
  { id: "1", name: "Air Max Pulse", brand: "Nike", sku: "NK-AMP-001-42-BLK", size: "42", color: "Black", current: 18, reserved: 3, threshold: 5, lastRestocked: "2025-04-10", supplier: "Nike RW" },
  { id: "2", name: "Air Max Pulse", brand: "Nike", sku: "NK-AMP-001-41-WHT", size: "41", color: "White", current: 2, reserved: 1, threshold: 5, lastRestocked: "2025-03-28", supplier: "Nike RW" },
  { id: "3", name: "Yeezy Slide", brand: "Adidas", sku: "AD-YZS-002-40-GRY", size: "40", color: "Grey", current: 0, reserved: 0, threshold: 3, lastRestocked: "2025-02-15", supplier: "Adidas EA" },
  { id: "4", name: "Yeezy Slide", brand: "Adidas", sku: "AD-YZS-002-42-BLK", size: "42", color: "Black", current: 7, reserved: 2, threshold: 3, lastRestocked: "2025-04-20", supplier: "Adidas EA" },
  { id: "5", name: "Jordan 1 Retro High", brand: "Jordan", sku: "JD-J1H-003-43-RED", size: "43", color: "Red", current: 3, reserved: 2, threshold: 4, lastRestocked: "2025-03-05", supplier: "Jordan Brand" },
  { id: "6", name: "Jordan 1 Retro High", brand: "Jordan", sku: "JD-J1H-003-44-BLK", size: "44", color: "Black", current: 11, reserved: 1, threshold: 4, lastRestocked: "2025-04-18", supplier: "Jordan Brand" },
  { id: "7", name: "New Balance 990v6", brand: "New Balance", sku: "NB-990-004-41-GRY", size: "41", color: "Grey", current: 0, reserved: 0, threshold: 3, lastRestocked: "2025-01-20", supplier: "NB Africa" },
  { id: "8", name: "Vans Old Skool", brand: "Vans", sku: "VN-OSK-005-39-BLK", size: "39", color: "Black", current: 24, reserved: 4, threshold: 5, lastRestocked: "2025-04-25", supplier: "Vans EMEA" },
  { id: "9", name: "Vans Old Skool", brand: "Vans", sku: "VN-OSK-005-38-WHT", size: "38", color: "White", current: 1, reserved: 0, threshold: 5, lastRestocked: "2025-02-28", supplier: "Vans EMEA" },
  { id: "10", name: "Converse Chuck 70", brand: "Converse", sku: "CV-C70-006-40-BLK", size: "40", color: "Black", current: 9, reserved: 2, threshold: 3, lastRestocked: "2025-04-12", supplier: "Converse KE" },
  { id: "11", name: "Puma RS-X", brand: "Puma", sku: "PM-RSX-007-42-BLU", size: "42", color: "Blue", current: 0, reserved: 0, threshold: 4, lastRestocked: "2025-03-01", supplier: "Puma EA" },
  { id: "12", name: "Puma RS-X", brand: "Puma", sku: "PM-RSX-007-41-RED", size: "41", color: "Red", current: 4, reserved: 1, threshold: 4, lastRestocked: "2025-04-08", supplier: "Puma EA" },
];

function getStatus(item: InventoryItem): StockStatus {
  if (item.current === 0) return "out_of_stock";
  if (item.current <= item.threshold) return "low_stock";
  return "in_stock";
}

const STATUS_CONFIG: Record<StockStatus, { label: string; classes: string }> = {
  in_stock: { label: "In Stock", classes: "text-secondary bg-secondary/10" },
  low_stock: { label: "Low Stock", classes: "text-[#ffb5a0] bg-[#ffb5a0]/10" },
  out_of_stock: { label: "Out of Stock", classes: "text-error bg-error/10" },
};

export default function AdminInventoryPage() {
  const [tab, setTab] = useState<InventoryTab>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [inventory, setInventory] = useState(MOCK_INVENTORY);

  const filtered = useMemo(() => {
    return inventory.filter((item) => {
      const s = getStatus(item);
      if (tab === "low") return s === "low_stock";
      if (tab === "out") return s === "out_of_stock";
      return true;
    });
  }, [inventory, tab]);

  const totalSKUs = inventory.length;
  const totalUnits = inventory.reduce((s, i) => s + i.current, 0);
  const lowCount = inventory.filter((i) => getStatus(i) === "low_stock").length;
  const outCount = inventory.filter((i) => getStatus(i) === "out_of_stock").length;

  function commitEdit(id: string) {
    const val = parseInt(editValue, 10);
    if (!isNaN(val) && val >= 0) {
      setInventory((prev) => prev.map((i) => i.id === id ? { ...i, current: val } : i));
    }
    setEditingId(null);
    setEditValue("");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">Catalog</p>
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mt-0.5">Inventory</h1>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total SKUs", value: String(totalSKUs), icon: "qr_code", color: "text-text-muted" },
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

      {/* Tabs */}
      <div className="flex gap-2">
        {([
          { value: "all" as InventoryTab, label: "All Stock", count: inventory.length },
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
        <div className="hidden xl:grid grid-cols-[1fr_90px_80px_90px_80px_80px_80px_110px_100px_80px] gap-3 px-5 py-2.5 border-b border-border bg-surface-elevated">
          {["Product / SKU", "Brand", "Size", "Color", "Stock", "Reserved", "Available", "Status", "Last Restocked", ""].map((h) => (
            <p key={h} className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">{h}</p>
          ))}
        </div>

        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <span className="material-symbols-outlined icon-outline text-[40px] text-text-muted/20 block mb-3">inventory_2</span>
              <p className="font-body text-sm text-text-muted">No items in this category</p>
            </div>
          ) : (
            filtered.map((item) => {
              const status = getStatus(item);
              const available = item.current - item.reserved;
              const isEditing = editingId === item.id;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex xl:grid xl:grid-cols-[1fr_90px_80px_90px_80px_80px_80px_110px_100px_80px] gap-3 items-center px-5 py-3 hover:bg-surface-elevated transition-colors",
                    status === "out_of_stock" && "opacity-70",
                    status === "low_stock" && "border-l-2 border-l-[#ffb5a0]"
                  )}
                >
                  {/* Name + SKU */}
                  <div className="min-w-0">
                    <p className="font-body text-sm font-semibold text-text truncate">{item.name}</p>
                    <p className="font-body text-[10px] font-mono text-text-muted">{item.sku}</p>
                  </div>

                  <p className="hidden xl:block font-body text-xs text-text-muted">{item.brand}</p>
                  <p className="hidden xl:block font-body text-sm text-text">{item.size}</p>
                  <p className="hidden xl:block font-body text-sm text-text">{item.color}</p>

                  {/* Stock — inline editable */}
                  <div className="hidden xl:block">
                    {isEditing ? (
                      <input
                        autoFocus
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => commitEdit(item.id)}
                        onKeyDown={(e) => { if (e.key === "Enter") commitEdit(item.id); if (e.key === "Escape") { setEditingId(null); setEditValue(""); } }}
                        className="w-16 px-2 py-1 bg-background border border-primary font-heading text-sm font-extrabold text-text focus:outline-none"
                      />
                    ) : (
                      <button onClick={() => { setEditingId(item.id); setEditValue(String(item.current)); }}
                        className={cn("font-heading text-sm font-extrabold hover:text-primary transition-colors",
                          item.current === 0 ? "text-error" : item.current <= item.threshold ? "text-[#ffb5a0]" : "text-text"
                        )}>
                        {item.current}
                      </button>
                    )}
                  </div>

                  <p className="hidden xl:block font-body text-xs text-text-muted">{item.reserved}</p>
                  <p className={cn("hidden xl:block font-heading text-sm font-extrabold", available <= 0 ? "text-error" : "text-text")}>{Math.max(0, available)}</p>

                  <div className="hidden xl:block">
                    <span className={cn("px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider whitespace-nowrap", STATUS_CONFIG[status].classes)}>
                      {STATUS_CONFIG[status].label}
                    </span>
                  </div>

                  <p className="hidden xl:block font-body text-[10px] text-text-muted">{new Date(item.lastRestocked).toLocaleDateString("en-RW", { month: "short", day: "numeric", year: "numeric" })}</p>

                  {/* Mobile: status */}
                  <div className="flex xl:hidden items-center gap-2 ml-auto shrink-0">
                    <span className={cn("px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider", STATUS_CONFIG[status].classes)}>
                      {item.current}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="hidden xl:flex items-center gap-1">
                    <button
                      onClick={() => { setEditingId(item.id); setEditValue(String(item.current)); }}
                      className="p-1.5 font-body text-[10px] font-semibold text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Edit stock"
                    >
                      <span className="material-symbols-outlined icon-outline text-[15px]">edit</span>
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 border border-secondary/40 font-body text-[10px] font-semibold text-secondary hover:bg-secondary/10 transition-colors whitespace-nowrap">
                      Restock
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-5 py-3 border-t border-border bg-surface-elevated">
          <p className="font-body text-[10px] text-text-muted">
            Showing {filtered.length} of {inventory.length} SKUs · Click a stock number to edit inline
          </p>
        </div>
      </div>
    </div>
  );
}
