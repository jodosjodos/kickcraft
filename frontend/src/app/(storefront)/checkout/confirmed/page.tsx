import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { OrderConfirmedContent } from "./_components/order-confirmed-content";

export const dynamic = "force-dynamic";

export default function OrderConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Spinner size="lg" className="text-primary" />
        </div>
      }
    >
      <OrderConfirmedContent />
    </Suspense>
  );
}
