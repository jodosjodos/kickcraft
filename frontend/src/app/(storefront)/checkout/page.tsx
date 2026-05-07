"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { DeliveryMethod } from "@/types/api/orders";

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
  const steps = ["Delivery", "Payment", "Confirm"];
  return (
    <div className="flex items-center gap-0 mb-10">
      {steps.map((label, i) => {
        const num = (i + 1) as Step;
        const active = num === step;
        const done = num < step;
        return (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center font-body text-xs font-bold border-2 transition-colors",
                  done
                    ? "bg-secondary border-secondary text-background"
                    : active
                    ? "bg-primary border-primary text-white"
                    : "border-border text-text-muted bg-surface"
                )}
              >
                {done ? (
                  <span className="material-symbols-outlined icon-filled text-[14px]">
                    check
                  </span>
                ) : (
                  num
                )}
              </div>
              <span
                className={cn(
                  "font-body text-[10px] uppercase tracking-wider",
                  active ? "text-primary font-semibold" : "text-text-muted"
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1 -mt-4 transition-colors",
                  done ? "bg-secondary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    phone: "",
    email: "",
    deliveryMethod: "delivery",
    district: DISTRICTS[0],
    sector: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee =
    form.deliveryMethod === "pickup" ? 0 : total >= 20000 ? 0 : 2000;
  const orderTotal = total + deliveryFee;
  const upfront = Math.ceil(orderTotal / 2);
  const onDelivery = Math.floor(orderTotal / 2);

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
    setStep(2);
  }

  function handlePaymentNext() {
    setStep(3);
  }

  async function handleConfirm() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    clearCart();
    router.push("/checkout/confirmed?order=KC-" + Math.floor(10000 + Math.random() * 90000));
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

              <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
                Continue to Payment
              </Button>
            </form>
          )}

          {/* Step 2 — Payment */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div className="border border-border bg-surface p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined icon-outline text-[28px] text-secondary">
                    payments
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-extrabold uppercase tracking-tight text-text">
                      50/50 MoMo Payment
                    </h3>
                    <p className="font-body text-xs text-text-muted">
                      Pay half now, half on delivery
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border border-primary/30 bg-primary/5 p-4 text-center">
                    <p className="font-body text-xs text-text-muted uppercase tracking-wider mb-1">
                      Pay Now
                    </p>
                    <p className="font-heading text-xl font-extrabold text-primary">
                      {formatPrice(upfront)}
                    </p>
                  </div>
                  <div className="border border-border p-4 text-center">
                    <p className="font-body text-xs text-text-muted uppercase tracking-wider mb-1">
                      On Delivery
                    </p>
                    <p className="font-heading text-xl font-extrabold text-text">
                      {formatPrice(onDelivery)}
                    </p>
                  </div>
                </div>

                <div className="bg-surface-elevated border border-border p-4 mb-4">
                  <p className="font-body text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                    Send Mobile Money
                  </p>
                  <code className="font-body text-base text-secondary font-bold">
                    *182*8*1*0788000000#
                  </code>
                  <p className="font-body text-xs text-text-muted mt-2">
                    Amount: <span className="text-text font-semibold">{formatPrice(upfront)}</span>
                  </p>
                </div>

                <p className="font-body text-xs text-text-muted">
                  Send MoMo then tap Confirm Order below. We&apos;ll call you within
                  30 minutes to confirm.
                </p>
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
                    <span className="text-text-muted">Delivery</span>
                    <span className="text-text capitalize">
                      {form.deliveryMethod === "delivery"
                        ? `${form.district}, ${form.sector}`
                        : "Pickup"}
                    </span>
                  </div>
                </div>

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
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  loading={submitting}
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
