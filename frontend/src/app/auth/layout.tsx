import Link from "next/link";
import { AuthImagePanel } from "@/components/auth/auth-image-panel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — form */}
      <div className="flex flex-col w-full md:w-1/2 px-6 py-10 md:px-12 lg:px-16 relative">
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary via-primary/40 to-transparent" />

        {/* Logo */}
        <Link
          href="/"
          className="font-heading text-2xl font-extrabold italic uppercase text-primary mb-10 self-start"
        >
          KICKCRAFT
        </Link>

        {/* Form content */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{children}</div>
        </div>

        {/* Footer note */}
        <p className="font-body text-xs text-text-muted text-center mt-8">
          © 2025 Kickcraft · Kigali, Rwanda
        </p>
      </div>

      {/* Right panel — animated slideshow */}
      <AuthImagePanel />
    </div>
  );
}
