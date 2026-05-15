import { redirect, notFound } from "next/navigation";

const VALID_CATEGORIES = ["men", "women", "kids", "sports"];

type Props = { params: Promise<{ category: string }> };

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category)) notFound();
  redirect(`/shop?category=${category}`);
}
