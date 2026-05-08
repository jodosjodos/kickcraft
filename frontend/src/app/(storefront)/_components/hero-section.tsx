import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-background">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #e5e2e1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      {/* Hero shoe image — right half */}
      <div className="absolute right-0 top-0 h-full w-[55%] md:w-[52%]">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk86VJoETBMB1mP_aF7sDBZ2iyTs54d4APlfhfkEqQHIMLyfGRjvLl2WQskoitBeEylkS3QGpJjBPmDE4LwgPXMi0IgkEhuupb_kxKaPIyt1kYRnrXcm6mYu37aWtamiyRfDwOTbBjlRs5Bqd4WXwYg2iFJEtNNBBqWnDcC-z7rhwcLmPb_wprR17leS7lwvtMYrG0IpwSIsjozCWe00hX4W89q7v3TjiULJHdgQzm1RrifyFSaSV64tiwm7may-vOh1wgx7kW2hig"
          alt="Premium sneaker — Kickcraft"
          fill
          priority
          className="object-cover object-center"
          sizes="55vw"
        />
        {/* Fade overlay over the image towards left */}
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-container px-5 md:px-8 py-24">
        <div className="max-w-xl">
          {/* Eyebrow */}
          <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-4">
            Kigali&apos;s #1 Sneaker Destination
          </p>

          {/* Heading */}
          <h1 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-extrabold uppercase leading-[1.05] tracking-[-0.03em] text-text mb-6">
            The Only Shoe Store That Gets Kigali.
          </h1>

          {/* Subheading */}
          <p className="font-body text-base md:text-lg text-text-muted leading-relaxed mb-10 max-w-lg">
            Premium streetwear and authentic kicks, curated for the streets of
            Rwanda. Step up your game.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-body font-semibold text-sm uppercase tracking-wider px-8 py-4 rounded hover:bg-primary-inverse active:scale-95 transition-all duration-200"
            >
              Shop Now
              <Icon name="arrow_forward" size={18} />
            </Link>

            <a
              href="https://wa.me/250794050537"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-border text-text font-body font-semibold text-sm uppercase tracking-wider px-8 py-4 rounded hover:border-secondary hover:text-secondary active:scale-95 transition-all duration-200"
            >
              <Icon name="chat" size={18} filled />
              Order on WhatsApp
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-14 flex gap-10">
            {[
              { value: "500+", label: "Sneaker styles" },
              { value: "24h", label: "Kigali delivery" },
              { value: "MoMo", label: "Easy payment" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-heading text-xl font-extrabold text-text">
                  {value}
                </p>
                <p className="font-body text-xs text-text-muted uppercase tracking-wider">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
