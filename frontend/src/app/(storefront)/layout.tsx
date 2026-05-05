import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {/* Spacer: fixed header (72px) + announcement strip (40px) */}
      <div className="hidden md:block h-[112px]" aria-hidden="true" />
      <main className="min-h-screen pb-28 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
      <WhatsAppButton />
    </>
  );
}
