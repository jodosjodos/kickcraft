"use client";

import { Button } from "@/components/ui/button";

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text">
        Something went wrong
      </p>
      <p className="font-body text-sm text-text-muted max-w-sm">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button variant="primary" size="md" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
