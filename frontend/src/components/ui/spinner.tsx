import { cn } from "@/lib/utils";

const sizes = {
  sm: "h-3.5 w-3.5 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-7 w-7 border-[3px]",
};

interface SpinnerProps {
  size?: keyof typeof sizes;
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block rounded-full border-current border-t-transparent animate-spin",
        sizes[size],
        className
      )}
    />
  );
}
