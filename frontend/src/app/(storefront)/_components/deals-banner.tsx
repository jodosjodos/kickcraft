"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { useEffect, useState } from "react";

function getTimeUntilEndOfMonth(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const diff = Math.max(0, endOfMonth.getTime() - now.getTime());

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function DealsBanner() {
  const [time, setTime] = useState(getTimeUntilEndOfMonth);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeUntilEndOfMonth());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-5 md:px-8">
      <div className="mx-auto max-w-container">
        <div className="relative overflow-hidden rounded border border-primary/20 bg-linear-to-br from-primary/10 via-surface-elevated to-surface-elevated p-8 md:p-12">
          {/* Decorative glow */}
          <div
            className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-secondary/5 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-primary/20 text-primary-muted font-body text-xs font-semibold uppercase tracking-[0.08em] px-3 py-1 rounded-full mb-4">
                <Icon name="local_fire_department" size={14} filled />
                Hot Deals
              </span>
              <h2 className="font-heading text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-text mb-2">
                Up to 40% Off
              </h2>
              <p className="font-body text-sm text-text-muted max-w-md mb-4">
                Flash sales on top brands. Limited stock — grab yours before
                it&apos;s gone.
              </p>

              {/* Countdown timer */}
              <div className="flex items-center gap-2">
                <Icon name="timer" size={14} className="text-primary" />
                <span className="font-body text-xs text-text-muted uppercase tracking-widest">
                  Ends in
                </span>
                <div className="flex items-center gap-1 font-heading text-sm font-extrabold text-primary tracking-wider">
                  <span className="bg-primary/10 px-2 py-0.5 rounded">
                    {pad(time.hours)}h
                  </span>
                  <span className="text-text-muted">:</span>
                  <span className="bg-primary/10 px-2 py-0.5 rounded">
                    {pad(time.minutes)}m
                  </span>
                  <span className="text-text-muted">:</span>
                  <span className="bg-primary/10 px-2 py-0.5 rounded">
                    {pad(time.seconds)}s
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/hot-deals"
              className="self-start md:self-auto inline-flex items-center justify-center gap-2 bg-primary text-white font-body font-semibold text-sm uppercase tracking-wider px-8 py-4 rounded hover:bg-primary-inverse active:scale-95 transition-all duration-200 whitespace-nowrap"
            >
              See All Deals
              <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
