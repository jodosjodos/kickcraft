import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 text-center">
      <p className="font-heading text-[120px] md:text-[180px] font-extrabold leading-none text-text/5 select-none mb-0">
        404
      </p>
      <div className="-mt-8 md:-mt-12">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-text mb-3">
          Looks like this shoe walked away.
        </h1>
        <p className="font-body text-sm text-text-muted max-w-sm mx-auto mb-10">
          The page you&apos;re looking for doesn&apos;t exist, was moved, or maybe
          it was just a limited release.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-12 px-8 font-body text-base font-semibold uppercase tracking-wider bg-primary text-white hover:bg-primary-inverse transition-colors active:scale-95"
          >
            Go Back Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center h-12 px-8 font-body text-base font-semibold uppercase tracking-wider border border-border text-text hover:border-primary hover:text-primary transition-colors active:scale-95"
          >
            Browse All Shoes
          </Link>
        </div>
      </div>
    </div>
  );
}
