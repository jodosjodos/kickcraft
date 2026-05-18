"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const options = [
  { value: "system", label: "System", icon: "computer" },
  { value: "light", label: "Light", icon: "light_mode" },
  { value: "dark", label: "Dark", icon: "dark_mode" },
] as const;

type ThemeValue = (typeof options)[number]["value"];

const icons: Record<ThemeValue, string> = {
  system: "computer",
  light: "light_mode",
  dark: "dark_mode",
};

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const current = (
    options.some((o) => o.value === theme) ? theme : "system"
  ) as ThemeValue;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle theme"
        aria-expanded={open}
        className={cn(
          "flex items-center justify-center w-9 h-9 transition-colors duration-200",
          open ? "text-primary" : "text-text-muted hover:text-primary"
        )}
      >
        {mounted ? (
          <span className="material-symbols-outlined text-[22px] icon-outline select-none transition-transform duration-200"
            style={{ transform: open ? "rotate(20deg)" : "rotate(0deg)" }}
          >
            {icons[current]}
          </span>
        ) : (
          <span className="w-[22px] h-[22px]" />
        )}
      </button>

      {/* Dropdown */}
      <div
        className={cn(
          "absolute right-0 top-full mt-2 w-36 bg-surface border border-border z-50",
          "origin-top transition-all duration-200",
          open
            ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
        )}
        style={{ transformOrigin: "top right" }}
      >
        {options.map(({ value, label, icon }) => {
          const active = mounted && current === value;
          return (
            <button
              key={value}
              onClick={() => {
                setTheme(value);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2.5 font-body text-xs font-semibold uppercase tracking-wide transition-colors duration-150",
                active
                  ? "text-primary bg-primary/5"
                  : "text-text-muted hover:text-text hover:bg-surface-elevated"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[16px] shrink-0",
                  active ? "icon-filled" : "icon-outline"
                )}
              >
                {icon}
              </span>
              <span className="flex-1 text-left">{label}</span>
              {active && (
                <span className="material-symbols-outlined icon-filled text-[14px] text-primary">
                  check
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
