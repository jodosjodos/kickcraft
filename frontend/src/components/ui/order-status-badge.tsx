import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/api/orders";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    className: "bg-secondary/10 text-secondary border-secondary/20",
  },
  delivered: {
    label: "Delivered",
    className: "bg-secondary/20 text-secondary border-secondary/30",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-error/10 text-error border-error/20",
  },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 border font-body text-[10px] font-bold uppercase tracking-[0.1em]",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
