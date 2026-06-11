import Link from "next/link";
import Image from "next/image";

export function PromoBanner() {
  return (
    <section className="px-5 md:px-8 py-6">
      <div className="mx-auto max-w-container">
        <Link
          href="/hot-deals"
          className="group relative flex overflow-hidden rounded border border-border bg-surface-elevated min-h-[180px] md:min-h-[220px]"
        >
          {/* Background image */}
          <Image
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80"
            alt="New arrivals promo"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/50 to-transparent" />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center px-8 md:px-12 py-8 max-w-lg">
            <span className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
              New Arrivals
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-text leading-tight mb-4">
              Fresh Kicks.
              <br />
              Just Dropped.
            </h2>
            <span className="inline-flex items-center gap-2 self-start bg-primary text-white font-body font-bold text-xs uppercase tracking-wider px-6 py-3 group-hover:bg-primary-inverse transition-colors duration-200">
              Shop Now
              <span className="material-symbols-outlined icon-outline text-[14px]">
                arrow_forward
              </span>
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
