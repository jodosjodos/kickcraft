"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
export function OrderConfirmedContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") ?? "KC-00000";

  const whatsappMsg = encodeURIComponent(
    `Hi! I just placed order ${orderNumber} on Kickcraft. Can you confirm?`
  );

  return (
    <div className="max-w-sm mx-auto px-5 py-16 text-center">
      {/* Success icon */}
      <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
        <span className="material-symbols-outlined icon-filled text-[48px] text-secondary">
          check_circle
        </span>
      </div>

      <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mb-2">
        Order Confirmed!
      </h1>

      <p className="font-body text-sm text-text-muted mb-2">
        Order{" "}
        <span className="font-semibold text-text">{orderNumber}</span>
      </p>

      <p className="font-body text-sm text-text-muted mb-8">
        We&apos;ll call you within 30 minutes to confirm delivery details.
        Your receipt has been sent to your email.
      </p>

      {/* What happens next */}
      <div className="text-left border border-border bg-surface p-5 mb-8">
        <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-4">
          What Happens Next
        </h2>
        <div className="flex flex-col gap-3">
          {[
            {
              icon: "phone",
              text: "We call to confirm your delivery within 30 minutes",
            },
            {
              icon: "local_shipping",
              text: "Your shoes are on the way — same day in Kigali",
            },
            {
              icon: "payments",
              text: "Pay the remaining 50% when your shoes arrive",
            },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="material-symbols-outlined icon-outline text-[20px] text-text-muted mt-0.5 shrink-0">
                {step.icon}
              </span>
              <p className="font-body text-sm text-text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <a
          href={`https://wa.me/250788000000?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 border border-secondary py-3 font-body text-sm font-semibold uppercase tracking-wider text-secondary hover:bg-secondary/10 transition-colors"
        >
          <span className="material-symbols-outlined icon-outline text-[18px]">
            chat
          </span>
          Track via WhatsApp
        </a>

        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-wider transition-all duration-200 bg-primary text-white hover:bg-primary-inverse active:scale-95 h-12 px-8 text-base"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
