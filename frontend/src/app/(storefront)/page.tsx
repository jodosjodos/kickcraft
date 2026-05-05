import type { Metadata } from "next";
import { HeroSection } from "./_components/hero-section";
import { CategoriesSection } from "./_components/categories-section";
import { FeaturedSection } from "./_components/featured-section";
import { DealsBanner } from "./_components/deals-banner";

export const metadata: Metadata = {
  title: "Kickcraft — Premium Sneakers in Kigali",
  description:
    "Rwanda's premier destination for high-end sneakers and streetwear. Shop Nike, Jordan, Adidas, New Balance and more. Fast Kigali delivery, pay with MTN MoMo.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedSection />
      <DealsBanner />
    </>
  );
}
