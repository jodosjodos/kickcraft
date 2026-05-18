"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const options = [
  {
    value: "system",
    label: "System",
    icon: "computer",
    description: "Follows your device setting",
  },
  {
    value: "light",
    label: "Light",
    icon: "light_mode",
    description: "Always light",
  },
  {
    value: "dark",
    label: "Dark",
    icon: "dark_mode",
    description: "Always dark",
  },
] as const;

export default function AppearancePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text mb-2">
        Appearance
      </h1>
      <p className="font-body text-sm text-text-muted mb-8">
        Choose how Kickcraft looks for you.
      </p>

      <div className="flex flex-col gap-3 max-w-md">
        {options.map(({ value, label, icon, description }) => {
          const active = mounted && theme === value;
          return (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                "flex items-center gap-4 px-5 py-4 border text-left transition-all duration-150",
                active
                  ? "border-primary bg-primary/5 text-text"
                  : "border-border bg-surface text-text-muted hover:border-outline hover:text-text"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[22px]",
                  active ? "icon-filled text-primary" : "icon-outline"
                )}
              >
                {icon}
              </span>
              <div className="flex-1">
                <p className="font-heading text-sm font-bold uppercase tracking-tight">
                  {label}
                </p>
                <p className="font-body text-xs mt-0.5">{description}</p>
              </div>
              {active && (
                <span className="material-symbols-outlined icon-filled text-[18px] text-primary">
                  check_circle
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
