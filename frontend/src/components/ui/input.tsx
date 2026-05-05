"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-body text-xs font-semibold uppercase tracking-wider text-text-muted"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded border bg-surface px-4 font-body text-sm text-text",
            "placeholder:text-text-muted outline-none transition-colors duration-200",
            "focus:border-primary",
            error ? "border-error" : "border-border",
            className
          )}
          {...props}
        />
        {error && <p className="font-body text-xs text-error">{error}</p>}
        {helper && !error && (
          <p className="font-body text-xs text-text-muted">{helper}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
