import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 py-12">
      <Link
        href="/"
        className="mb-10 font-heading text-2xl font-extrabold italic uppercase text-primary"
      >
        KICKCRAFT
      </Link>
      {children}
    </div>
  );
}
