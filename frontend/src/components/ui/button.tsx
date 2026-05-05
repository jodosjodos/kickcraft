import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";
import type { ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-inverse active:scale-95",
  secondary:
    "border border-border text-text hover:border-primary hover:text-primary active:scale-95",
  ghost:
    "text-text-muted hover:text-primary active:scale-95",
  destructive:
    "bg-error/20 text-error border border-error hover:bg-error hover:text-background active:scale-95",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-8 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-wider rounded transition-all duration-200 cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
