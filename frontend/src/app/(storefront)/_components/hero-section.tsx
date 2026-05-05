import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-surface">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-background/40" />
      <div
        className="absolute right-0 top-0 h-full w-1/2 bg-linear-to-l from-primary/5 to-transparent"
        aria-hidden="true"
      />
      {/* Decorative accent circle */}
      <div
        className="absolute right-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute right-[5%] bottom-[10%] h-[250px] w-[250px] rounded-full bg-secondary/5 blur-3xl"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-container px-5 md:px-8 py-20">
        <div className="max-w-2xl">
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
              href="https://wa.me/250700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-border text-text font-body font-semibold text-sm uppercase tracking-wider px-8 py-4 rounded hover:border-secondary hover:text-secondary active:scale-95 transition-all duration-200"
            >
              <Icon name="chat" size={18} filled />
              Order on WhatsApp
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-14 flex gap-8">
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
