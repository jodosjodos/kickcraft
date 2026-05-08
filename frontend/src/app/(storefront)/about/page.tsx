import Link from "next/link";
import Image from "next/image";

const PILLARS = [
  {
    icon: "verified",
    title: "Authenticity First",
    body: "Every pair sold on Kickcraft is inspected and verified. No fakes. No excuses.",
  },
  {
    icon: "diversity_3",
    title: "Community Driven",
    body: "We elevate local sneaker culture — buyers, sellers, and collectors all in one place.",
  },
  {
    icon: "payments",
    title: "Flexible Payments",
    body: "50% upfront, 50% on delivery via MTN MoMo. No bank account needed.",
  },
  {
    icon: "local_shipping",
    title: "Kigali Fast",
    body: "Same-day delivery across Kigali. Our riders know the city better than anyone.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-elevated border-b border-border px-5 md:px-8 py-20 md:py-28">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-container">
          <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            Our Story
          </p>
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold uppercase tracking-tight text-text leading-none mb-6">
            Built in
            <br />
            <span className="text-primary">Kigali.</span>
          </h1>
          <p className="font-body text-base md:text-lg text-text-muted leading-relaxed max-w-lg">
            Kickcraft was born from a simple frustration: finding authentic sneakers
            in Kigali was either impossible or required paying 3× the real price to
            a middleman. We decided to fix that.
          </p>
        </div>
      </section>

      {/* Origin story */}
      <section className="py-20 px-5 md:px-8 border-b border-border">
        <div className="mx-auto max-w-container grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-2">
              How it started
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-text mb-5">
              From WhatsApp Group<br />to Full Platform
            </h2>
            <div className="font-body text-sm text-text-muted leading-relaxed space-y-4 max-w-md">
              <p>
                It started as a WhatsApp group. A few friends, a shared love of
                sneakers, and too much time spent hunting for the right pair across
                five different resellers with inconsistent prices.
              </p>
              <p>
                We started pooling our finds — posting real photos, real prices, real
                sizes — and within weeks the group had 200+ members who felt the same
                way we did.
              </p>
              <p>
                Kickcraft is that WhatsApp group, but grown up. A proper marketplace
                with verified stock, fast delivery, and payments built for Rwanda.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative aspect-[4/3] rounded border border-border overflow-hidden bg-surface-elevated">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvLFmBfnNVA9bJijjZph__8KpuIvMmO4Y2TAmqT9GLMhGuAXmCJ27BIddwZ3Qq-bh8cbstcbPyyB-ZtzHwv6LRRTcLb6_jl49bQQpiFVr8jOHLjq1PqdXXGZw3I2j-kX2spGaq4aaS2rXpssMaV6ZmTIw_97lfVIe0ChNkWG885HhTqm8sPsKbqz6MMbJtMkhCVHqrQsj8MODDT1qEbgrqWkk3fDiBdzEDH9zpFamsUOFrc8WPpYt2vmJvFozIjEY3BGu1-zwLiLIN"
              alt="Kickcraft shoes"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="bg-primary text-white font-body text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded">
                Est. Kigali, 2024
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-5 md:px-8 border-b border-border bg-surface-elevated">
        <div className="mx-auto max-w-container grid md:grid-cols-2 gap-8">
          <div className="border border-border rounded p-8">
            <span className="material-symbols-outlined icon-outline text-[32px] text-primary block mb-4">
              flag
            </span>
            <h3 className="font-heading text-xl font-extrabold uppercase tracking-tight text-text mb-3">
              Our Mission
            </h3>
            <p className="font-body text-sm text-text-muted leading-relaxed">
              Make it effortless for Rwandans to buy and sell authentic sneakers at
              fair prices — with a payment system built for how people actually pay
              here.
            </p>
          </div>
          <div className="border border-border rounded p-8">
            <span className="material-symbols-outlined icon-outline text-[32px] text-secondary block mb-4">
              visibility
            </span>
            <h3 className="font-heading text-xl font-extrabold uppercase tracking-tight text-text mb-3">
              Our Vision
            </h3>
            <p className="font-body text-sm text-text-muted leading-relaxed">
              Be the definitive sneaker destination for East Africa — a platform where
              local sneaker culture is celebrated, not imitated from elsewhere.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="py-20 px-5 md:px-8 border-b border-border">
        <div className="mx-auto max-w-container">
          <div className="text-center mb-12">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-2">
              What we stand for
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-text">
              The Kickcraft Way
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map(({ icon, title, body }) => (
              <div
                key={title}
                className="border border-border rounded p-6 bg-surface hover:border-outline transition-colors duration-200"
              >
                <span className="material-symbols-outlined icon-outline text-[32px] text-primary block mb-4">
                  {icon}
                </span>
                <h3 className="font-heading text-base font-extrabold uppercase tracking-tight text-text mb-2">
                  {title}
                </h3>
                <p className="font-body text-sm text-text-muted leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 md:px-8 text-center">
        <div className="mx-auto max-w-container">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-text mb-4">
            Ready to cop?
          </h2>
          <p className="font-body text-sm text-text-muted mb-8 max-w-sm mx-auto">
            Browse the freshest kicks in Kigali. Free delivery on orders above 20,000 RWF.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-primary text-white font-body font-semibold text-sm uppercase tracking-wider px-8 py-3 rounded hover:bg-primary-inverse active:scale-95 transition-all duration-200"
            >
              Shop Now
              <span className="material-symbols-outlined icon-outline text-[16px]">
                arrow_forward
              </span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-border text-text font-body font-semibold text-sm uppercase tracking-wider px-8 py-3 rounded hover:border-primary hover:text-primary transition-colors duration-200"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
