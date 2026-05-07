import { Spinner } from "@/components/ui/spinner";

export default function AccountLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner size="lg" className="text-primary" />
    </div>
  );
}
