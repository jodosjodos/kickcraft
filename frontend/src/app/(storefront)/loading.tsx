import { Spinner } from "@/components/ui/spinner";

export default function StorefrontLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" className="text-primary" />
    </div>
  );
}
