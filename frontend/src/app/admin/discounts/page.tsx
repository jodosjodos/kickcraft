"use client";

import { useState, useCallback } from "react";
import { useDiscounts, useCreateDiscount, useUpdateDiscount } from "@/hooks/api/use-discounts";
import { SlideOver } from "@/components/admin/slide-over";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { DiscountType, DiscountStatus } from "@/types/api/discounts";

const TYPE_LABELS: Record<DiscountType, { label: string; color: string }> = {
  percentage: { label: "% Off", color: "text-primary bg-primary/10" },
  fixed: { label: "Fixed", color: "text-secondary bg-secondary/10" },
  free_shipping: { label: "Free Ship", color: "text-[#ffb5a0] bg-[#ffb5a0]/10" },
};

const STATUS_COLORS: Record<DiscountStatus, string> = {
  active: "text-secondary bg-secondary/10",
  scheduled: "text-primary bg-primary/10",
  expired: "text-text-muted bg-surface-elevated",
  draft: "text-text-muted bg-surface-elevated",
};

const TABS: { value: DiscountStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "scheduled", label: "Scheduled" },
  { value: "expired", label: "Expired" },
  { value: "draft", label: "Draft" },
];

function formatRWF(n: number) {
  return `RWF ${n.toLocaleString("en-RW")}`;
}

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-RW", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function genCode() {
  const parts = ["KICK", "SNKR", "DEAL", "SALE", "RW"];
  const nums = Math.floor(10 + Math.random() * 90);
  return parts[Math.floor(Math.random() * parts.length)] + nums;
}

interface DiscountForm {
  name: string;
  code: string;
  type: DiscountType;
  value: string;
  appliesTo: string;
  minOrder: string;
  maxUses: string;
  validFrom: string;
  validTo: string;
}

const EMPTY_FORM: DiscountForm = {
  name: "",
  code: "",
  type: "percentage",
  value: "",
  appliesTo: "all",
  minOrder: "",
  maxUses: "",
  validFrom: "",
  validTo: "",
};

