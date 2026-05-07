"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="py-16 text-center">
      <p className="font-body text-sm text-error mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="font-body text-sm text-primary hover:underline underline-offset-4"
      >
        Try again
      </button>
    </div>
  );
}
