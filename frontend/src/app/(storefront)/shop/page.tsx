import type { Metadata } from "next";
import { ShopContent } from "./_components/shop-content";

export const metadata: Metadata = {
  title: "Shop All Shoes — Kickcraft",
  description: "Browse all sneakers and shoes available in Kigali.",
};

export default function ShopPage() {
  return <ShopContent />;
}
