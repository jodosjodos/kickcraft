"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { useProducts } from "@/hooks/api/use-products";
import { SlideOver } from "@/components/admin/slide-over";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product, ProductStatus } from "@/types/api/products";

type CategoryFilter = "all" | "men" | "women" | "kids";
type BrandFilter = "all" | string;

const STATUS_CONFIG: Record<ProductStatus, { label: string; classes: string }> = {
  active: { label: "Active", classes: "text-secondary bg-secondary/10" },
  draft: { label: "Draft", classes: "text-text-muted bg-surface-elevated" },
  sold: { label: "Archived", classes: "text-error bg-error/10" },
};

const BRANDS = ["Nike", "Adidas", "Jordan", "New Balance", "Puma", "Vans", "Converse", "Yeezy"];
const CATEGORIES: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids", label: "Kids" },
];
const STATUS_FILTERS: { value: ProductStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "sold", label: "Archived" },
];
const ALL_SIZES = ["35","36","37","38","39","40","41","42","43","44","45","46",
  "7","7.5","8","8.5","9","9.5","10","10.5","11","12"];
const GENDERS = ["Men", "Women", "Kids", "Unisex"] as const;
const ALL_CATEGORIES = ["men", "women", "kids"] as const;

interface ProductForm {
  name: string; brand: string; price: string; salePrice: string; costPrice: string;
  description: string; category: string; gender: string; stock: string;
  status: ProductStatus; imageUrl: string; sizes: string[]; tags: string; tagInput: string;
}

const EMPTY_FORM: ProductForm = {
  name: "", brand: "", price: "", salePrice: "", costPrice: "",
  description: "", category: "men", gender: "Men", stock: "",
  status: "active", imageUrl: "", sizes: [], tags: "", tagInput: "",
};

