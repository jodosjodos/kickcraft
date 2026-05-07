import { use } from "react";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { ProductDetail } from "./_components/product-detail";

type Props = { params: Promise<{ slug: string }> };

export default function ProductPage({ params }: Props) {
  const { slug } = use(params);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Spinner size="lg" className="text-primary" />
        </div>
      }
    >
      <ProductDetail slug={slug} />
    </Suspense>
  );
}
