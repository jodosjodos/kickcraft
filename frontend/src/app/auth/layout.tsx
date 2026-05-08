import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — form */}
      <div className="flex flex-col w-full md:w-1/2 px-6 py-10 md:px-12 lg:px-16">
        {/* Logo */}
        <Link
          href="/"
          className="font-heading text-2xl font-extrabold italic uppercase text-primary mb-10 self-start"
        >
          KICKCRAFT
        </Link>

        {/* Content */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{children}</div>
        </div>

        {/* Footer note */}
        <p className="font-body text-xs text-text-muted text-center mt-8">
          © 2024 Kickcraft · Kigali, Rwanda
        </p>
      </div>

      {/* Right panel — hero image (desktop only) */}
      <div className="hidden md:block relative w-1/2 overflow-hidden bg-surface-elevated">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvLFmBfnNVA9bJijjZph__8KpuIvMmO4Y2TAmqT9GLMhGuAXmCJ27BIddwZ3Qq-bh8cbstcbPyyB-ZtzHwv6LRRTcLb6_jl49bQQpiFVr8jOHLjq1PqdXXGZw3I2j-kX2spGaq4aaS2rXpssMaV6ZmTIw_97lfVIe0ChNkWG885HhTqm8sPsKbqz6MMbJtMkhCVHqrQsj8MODDT1qEbgrqWkk3fDiBdzEDH9zpFamsUOFrc8WPpYt2vmJvFozIjEY3BGu1-zwLiLIN"
          alt="Premium sneakers"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-background/60 via-background/20 to-transparent" />

        {/* Tagline */}
        <div className="absolute bottom-12 left-10 right-10">
          <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
            Kigali&apos;s sneaker destination
          </p>
          <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white leading-tight">
            Authentic kicks.
            <br />
            Fair prices.
            <br />
            Fast delivery.
          </h2>
        </div>
      </div>
    </div>
  );
}
