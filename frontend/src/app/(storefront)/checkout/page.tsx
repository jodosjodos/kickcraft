"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/providers/cart-provider";
import { useCreateOrder } from "@/hooks/api/use-orders";
import { useApplyDiscount } from "@/hooks/api/use-discounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { DeliveryMethod } from "@/types/api/orders";
import type { ApplyDiscountResponse } from "@/types/api/discounts";

type Step = 1 | 2 | 3;

const DISTRICTS = ["Gasabo", "Nyarugenge", "Kicukiro"];

interface CheckoutForm {
  name: string;
  phone: string;
  email: string;
  deliveryMethod: DeliveryMethod;
  district: string;
  sector: string;
}

function StepIndicator({ step }: { step: Step }) {
  const steps = [
    { label: "Delivery", icon: "local_shipping" },
    { label: "Payment", icon: "payments" },
    { label: "Confirm", icon: "check_circle" },
  ];
  return (
    <div className="mb-10">
      {/* Progress bar */}
      <div className="relative h-0.5 bg-border mb-5">
        <div
          className="absolute left-0 top-0 h-full bg-primary transition-all duration-500"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />
      </div>
      {/* Step labels */}
      <div className="flex justify-between">
        {steps.map(({ label, icon }, i) => {
          const num = (i + 1) as Step;
          const active = num === step;
          const done = num < step;
          return (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-8 h-8 flex items-center justify-center border transition-all duration-200",
                  done
                    ? "bg-secondary/20 border-secondary"
                    : active
                    ? "bg-primary/10 border-primary"
                    : "bg-surface-elevated border-border"
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-[16px]",
                    done
                      ? "icon-fill text-secondary"
                      : active
                      ? "icon-fill text-primary"
                      : "icon-outline text-text-muted"
                  )}
                >
                  {done ? "check" : icon}
                </span>
              </div>
              <span
                className={cn(
                  "font-body text-[10px] uppercase tracking-wider",
                  active ? "text-primary font-bold" : done ? "text-secondary" : "text-text-muted"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const applyDiscount = useApplyDiscount();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    phone: "",
    email: "",
    deliveryMethod: "delivery",
    district: DISTRICTS[0],
    sector: "",
  });
  const [orderError, setOrderError] = useState<string>("");
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<ApplyDiscountResponse | null>(null);
  const [promoError, setPromoError] = useState("");

  const deliveryFee = form.deliveryMethod === "pickup" ? 0 : 2000;
  const discountAmount = appliedDiscount?.discountAmount ?? 0;
  const orderTotal = total + deliveryFee - discountAmount;
  const upfront = Math.ceil(orderTotal / 2);
  const onDelivery = Math.floor(orderTotal / 2);

  function handleApplyPromo() {
    if (!promoCode.trim()) return;
    setPromoError("");
    applyDiscount.mutate(
      { code: promoCode.trim(), orderTotal: total },
      {
        onSuccess: (result) => {
          setAppliedDiscount(result);
          setPromoCode("");
        },
        onError: (err) => {
          setPromoError(err.message ?? "Invalid promo code");
        },
      },
    );
  }

  function handleRemovePromo() {
    setAppliedDiscount(null);
    setPromoError("");
  }

  if (items.length === 0) {
    return (
      <div className="max-w-container mx-auto px-5 py-16 text-center">
        <p className="font-body text-sm text-text-muted mb-6">
          Your cart is empty.
        </p>
        <Link href="/shop" className="font-body text-sm text-primary hover:underline underline-offset-4">
          Browse shoes
        </Link>
      </div>
    );
  }

  function set<K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleDeliveryNext(e: React.FormEvent) {
    e.preventDefault();
    setStep(form.deliveryMethod === "pickup" ? 3 : 2);
  }

  function handlePaymentNext() {
    setStep(3);
  }

  async function handleConfirm() {
    setOrderError("");
    createOrder.mutate(
      {
        items: items.map((item) => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
        })),
        deliveryMethod: form.deliveryMethod,
        phone: `+250${form.phone.replace(/\s/g, "")}`,
        email: form.email || undefined,
        deliveryAddress:
          form.deliveryMethod === "delivery"
            ? `${form.district}, ${form.sector}`
            : undefined,
        discountCode: appliedDiscount?.code,
      },
      {
        onSuccess: (order) => {
          sessionStorage.setItem(
            "last_order",
            JSON.stringify({
              orderNumber: order.orderToken,
              items: items.map((item) => ({
                name: item.name,
                brand: item.brand,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
                imageUrl: item.imageUrl ?? null,
              })),
              subtotal: order.subtotal,
              deliveryFee: order.deliveryFee,
              orderTotal: order.total,
              upfront: Math.ceil(order.total / 2),
              onDelivery: Math.floor(order.total / 2),
              deliveryMethod: form.deliveryMethod,
              deliveryAddress: order.deliveryAddress ?? null,
              phone: form.phone,
            })
          );
          clearCart();
          router.push(`/checkout/confirmed?order=${order.orderToken}`);
        },
        onError: (err) => {
          setOrderError(err.message ?? "Failed to place order. Please try again.");
        },
      }
    );
  }

  return (
    <div className="max-w-container mx-auto px-5 md:px-4 py-8">
      <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mb-8">
        Checkout
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Form */}
        <div className="flex-1 min-w-0">
          <StepIndicator step={step} />

          {/* Step 1 — Delivery */}
          {step === 1 && (
            <form onSubmit={handleDeliveryNext} className="flex flex-col gap-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="Mugisha Eric"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
                autoComplete="name"
              />

              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
                  Phone (MTN MoMo)
                </label>
                <div className="flex">
                  <span className="border border-r-0 border-border bg-surface-elevated px-3 flex items-center font-body text-sm text-text-muted">
                    +250
                  </span>
                  <input
                    type="tel"
                    placeholder="788 000 000"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    required
                    autoComplete="tel"
                    className="flex-1 border border-border bg-surface px-3 py-2.5 font-body text-sm text-text placeholder-text-muted/50 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <p className="font-body text-xs text-text-muted">
                  Used for MoMo payment and order updates
                </p>
              </div>

              <Input
                label="Email (optional)"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
              />

              {/* Delivery method */}
              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-text-muted mb-3">
                  Delivery Method
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(["delivery", "pickup"] as DeliveryMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => set("deliveryMethod", method)}
                      className={cn(
                        "border p-4 text-left transition-colors duration-150",
                        form.deliveryMethod === method
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-outline"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined icon-outline text-[20px] text-text-muted">
                          {method === "delivery" ? "local_shipping" : "store"}
                        </span>
                        <span
                          className={cn(
                            "font-body text-sm font-semibold capitalize",
                            form.deliveryMethod === method
                              ? "text-primary"
                              : "text-text"
                          )}
                        >
                          {method === "delivery" ? "Home Delivery" : "Pickup"}
                        </span>
                      </div>
                      <p className="font-body text-xs text-text-muted">
                        {method === "delivery"
                          ? "Delivered to your Kigali address"
                          : "Collect from our Kigali location"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Address — only for delivery */}
              {form.deliveryMethod === "delivery" && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
                      District
                    </label>
                    <select
                      value={form.district}
                      onChange={(e) => set("district", e.target.value)}
                      required
                      className="border border-border bg-surface px-3 py-2.5 font-body text-sm text-text focus:outline-none focus:border-primary transition-colors"
                    >
                      {DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Sector / Cell / Street"
                    type="text"
                    placeholder="e.g. Kimironko, KN 5 Rd"
                    value={form.sector}
                    onChange={(e) => set("sector", e.target.value)}
                    required
                  />
                </>
              )}

              {/* Promo code */}
              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-text-muted mb-1.5">
                  Promo Code
                </p>
                {appliedDiscount ? (
                  <div className="flex items-center justify-between border border-secondary/40 bg-secondary/5 px-3 py-2">
                    <span className="font-body text-sm text-secondary font-semibold">
                      {appliedDiscount.code} — you save {formatPrice(appliedDiscount.discountAmount)}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="font-body text-xs text-text-muted hover:text-error transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 border border-border bg-surface px-3 py-2.5 font-mono text-sm text-text placeholder-text-muted/50 focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={applyDiscount.isPending || !promoCode.trim()}
                      className="px-4 py-2.5 border border-border font-body text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-text hover:border-outline transition-colors disabled:opacity-50"
                    >
                      {applyDiscount.isPending ? "..." : "Apply"}
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="font-body text-xs text-error mt-1">{promoError}</p>
                )}
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
                Continue to Payment
              </Button>
            </form>
          )}

          {/* Step 2 — Payment */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              {/* Orange accent line */}
              <div className="h-0.5 bg-primary w-full" />

              <div className="border border-border bg-surface">
                <div className="px-6 pt-5 pb-6 flex flex-col gap-5">
                  <h3 className="font-heading text-lg font-extrabold uppercase tracking-tight text-text">
                    Payment: 50/50 MoMo
                  </h3>

                  {/* Pay now / Pay on arrival */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-surface-elevated border border-border p-4">
                      <p className="font-body text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted mb-2">
                        Pay Now (50%)
                      </p>
                      <p className="font-heading text-2xl font-extrabold text-primary">
                        {formatPrice(upfront)}
                      </p>
                    </div>
                    <div className="bg-surface-elevated border border-border p-4">
                      <p className="font-body text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted mb-2">
                        Pay on Arrival (50%)
                      </p>
                      <p className="font-heading text-2xl font-extrabold text-text">
                        {formatPrice(onDelivery)}
                      </p>
                    </div>
                  </div>

                  {/* USSD code */}
                  <div className="bg-surface-elevated border border-border px-6 py-6 text-center flex flex-col items-center gap-5">
                    <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                      Send Mobile Money To
                    </p>
                    <p className="font-heading font-extrabold leading-none select-all" style={{ fontSize: "clamp(22px, 5vw, 40px)" }}>
                      <span className="text-text">*182*8*1*</span>
                      <span className="text-primary">0788000000#</span>
                    </p>
                    <div className="inline-flex items-center gap-2 bg-surface border border-border px-4 py-2.5">
                      <span className="material-symbols-outlined icon-filled text-[14px] text-primary">
                        info
                      </span>
                      <p className="font-body text-xs text-text-muted">
                        Send MoMo then tap Confirm Order below.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={handlePaymentNext}
                >
                  I&apos;ve Sent MoMo →
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 — Confirm */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div className="border border-border bg-surface p-6">
                <h3 className="font-heading text-base font-extrabold uppercase tracking-tight text-text mb-4">
                  Review Your Order
                </h3>

                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-text-muted">Name</span>
                    <span className="text-text">{form.name}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-text-muted">Phone</span>
                    <span className="text-text">+250 {form.phone}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-text-muted">Method</span>
                    <span className="text-text capitalize">
                      {form.deliveryMethod === "delivery"
                        ? `Delivery — ${form.district}, ${form.sector}`
                        : "Store Pickup"}
                    </span>
                  </div>
                </div>

                {form.deliveryMethod === "pickup" ? (
                  <div className="border-t border-border pt-4 bg-surface-elevated px-4 py-3">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined icon-outline text-[20px] text-secondary shrink-0 mt-0.5">
                        store
                      </span>
                      <div>
                        <p className="font-body text-sm font-semibold text-text">
                          Pay in full at pickup
                        </p>
                        <p className="font-body text-xs text-text-muted mt-0.5">
                          Come to our Kigali store and pay {formatPrice(orderTotal)} on collection. We&apos;ll contact you to confirm when your order is ready.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between font-body text-sm text-text-muted mb-1">
                      <span>Paid now (50%)</span>
                      <span className="text-secondary font-semibold">{formatPrice(upfront)}</span>
                    </div>
                    <div className="flex justify-between font-body text-sm text-text-muted">
                      <span>Due on delivery</span>
                      <span className="text-text">{formatPrice(onDelivery)}</span>
                    </div>
                  </div>
                )}
              </div>

              {orderError && (
                <p className="font-body text-sm text-error bg-error/5 border border-error/20 px-4 py-3">
                  {orderError}
                </p>
              )}

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep(form.deliveryMethod === "pickup" ? 1 : 2)}
                  disabled={createOrder.isPending}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  loading={createOrder.isPending}
                  onClick={handleConfirm}
                >
                  <span className="material-symbols-outlined icon-outline text-[18px] mr-2">
                    check_circle
                  </span>
                  Confirm Order
                </Button>
              </div>

              <p className="font-body text-xs text-text-muted text-center">
                By confirming, you agree to our terms of service.
              </p>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:w-72 shrink-0">
          <div className="border border-border bg-surface p-5 sticky top-[120px]">
            <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-4">
              Order ({items.length} {items.length === 1 ? "item" : "items"})
            </h2>

            <div className="flex flex-col gap-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between font-body text-xs">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-text font-semibold truncate max-w-[160px]">
                      {item.name}
                    </span>
                    <span className="text-text-muted">
                      Size {item.size} × {item.quantity}
                    </span>
                  </div>
                  <span className="text-text shrink-0 ml-3">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 flex flex-col gap-2">
              <div className="flex justify-between font-body text-xs text-text-muted">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between font-body text-xs text-text-muted">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? "text-secondary font-semibold" : ""}>
                  {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                </span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between font-body text-xs text-secondary">
                  <span>Promo ({appliedDiscount.code})</span>
                  <span>−{formatPrice(appliedDiscount.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-heading text-sm font-extrabold text-text pt-1">
                <span>Total</span>
                <span className="text-primary">{formatPrice(orderTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
