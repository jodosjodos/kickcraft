"use client";

import { forwardRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helper?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    { label, error, helper, className, id, type, onFocus, onBlur, value, ...props },
    ref
  ) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    const [focused, setFocused] = useState(false);
    const [showPwd, setShowPwd] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPwd ? "text" : "password") : type;
    const isActive = focused || !!(value as string);

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(true);
        onFocus?.(e);
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(false);
        onBlur?.(e);
      },
      [onBlur]
    );

    return (
      <div className="flex flex-col gap-1">
        <div className="relative">
          {/* Floating label */}
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-4 pointer-events-none transition-all duration-200 font-body select-none z-10",
              isActive
                ? "top-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary"
                : "top-1/2 -translate-y-1/2 text-sm text-text-muted"
            )}
          >
            {label}
          </label>

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              "h-14 w-full bg-surface border font-body text-sm text-text",
              "pt-5 pb-2 px-4",
              "outline-none transition-all duration-200",
              "placeholder:text-transparent",
              focused
                ? "border-primary ring-2 ring-primary/15 shadow-[0_0_0_4px_rgb(255_69_0_/_0.08)]"
                : error
                ? "border-error"
                : "border-border hover:border-outline",
              isPassword && "pr-12",
              className
            )}
            {...props}
          />

          {/* Show/hide toggle for password fields */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              tabIndex={-1}
              aria-label={showPwd ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-text-muted hover:text-text transition-colors"
            >
              <span className="material-symbols-outlined icon-outline text-[18px]">
                {showPwd ? "visibility_off" : "visibility"}
              </span>
            </button>
          )}
        </div>

        {error && (
          <p className="font-body text-xs text-error px-1 flex items-center gap-1">
            <span className="material-symbols-outlined icon-filled text-[12px]">
              error
            </span>
            {error}
          </p>
        )}
        {helper && !error && (
          <p className="font-body text-xs text-text-muted px-1">{helper}</p>
        )}
      </div>
    );
  }
);
AuthInput.displayName = "AuthInput";
