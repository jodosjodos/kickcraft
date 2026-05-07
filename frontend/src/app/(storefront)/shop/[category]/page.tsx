import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ShopContent } from "../_components/shop-content";

const VALID_CATEGORIES: Record<string, string> = {
  men: "Men's Shoes",
  women: "Women's Shoes",
  kids: "Kids' Shoes",
};

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label = VALID_CATEGORIES[category];
  if (!label) return {};
  return {
    title: `${label} — Kickcraft`,
    description: `Shop ${label} in Kigali.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!VALID_CATEGORIES[category]) notFound();
  return (
    <ShopContent
      title={VALID_CATEGORIES[category]}
      defaultCategory={category}
    />
  );
}
