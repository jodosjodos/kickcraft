"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useLogout } from "@/hooks/api/use-auth";
import { useMyOrders } from "@/hooks/api/use-orders";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
      { label: "Analytics", href: "/admin/analytics", icon: "monitoring" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { label: "Products", href: "/admin/products", icon: "inventory_2" },
      { label: "Inventory", href: "/admin/inventory", icon: "warehouse" },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Orders", href: "/admin/orders", icon: "receipt_long", badgeKey: "pending" },
      { label: "Customers", href: "/admin/users", icon: "group" },
      { label: "Reviews", href: "/admin/reviews", icon: "reviews", badgeKey: "reviews" },
      { label: "Discounts", href: "/admin/discounts", icon: "sell" },
      { label: "Deliveries", href: "/admin/deliveries", icon: "local_shipping" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: "settings" },
    ],
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const logoutMutation = useLogout();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: orders } = useMyOrders();

  const pendingCount = (orders ?? []).filter((o) => o.status === "pending").length;
  const MOCK_REVIEW_COUNT = 3;

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      if (!user) {
        window.location.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        window.location.replace("/");
      }
    }
  }, [user, isLoading, pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isLoading || !user || user.role !== "admin") return null;

  function getBadge(key?: string): number {
    if (key === "pending") return pendingCount;
    if (key === "reviews") return MOCK_REVIEW_COUNT;
    return 0;
  }

  const Sidebar = (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-surface h-full">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary flex items-center justify-center shrink-0">
            <span className="font-heading text-xs font-extrabold text-white">KC</span>
          </div>
          <div>
            <Link href="/" className="font-heading text-sm font-extrabold italic uppercase text-text">
              KickCraft
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-body text-[9px] font-bold uppercase tracking-[0.15em] text-text-muted">
                Admin
              </span>
              <span className="w-1 h-1 rounded-full bg-secondary inline-block" />
              <span className="font-body text-[9px] font-bold uppercase tracking-[0.15em] text-secondary">
                Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto flex flex-col gap-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="font-body text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted/40 px-3 mb-1">
              {section.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map(({ label, href, icon, badgeKey }) => {
                const active =
                  href === "/admin/dashboard"
                    ? pathname === href
                    : pathname.startsWith(href);
                const badge = getBadge(badgeKey);

                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 font-body text-sm font-semibold transition-all duration-150 group",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-text-muted hover:text-text hover:bg-surface-elevated"
                    )}
                  >
                    <span
                      className={cn(
                        "material-symbols-outlined text-[17px] transition-none shrink-0",
                        active ? "icon-filled" : "icon-outline"
                      )}
                    >
                      {icon}
                    </span>
                    <span className="flex-1 text-[13px]">{label}</span>
                    {badge > 0 && (
                      <span
                        className={cn(
                          "min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-body text-[10px] font-bold px-1",
                          badgeKey === "reviews"
                            ? "bg-secondary/20 text-secondary"
                            : "bg-primary text-white"
                        )}
                      >
                        {badge > 99 ? "99+" : badge}
                      </span>
                    )}
                    {active && badge === 0 && (
                      <span className="w-1 h-3.5 bg-primary shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-border space-y-0.5">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 font-body text-[13px] text-text-muted hover:text-primary hover:bg-surface-elevated transition-all duration-150"
        >
          <span className="material-symbols-outlined icon-outline text-[17px] shrink-0">storefront</span>
          View Store
        </Link>
        <button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="flex items-center gap-3 px-3 py-2 font-body text-[13px] text-text-muted hover:text-error hover:bg-surface-elevated transition-all duration-150 w-full text-left disabled:opacity-60"
        >
          <span className="material-symbols-outlined icon-outline text-[17px] shrink-0">logout</span>
          Sign Out
        </button>

        {/* User block */}
        <div className="flex items-center gap-3 px-3 py-3 mt-1 border-t border-border">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="font-heading text-xs font-extrabold text-white">
              {getInitials(user.name)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-body text-xs font-semibold text-text truncate">{user.name}</p>
            <p className="font-body text-[9px] text-text-muted truncate">{user.email}</p>
          </div>
          <span className="shrink-0 px-1.5 py-0.5 bg-primary/10 font-body text-[9px] font-bold uppercase tracking-wider text-primary">
            Admin
          </span>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 bottom-0 w-60 z-40">
        {Sidebar}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 flex w-60">{Sidebar}</div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 md:ml-60 min-h-screen bg-background">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-border bg-surface sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary flex items-center justify-center">
              <span className="font-heading text-[10px] font-extrabold text-white">KC</span>
            </div>
            <Link href="/" className="font-heading text-base font-extrabold italic uppercase text-text">
              KickCraft
            </Link>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-text-muted hover:text-text transition-colors"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined icon-outline text-[22px]">menu</span>
          </button>
        </div>

        <div className="p-5 md:p-8">{children}</div>
      </main>
    </div>
  );
}
