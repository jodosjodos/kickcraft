import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatsCard({
  label,
  value,
  icon,
  trend,
  trendUp,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "border border-border bg-surface p-5 flex flex-col gap-4",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted mb-1">
            {label}
          </p>
          <p className="font-heading text-2xl font-extrabold text-text">
            {value}
          </p>
        </div>
        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined icon-outline text-[22px] text-primary">
            {icon}
          </span>
        </div>
      </div>
      {trend && (
        <p
          className={cn(
            "font-body text-xs",
            trendUp ? "text-secondary" : "text-error"
          )}
        >
          {trendUp ? "↑" : "↓"} {trend}
        </p>
      )}
    </div>
  );
}
