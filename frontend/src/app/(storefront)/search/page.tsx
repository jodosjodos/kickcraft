import type { Metadata } from "next";
import { ShopContent } from "../shop/_components/shop-content";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" — Search — Kickcraft` : "Search — Kickcraft",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const title = q ? `Results for "${q}"` : "Search";
  return <ShopContent title={title} />;
}