function StockBar({ stock }: { stock: number }) {
  const max = 100;
  const pct = Math.min((stock / max) * 100, 100);
  const color = stock === 0 ? "bg-error" : stock <= 3 ? "bg-[#ffb5a0]" : stock <= 10 ? "bg-primary" : "bg-secondary";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-surface-elevated max-w-[48px]">
        <div className={cn("h-full", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn("font-heading text-xs font-extrabold shrink-0",
        stock === 0 ? "text-error" : stock <= 3 ? "text-[#ffb5a0]" : "text-text"
      )}>{stock}</span>
      {stock <= 3 && stock > 0 && (
        <span className="font-body text-[9px] font-bold bg-[#ffb5a0]/10 text-[#ffb5a0] px-1 py-0.5 uppercase tracking-wide shrink-0">Low</span>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState<BrandFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
  const [slideOpen, setSlideOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data, isLoading, isError } = useProducts({ search: search || undefined, limit: 100 });

  const products = useMemo(() => {
    return (data?.data ?? []).filter((p) => {
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
      const matchBrand = brandFilter === "all" || p.brand.toLowerCase() === brandFilter.toLowerCase();
      return matchStatus && matchCategory && matchBrand;
    });
  }, [data, statusFilter, categoryFilter, brandFilter]);

  function openAdd() {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setSaveSuccess(false);
    setSlideOpen(true);
  }

  const openEdit = useCallback((p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name, brand: p.brand, price: String(p.price),
      salePrice: "", costPrice: "",
      description: p.description, category: p.category,
      gender: "Men", stock: String(p.stock),
      status: p.status, imageUrl: p.images?.[0]?.url ?? "",
      sizes: p.sizes ?? [], tags: "", tagInput: "",
    });
    setSaveSuccess(false);
    setSlideOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSlideOpen(false);
        setSaveSuccess(false);
      }, 1200);
    }, 700);
  }, []);

  const toggleSize = useCallback((s: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s],
    }));
  }, []);

  const set = (field: keyof ProductForm, value: string | string[]) =>
    setForm((f) => ({ ...f, [field]: value }));

  const uniqueBrands = useMemo(() => {
    const b = new Set((data?.data ?? []).map((p) => p.brand));
    return Array.from(b).sort();
  }, [data]);

  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);
  const paginated = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(products.length / PAGE_SIZE);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">Catalog</p>
          <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mt-0.5">Products</h1>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined icon-outline text-[15px]">add</span>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined icon-outline text-[16px] text-text-muted pointer-events-none">search</span>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 bg-surface border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors"
          />
        </div>

        {/* Brand pills */}
        <div className="flex flex-wrap gap-1.5">
          <span className="font-body text-[10px] font-bold uppercase tracking-wider text-text-muted self-center mr-1">Brand:</span>
          {["all", ...uniqueBrands.slice(0, 6)].map((b) => (
            <button key={b} onClick={() => { setBrandFilter(b as BrandFilter); setPage(1); }}
              className={cn("px-2.5 py-1 font-body text-[11px] font-semibold border transition-all",
                brandFilter === b ? "bg-primary text-white border-primary" : "bg-surface text-text-muted border-border hover:border-outline hover:text-text"
              )}>
              {b === "all" ? "All Brands" : b}
            </button>
          ))}
        </div>

        {/* Category + Status pills */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-1.5">
            <span className="font-body text-[10px] font-bold uppercase tracking-wider text-text-muted self-center mr-1">Category:</span>
            {CATEGORIES.map(({ value, label }) => (
              <button key={value} onClick={() => { setCategoryFilter(value); setPage(1); }}
                className={cn("px-2.5 py-1 font-body text-[11px] font-semibold border transition-all",
                  categoryFilter === value ? "bg-primary text-white border-primary" : "bg-surface text-text-muted border-border hover:border-outline hover:text-text"
                )}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="font-body text-[10px] font-bold uppercase tracking-wider text-text-muted self-center mr-1">Status:</span>
            {STATUS_FILTERS.map(({ value, label }) => (
              <button key={value} onClick={() => { setStatusFilter(value); setPage(1); }}
                className={cn("px-2.5 py-1 font-body text-[11px] font-semibold border transition-all",
                  statusFilter === value ? "bg-primary text-white border-primary" : "bg-surface text-text-muted border-border hover:border-outline hover:text-text"
                )}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Spinner size="lg" className="text-primary" /></div>
      ) : isError ? (
        <div className="border border-error/30 bg-error/5 px-5 py-4"><p className="font-body text-sm text-error">Failed to load products</p></div>
      ) : (
        <div className="border border-border bg-surface overflow-x-auto">
          {/* Header row */}
          <div className="hidden lg:grid grid-cols-[56px_1fr_100px_90px_120px_140px_100px_88px] gap-3 px-4 py-2.5 border-b border-border bg-surface-elevated">
            {["", "Product", "Brand", "Price", "Sizes", "Stock", "Status", "Actions"].map((h) => (
              <p key={h} className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">{h}</p>
            ))}
          </div>

          <div className="divide-y divide-border">
            {paginated.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <span className="material-symbols-outlined icon-outline text-[40px] text-text-muted/20 block mb-3">inventory_2</span>
                <p className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-1">No products found</p>
                <p className="font-body text-xs text-text-muted mb-4">Try adjusting your filters</p>
                <button onClick={openAdd} className="bg-primary text-white px-4 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors">
                  Add First Product
                </button>
              </div>
            ) : (
              paginated.map((product) => (
                <div key={product.id}>
                  <div className="flex lg:grid lg:grid-cols-[56px_1fr_100px_90px_120px_140px_100px_88px] gap-3 items-center px-4 py-3 hover:bg-surface-elevated transition-colors group">
                    {/* Thumbnail */}
                    <div className="w-10 h-10 shrink-0 bg-[#F5F5F5] relative overflow-hidden">
                      {product.images?.[0] ? (
                        <Image src={product.images[0].url} alt={product.name} fill sizes="40px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined icon-outline text-[18px] text-gray-400">inventory_2</span>
                        </div>
                      )}
                    </div>

                    {/* Name + SKU */}
                    <div className="min-w-0">
                      <p className="font-body text-sm font-semibold text-text truncate group-hover:text-primary transition-colors">{product.name}</p>
                      <p className="font-body text-[10px] text-text-muted">SKU: {product.id.slice(0, 8).toUpperCase()}</p>
                    </div>

                    {/* Brand */}
                    <p className="hidden lg:block font-body text-xs text-text-muted truncate">{product.brand}</p>

                    {/* Price */}
                    <div className="hidden lg:block">
                      <p className="font-heading text-sm font-extrabold text-text">{formatPrice(product.price)}</p>
                    </div>

                    {/* Sizes */}
                    <div className="hidden lg:flex flex-wrap gap-0.5 max-w-[110px]">
                      {(product.sizes ?? []).slice(0, 4).map((s) => (
                        <span key={s} className="px-1 py-0.5 bg-surface-elevated font-body text-[10px] text-text-muted">{s}</span>
                      ))}
                      {(product.sizes ?? []).length > 4 && (
                        <span className="px-1 py-0.5 font-body text-[10px] text-text-muted">+{(product.sizes ?? []).length - 4}</span>
                      )}
                    </div>

                    {/* Stock */}
                    <div className="hidden lg:block"><StockBar stock={product.stock} /></div>

                    {/* Status */}
                    <div className="hidden lg:block">
                      <span className={cn("px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider", STATUS_CONFIG[product.status]?.classes ?? "")}>
                        {STATUS_CONFIG[product.status]?.label ?? product.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 ml-auto lg:ml-0">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined icon-outline text-[17px]">edit</span>
                      </button>
                      <button className="p-1.5 text-text-muted hover:text-text hover:bg-surface-elevated transition-colors" title="View">
                        <span className="material-symbols-outlined icon-outline text-[17px]">visibility</span>
                      </button>
                      <button
                        onClick={() => setDeleteId(deleteId === product.id ? null : product.id)}
                        className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined icon-outline text-[17px]">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Delete confirm */}
                  {deleteId === product.id && (
                    <div className="flex items-center justify-between gap-4 px-4 py-3 bg-error/5 border-l-4 border-l-error border-b border-border">
                      <p className="font-body text-sm text-text">
                        Delete <span className="font-semibold">{product.name}</span>? This cannot be undone.
                      </p>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => setDeleteId(null)} className="px-3 py-1.5 font-body text-xs font-semibold text-text-muted border border-border hover:border-outline transition-colors">
                          Cancel
                        </button>
                        <button className="px-3 py-1.5 font-body text-xs font-semibold bg-error text-white hover:opacity-90 transition-opacity">
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-border bg-surface-elevated flex items-center justify-between">
              <p className="font-body text-[10px] text-text-muted">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, products.length)} of {products.length} products
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-1.5 text-text-muted hover:text-text disabled:opacity-30 transition-colors">
                  <span className="material-symbols-outlined icon-outline text-[16px]">chevron_left</span>
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={cn("w-7 h-7 font-body text-xs font-semibold transition-colors",
                        p === page ? "bg-primary text-white" : "text-text-muted hover:text-text hover:bg-surface-elevated"
                      )}>
                      {p}
                    </button>
                  );
                })}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-1.5 text-text-muted hover:text-text disabled:opacity-30 transition-colors">
                  <span className="material-symbols-outlined icon-outline text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit SlideOver */}
      <SlideOver
        open={slideOpen}
        onClose={() => setSlideOpen(false)}
        title={editProduct ? "Edit Product" : "Add Product"}
        subtitle={editProduct ? `Editing ${editProduct.name}` : "Fill in details to list a new product"}
        width="lg"
        footer={
          <div className="flex items-center justify-between gap-3">
            {saveSuccess && (
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined icon-filled text-[16px]">check_circle</span>
                <span className="font-body text-xs font-semibold">Saved successfully</span>
              </div>
            )}
            <div className="flex gap-2 ml-auto">
              <button onClick={() => setSlideOpen(false)}
                className="px-4 py-2 border border-border font-body text-xs font-semibold text-text-muted hover:text-text hover:border-outline transition-colors">
                Cancel
              </button>
              <button
                onClick={() => { set("status", "draft"); handleSave(); }}
                className="px-4 py-2 border border-border font-body text-xs font-semibold text-text-muted hover:text-text hover:border-outline transition-colors"
              >
                Save Draft
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors disabled:opacity-60"
              >
                {saving ? <Spinner size="sm" className="text-white" /> : null}
                {editProduct ? "Update" : "Publish"}
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Product Details */}
          <section>
            <h3 className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-3">Product Details</h3>
            <div className="space-y-3">
              <div>
                <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">Product Name *</label>
                <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Air Max Pulse"
                  className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">Brand</label>
                  <select value={form.brand} onChange={(e) => set("brand", e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary transition-colors">
                    <option value="">Select brand</option>
                    {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">Category</label>
                  <select value={form.category} onChange={(e) => set("category", e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary transition-colors">
                    {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">Gender</label>
                <div className="flex gap-2">
                  {GENDERS.map((g) => (
                    <button key={g} type="button" onClick={() => set("gender", g)}
                      className={cn("px-3 py-1.5 font-body text-xs font-semibold border transition-all",
                        form.gender === g ? "bg-primary text-white border-primary" : "bg-background text-text-muted border-border hover:border-outline")}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">Description *</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Product description…"
                  className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors resize-none" />
              </div>
              <div>
                <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">Tags</label>
                <input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="e.g. sneakers, limited, collab"
                  className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors" />
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section>
            <h3 className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-3">Pricing</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "price", label: "Price *", placeholder: "0" },
                { key: "salePrice", label: "Sale Price", placeholder: "Optional" },
                { key: "costPrice", label: "Cost Price", placeholder: "For margin" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">{label}</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-body text-xs text-text-muted">RWF</span>
                    <input
                      value={form[key as keyof ProductForm] as string}
                      onChange={(e) => set(key as keyof ProductForm, e.target.value)}
                      placeholder={placeholder}
                      className="w-full pl-10 pr-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
            {form.price && form.salePrice && Number(form.salePrice) < Number(form.price) && (
              <p className="font-body text-xs text-secondary mt-1.5">
                {Math.round((1 - Number(form.salePrice) / Number(form.price)) * 100)}% discount
              </p>
            )}
          </section>

          {/* Variants */}
          <section>
            <h3 className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-3">Sizes</h3>
            <div className="flex flex-wrap gap-1.5">
              {ALL_SIZES.map((s) => (
                <button key={s} type="button" onClick={() => toggleSize(s)}
                  className={cn("px-2.5 py-1.5 font-body text-xs font-semibold border transition-all",
                    form.sizes.includes(s) ? "bg-primary text-white border-primary" : "bg-background text-text-muted border-border hover:border-outline")}>
                  {s}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">Stock Quantity</label>
                <input value={form.stock} onChange={(e) => set("stock", e.target.value)} placeholder="0" type="number"
                  className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors" />
              </div>
              <div>
                <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">Image URL</label>
                <input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://…"
                  className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors" />
              </div>
            </div>
          </section>

          {/* Media upload zone */}
          <section>
            <h3 className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-3">Media</h3>
            <div className="border-2 border-dashed border-border hover:border-primary transition-colors p-8 text-center cursor-pointer">
              <span className="material-symbols-outlined icon-outline text-[32px] text-text-muted/40 block mb-2">cloud_upload</span>
              <p className="font-body text-sm font-semibold text-text-muted mb-1">Drop images here or click to browse</p>
              <p className="font-body text-[10px] text-text-muted/50">PNG, JPG up to 10MB</p>
            </div>
          </section>

          {/* Status + Visibility */}
          <section>
            <h3 className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-3">Status</h3>
            <div className="flex gap-2">
              {(["active", "draft", "sold"] as ProductStatus[]).map((s) => (
                <button key={s} type="button" onClick={() => set("status", s)}
                  className={cn("flex-1 px-3 py-2 border text-center transition-all",
                    form.status === s ? "border-primary bg-primary/10" : "border-border hover:border-outline"
                  )}>
                  <p className={cn("font-body text-xs font-bold uppercase tracking-wider",
                    form.status === s ? "text-primary" : "text-text-muted")}>
                    {s === "sold" ? "Archived" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </p>
                </button>
              ))}
            </div>
          </section>
        </div>
      </SlideOver>
    </div>
  );
}
