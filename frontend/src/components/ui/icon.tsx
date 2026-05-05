import { cn } from "@/lib/utils";

interface IconProps {
  name: string;
  filled?: boolean;
  size?: number;
  className?: string;
  "aria-label"?: string;
}

export function Icon({
  name,
  filled = false,
  size = 24,
  className,
  "aria-label": ariaLabel,
}: IconProps) {
  return (
    <span
      className={cn(
        "material-symbols-outlined select-none leading-none",
        filled ? "icon-filled" : "icon-outline",
        className
      )}
      style={{ fontSize: size }}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
    >
      {name}
    </span>
  );
}
