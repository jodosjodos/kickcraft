import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  delta?: string;
  className?: string;
}

export function StatsCard({
  label,
  value,
  icon,
  trend,
  trendUp,
  delta,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "border border-border bg-surface p-5 hover:border-outline transition-colors duration-200 relative overflow-hidden",
        className
      )}
    >
      {/* Top row: icon + delta badge */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined icon-filled text-[20px] text-primary">
            {icon}
          </span>
        </div>
        {delta && (
          <span
            className={cn(
              "font-body text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 shrink-0",
              trendUp ? "text-secondary bg-secondary/10" : "text-error bg-error/10"
            )}
          >
            {delta}
          </span>
        )}
      </div>

      {/* Value */}
      <p className="font-heading text-2xl font-extrabold text-text leading-none mb-1">
        {value}
      </p>

      {/* Label */}
      <p className="font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
        {label}
      </p>

      {/* Trend */}
      {trend && (
        <p
          className={cn(
            "font-body text-xs mt-3 flex items-center gap-1",
            trendUp === true
              ? "text-secondary"
              : trendUp === false
              ? "text-error"
              : "text-text-muted"
          )}
        >
          {trendUp !== undefined && (
            <span className="material-symbols-outlined icon-filled text-[13px]">
              {trendUp ? "trending_up" : "trending_down"}
            </span>
          )}
          {trend}
        </p>
      )}

      {/* Subtle corner accent */}
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-primary/[0.03] rounded-tl-full pointer-events-none" />
    </div>
  );
}
