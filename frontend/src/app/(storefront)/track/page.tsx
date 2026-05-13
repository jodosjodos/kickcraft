import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { TrackOrderContent } from "./_components/track-order-content";

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Spinner size="lg" className="text-primary" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
