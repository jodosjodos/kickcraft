import Image from "next/image";

export function VideoDivider() {
  return (
    <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1800&q=80"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center scale-105"
        aria-hidden="true"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/65" />

      {/* Centred caption */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-5">
        <p className="font-body text-xs font-bold uppercase tracking-[0.25em] text-primary mb-3">
          The Culture
        </p>
        <h2 className="font-heading text-4xl md:text-6xl font-extrabold uppercase tracking-tight text-white leading-tight max-w-2xl">
          Every Step.
          <br />
          Every Drop.
        </h2>
        <p className="font-body text-sm text-white/60 mt-4 max-w-sm">
          Kigali&apos;s streets deserve heat. We deliver it.
        </p>
      </div>
    </section>
  );
}