export default function AdminDiscountsPage() {
  const [tab, setTab] = useState<DiscountStatus>("active");
  const [slideOpen, setSlideOpen] = useState(false);
  const [form, setForm] = useState<DiscountForm>(EMPTY_FORM);
  const [copied, setCopied] = useState<string | null>(null);

  const { data: discounts = [], isLoading, isError } = useDiscounts();
  const createDiscount = useCreateDiscount();
  const updateDiscount = useUpdateDiscount();

  const filtered = discounts.filter((d) => d.status === tab);
  const countOf = (s: DiscountStatus) => discounts.filter((d) => d.status === s).length;
  const activeCount = countOf("active");
  const totalUses = discounts.reduce((s, d) => s + d.usageCount, 0);
  const topCode = [...discounts].sort((a, b) => b.usageCount - a.usageCount)[0];

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  }

  function deactivate(id: string) {
    updateDiscount.mutate({ id, data: { isActive: false } });
  }

  const set = (field: keyof DiscountForm, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSave = useCallback(() => {
    if (!form.name.trim() || !form.code.trim()) return;
    createDiscount.mutate(
      {
        code: form.code.toUpperCase(),
        name: form.name,
        type: form.type,
        value: form.value ? parseInt(form.value, 10) : 0,
        appliesTo: form.appliesTo || "all",
        minOrder: form.minOrder ? parseInt(form.minOrder, 10) : 0,
        maxUses: form.maxUses ? parseInt(form.maxUses, 10) : 0,
        validFrom: form.validFrom || undefined,
        validTo: form.validTo || undefined,
      },
      {
        onSuccess: () => {
          setSlideOpen(false);
          setForm(EMPTY_FORM);
        },
      },
    );
  }, [form, createDiscount]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
            Commerce
          </p>
          <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mt-0.5">
            Discounts
          </h1>
        </div>
        <button
          onClick={() => {
            setForm(EMPTY_FORM);
            setSlideOpen(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined icon-outline text-[15px]">add</span>
          Create Discount
        </button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Codes", value: String(activeCount), icon: "sell", color: "text-primary" },
          { label: "Total Uses", value: String(totalUses), icon: "redeem", color: "text-secondary" },
          { label: "Most Used", value: topCode?.code ?? "—", icon: "emoji_events", color: "text-[#ffb5a0]" },
        ].map((m) => (
          <div
            key={m.label}
            className="border border-border bg-surface px-4 py-3 flex items-center gap-3"
          >
            <span className={`material-symbols-outlined icon-filled text-[20px] ${m.color}`}>
              {m.icon}
            </span>
            <div>
              <p className="font-heading text-lg font-extrabold text-text leading-none">
                {m.value}
              </p>
              <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted mt-0.5">
                {m.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(({ value, label }) => {
          const count = countOf(value);
          return (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 font-body text-xs font-semibold uppercase tracking-wider border transition-all duration-150",
                tab === value
                  ? "bg-primary text-white border-primary"
                  : "bg-surface text-text-muted border-border hover:text-text hover:border-outline",
              )}
            >
              {label}
              {count > 0 && (
                <span
                  className={cn(
                    "min-w-[18px] h-[18px] flex items-center justify-center font-body text-[10px] font-bold px-1",
                    tab === value ? "bg-white/20 text-white" : "bg-surface-elevated text-text-muted",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" className="text-primary" />
        </div>
      ) : isError ? (
        <div className="border border-error/30 bg-error/5 px-5 py-4">
          <p className="font-body text-sm text-error">Failed to load discounts</p>
        </div>
      ) : (
        <div className="border border-border bg-surface overflow-x-auto">
          <div className="hidden lg:grid grid-cols-[120px_80px_80px_1fr_100px_120px_110px_90px_88px] gap-3 px-5 py-2.5 border-b border-border bg-surface-elevated">
            {["Code", "Type", "Value", "Applies To", "Min Order", "Usage", "Valid Period", "Status", ""].map(
              (h) => (
                <p
                  key={h}
                  className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted"
                >
                  {h}
                </p>
              ),
            )}
          </div>

          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <span className="material-symbols-outlined icon-outline text-[40px] text-text-muted/20 block mb-3">
                  sell
                </span>
                <p className="font-body text-sm text-text-muted">No {tab} discounts</p>
                <button
                  onClick={() => setSlideOpen(true)}
                  className="mt-3 bg-primary text-white px-4 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors"
                >
                  Create Discount
                </button>
              </div>
            ) : (
              filtered.map((d) => {
                const usagePct = d.maxUses ? (d.usageCount / d.maxUses) * 100 : 0;
                const typeConf = TYPE_LABELS[d.type];
                return (
                  <div
                    key={d.id}
                    className="flex lg:grid lg:grid-cols-[120px_80px_80px_1fr_100px_120px_110px_90px_88px] gap-3 items-center px-5 py-3.5 hover:bg-surface-elevated transition-colors"
                  >
                    {/* Code */}
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm font-bold text-text">{d.code}</span>
                      <button
                        onClick={() => copyCode(d.code)}
                        className="p-0.5 text-text-muted hover:text-primary transition-colors"
                        title="Copy"
                      >
                        <span className="material-symbols-outlined icon-outline text-[13px]">
                          {copied === d.code ? "check" : "content_copy"}
                        </span>
                      </button>
                    </div>

                    {/* Type */}
                    <span
                      className={cn(
                        "hidden lg:inline-flex px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider w-fit",
                        typeConf.color,
                      )}
                    >
                      {typeConf.label}
                    </span>

                    {/* Value */}
                    <p className="hidden lg:block font-heading text-sm font-extrabold text-text">
                      {d.type === "percentage"
                        ? `${d.value}%`
                        : d.type === "fixed"
                          ? formatRWF(d.value)
                          : "Free"}
                    </p>

                    {/* Applies to */}
                    <p className="hidden lg:block font-body text-xs text-text-muted truncate">
                      {d.appliesTo === "all" ? "All products" : d.appliesTo}
                    </p>

                    {/* Min order */}
                    <p className="hidden lg:block font-body text-xs text-text-muted">
                      {d.minOrder > 0 ? formatRWF(d.minOrder) : "None"}
                    </p>

                    {/* Usage */}
                    <div className="hidden lg:block">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-body text-xs text-text">{d.usageCount}</p>
                        <p className="font-body text-[10px] text-text-muted">
                          / {d.maxUses === 0 ? "∞" : d.maxUses}
                        </p>
                      </div>
                      {d.maxUses > 0 && (
                        <div className="h-1 bg-surface-elevated w-full max-w-[80px]">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${Math.min(usagePct, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Valid period */}
                    <div className="hidden lg:block">
                      <p className="font-body text-[10px] text-text-muted">
                        {formatDate(d.validFrom)}
                      </p>
                      <p className="font-body text-[10px] text-text-muted">
                        {formatDate(d.validTo)}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="hidden lg:block">
                      <span
                        className={cn(
                          "px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider",
                          STATUS_COLORS[d.status],
                        )}
                      >
                        {d.status}
                      </span>
                    </div>

                    {/* Mobile */}
                    <div className="flex lg:hidden items-center gap-2 ml-auto shrink-0">
                      <span
                        className={cn(
                          "px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider",
                          STATUS_COLORS[d.status],
                        )}
                      >
                        {d.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="hidden lg:flex items-center gap-1">
                      <button
                        onClick={() => copyCode(d.code)}
                        className="p-1.5 text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
                        title="Copy code"
                      >
                        <span className="material-symbols-outlined icon-outline text-[15px]">
                          content_copy
                        </span>
                      </button>
                      {d.status === "active" && (
                        <button
                          onClick={() => deactivate(d.id)}
                          disabled={updateDiscount.isPending}
                          className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                          title="Deactivate"
                        >
                          <span className="material-symbols-outlined icon-outline text-[15px]">
                            block
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Create Discount SlideOver */}
      <SlideOver
        open={slideOpen}
        onClose={() => setSlideOpen(false)}
        title="Create Discount"
        subtitle="Set up a new discount code"
        footer={
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setSlideOpen(false)}
              className="px-4 py-2 border border-border font-body text-xs font-semibold text-text-muted hover:text-text hover:border-outline transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={createDiscount.isPending || !form.name || !form.code}
              className="bg-primary text-white px-4 py-2 font-body text-xs font-bold uppercase tracking-wider hover:bg-primary-inverse transition-colors disabled:opacity-50"
            >
              {createDiscount.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        }
      >
        <div className="space-y-5">
          <div>
            <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
              Discount Name
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Summer Sale 2025"
              className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
              Discount Code
            </label>
            <div className="flex gap-2">
              <input
                value={form.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER25"
                className="flex-1 px-3 py-2 bg-background border border-border font-mono text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                onClick={() => set("code", genCode())}
                className="px-3 py-2 border border-border font-body text-xs font-semibold text-text-muted hover:text-text hover:border-outline transition-colors whitespace-nowrap"
              >
                Auto-generate
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary transition-colors"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>
            <div>
              <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
                {form.type === "percentage"
                  ? "Discount %"
                  : form.type === "fixed"
                    ? "Amount (RWF)"
                    : "Value"}
              </label>
              <input
                value={form.value}
                onChange={(e) => set("value", e.target.value)}
                placeholder={form.type === "percentage" ? "0–100" : "0"}
                disabled={form.type === "free_shipping"}
                className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
              Applies To
            </label>
            <select
              value={form.appliesTo}
              onChange={(e) => set("appliesTo", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary transition-colors"
            >
              <option value="all">All products</option>
              <option value="men">Men category</option>
              <option value="women">Women category</option>
              <option value="kids">Kids category</option>
              <option value="Nike">Nike brand</option>
              <option value="Adidas">Adidas brand</option>
              <option value="Jordan">Jordan brand</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
                Min Order (RWF)
              </label>
              <input
                value={form.minOrder}
                onChange={(e) => set("minOrder", e.target.value)}
                placeholder="0 = no minimum"
                className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
                Max Uses
              </label>
              <input
                value={form.maxUses}
                onChange={(e) => set("maxUses", e.target.value)}
                placeholder="0 = unlimited"
                className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
                Valid From
              </label>
              <input
                type="date"
                value={form.validFrom}
                onChange={(e) => set("validFrom", e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="font-body text-[10px] font-semibold uppercase tracking-wider text-text-muted block mb-1">
                Valid To
              </label>
              <input
                type="date"
                value={form.validTo}
                onChange={(e) => set("validTo", e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border font-body text-sm text-text focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>
      </SlideOver>
    </div>
  );
}
