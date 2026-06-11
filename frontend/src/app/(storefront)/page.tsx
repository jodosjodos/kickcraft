import type { Metadata } from "next";
import { HeroSection } from "./_components/hero-section";
import { CategoriesSection } from "./_components/categories-section";
import { VideoDivider } from "./_components/video-divider";
import { PromoBanner } from "./_components/promo-banner";
import { FeaturedSection } from "./_components/featured-section";
import { TestimonialsSection } from "./_components/testimonials-section";
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
      <VideoDivider />
      <PromoBanner />
      <FeaturedSection />
      <TestimonialsSection />
      <DealsBanner />
    </>
  );
}
