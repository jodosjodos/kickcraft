"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: "md" | "lg";
}

export function SlideOver({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = "md",
}: SlideOverProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        style={{ animation: "fade-in 0.2s ease both" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "relative ml-auto flex flex-col h-full bg-surface border-l border-border shadow-2xl",
          width === "lg" ? "w-full max-w-2xl" : "w-full max-w-lg"
        )}
        style={{ animation: "fade-up 0.25s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-border shrink-0">
          <div>
            <h2 className="font-heading text-lg font-extrabold uppercase tracking-tight text-text">
              {title}
            </h2>
            {subtitle && (
              <p className="font-body text-xs text-text-muted mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-text-muted hover:text-text hover:bg-surface-elevated transition-colors shrink-0"
          >
            <span className="material-symbols-outlined icon-outline text-[20px]">
              close
            </span>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-border bg-surface shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
