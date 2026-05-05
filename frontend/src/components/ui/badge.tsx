import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/api/orders";

const variants = {
  default: "bg-surface-high text-text-muted",
  primary: "bg-primary/20 text-primary-muted",
  secondary: "bg-secondary/20 text-secondary",
  error: "bg-error/20 text-error",
} as const;

const statusVariants: Record<OrderStatus, string> = {
  pending: "bg-surface-high text-text-muted",
  confirmed: "bg-blue-500/20 text-blue-400",
  out_for_delivery: "bg-primary/20 text-primary-muted",
  delivered: "bg-secondary/20 text-secondary",
  cancelled: "bg-error/20 text-error",
};

type BadgeVariant = keyof typeof variants;

interface BadgeProps {
  variant?: BadgeVariant;
  status?: OrderStatus;
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = "default", status, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5",
        "font-body text-xs font-semibold uppercase tracking-wider",
        status ? statusVariants[status] : variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
