import Link from "next/link";
import Image from "next/image";

const PILLARS = [
  {
    icon: "storefront",
    title: "Dedicated Store",
    body: "A curated digital experience designed specifically for high-end drops, not a chaotic marketplace.",
  },
  {
    icon: "payments",
    title: "50/50 MoMo",
    body: "Flexible trust. Pay 50% upfront via Mobile Money to secure your pair, pay the rest upon delivery.",
  },
  {
    icon: "star",
    title: "Real Reviews",
    body: "Transparency first. Unfiltered feedback from verified buyers to ensure you know exactly what you're getting.",
  },
  {
    icon: "local_shipping",
    title: "Delivery Network",
    body: "Swift, secure, and trackable delivery directly to your location in Kigali and beyond.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background border-b border-border px-5 md:px-8 py-24 md:py-36 text-center">
        {/* Vertical lines texture — matches Stitch design */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0px, transparent 39px, rgba(229,226,225,0.04) 39px, rgba(229,226,225,0.04) 40px)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-container">
          <p className="font-body text-xs font-bold uppercase tracking-[0.25em] text-primary mb-6">
            The Kickcraft Origin
          </p>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tight text-text leading-[1.05]">
            Built in Kigali.
            <br />
            Built to Last.
            <br />
            Built to Win.
          </h1>
        </div>
      </section>

      {/* Origin story */}
      <section className="py-20 px-5 md:px-8 border-b border-border bg-surface-elevated">
        <div className="mx-auto max-w-container grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <div className="border-l-4 border-primary pl-5">
              <h2 className="font-heading text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-text leading-tight">
                The Hustle
                <br />
                Was Real
              </h2>
            </div>
            <div className="font-body text-sm text-text-muted leading-relaxed space-y-4 mt-6 max-w-md">
              <p>
                It started in early 2024, somewhere between Kimironko Market
                and the CBD. We were students, athletes, sneakerheads — trying
                to cop real pairs in Kigali. Every time, same story: inflated
                prices, zero guarantees, and a 50/50 shot at getting fakes.
              </p>
              <p>
                We got burned once too many times. So in March 2024, we stopped
                complaining and started building — a platform built from the
                ground up for Rwandan youth who take their style seriously.
              </p>
              <p className="text-text-muted/70">
                Two years in, we&apos;ve shipped hundreds of verified pairs
                across Kigali. Every shoe authenticated. Every order tracked.
                Every customer treated like they matter — because they do.
                No stress, just heat.
              </p>
            </div>
          </div>

          {/* Athlete image */}
          <div className="relative aspect-4/3 rounded-sm border border-border overflow-hidden bg-surface">
            <Image
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80"
              alt="Athlete lacing up sneakers — Kickcraft"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="bg-surface/90 text-text font-body text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-border">
                Established 2024 · Kigali, Rwanda
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-5 md:px-8 border-b border-border bg-background">
        <div className="mx-auto max-w-container grid md:grid-cols-2 gap-px bg-border">
          <div className="bg-surface p-8 md:p-12">
            <span className="material-symbols-outlined icon-outline text-[28px] text-primary block mb-5">
              flag
            </span>
            <h3 className="font-heading text-lg font-extrabold uppercase tracking-tight text-text mb-3">
              Our Mission
            </h3>
            <p className="font-body text-sm text-text-muted leading-relaxed">
              To elevate sneaker culture in East Africa by providing
              uncompromising access to authentic, premium footwear through a
              seamless, trust-first platform.
            </p>
          </div>
          <div className="bg-surface p-8 md:p-12">
            <span className="material-symbols-outlined icon-outline text-[28px] text-primary block mb-5">
              visibility
            </span>
            <h3 className="font-heading text-lg font-extrabold uppercase tracking-tight text-text mb-3">
              Our Vision
            </h3>
            <p className="font-body text-sm text-text-muted leading-relaxed">
              To become the definitive authority and destination for streetwear
              and high-end sneakers across the continent, defining the standard
              for retail excellence.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Pillars — The Kickcraft Standard */}
      <section className="py-20 px-5 md:px-8 border-b border-border bg-surface-elevated">
        <div className="mx-auto max-w-container">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-text mb-3">
              The Kickcraft Standard
            </h2>
            <p className="font-body text-sm text-text-muted">
              Why we operate differently from the rest of the market.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {PILLARS.map(({ icon, title, body }) => (
              <div key={title} className="bg-surface p-6 md:p-8">
                <span className="material-symbols-outlined icon-outline text-[24px] text-primary block mb-4">
                  {icon}
                </span>
                <h3 className="font-heading text-sm font-extrabold uppercase tracking-tight text-text mb-2">
                  {title}
                </h3>
                <p className="font-body text-xs text-text-muted leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5 md:px-8 text-center bg-background">
        <div className="mx-auto max-w-container">
          <h2 className="font-heading text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-text mb-4">
            Ready to Shop?
          </h2>
          <p className="font-body text-sm text-text-muted mb-10 max-w-sm mx-auto">
            Experience the new standard of sneaker shopping in Rwanda. Secure
            your next pair today.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-primary text-white font-body font-bold text-sm uppercase tracking-wider px-10 py-4 hover:bg-primary-inverse active:scale-95 transition-all duration-200"
          >
            Shop Now
            <span className="material-symbols-outlined icon-outline text-[16px]">
              arrow_forward
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
