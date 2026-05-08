"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
import { useEffect, useCallback, useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
  { label: "Products", href: "/admin/products", icon: "inventory_2" },
  { label: "Orders", href: "/admin/orders", icon: "receipt_long" },
  { label: "Deliveries", href: "/admin/deliveries", icon: "local_shipping" },
  { label: "Users", href: "/admin/users", icon: "group" },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (user.role !== "admin") {
        router.replace("/");
      }
    }
  }, [user, isLoading, pathname, router]);

  const handleLogout = useCallback(() => {
    logout();
    router.replace("/");
  }, [logout, router]);

  if (isLoading || !user || user.role !== "admin") return null;

  const Sidebar = (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-surface h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-border flex items-center justify-between">
        <div>
          <Link
            href="/"
            className="font-heading text-xl font-extrabold italic uppercase text-primary"
          >
            KICKCRAFT
          </Link>
          <p className="font-body text-[10px] text-text-muted uppercase tracking-[0.12em] mt-0.5">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon }) => {
          const active =
            href === "/admin/dashboard"
              ? pathname === href
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 font-body text-sm font-semibold rounded-sm transition-all duration-150",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:text-text hover:bg-surface-elevated"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-[20px] transition-none",
                  active ? "icon-fill" : "icon-outline"
                )}
              >
                {icon}
              </span>
              {label}
              {active && (
                <span className="ml-auto w-1 h-4 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-border flex flex-col gap-0.5">
        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="font-heading text-xs font-extrabold text-white">
              {getInitials(user.name)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-body text-xs font-semibold text-text truncate">
              {user.name}
            </p>
            <p className="font-body text-[10px] text-text-muted uppercase tracking-wider">
              Admin
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 font-body text-sm text-text-muted hover:text-primary hover:bg-surface-elevated rounded-sm transition-all duration-150"
        >
          <span className="material-symbols-outlined icon-outline text-[18px]">
            storefront
          </span>
          View Store
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 font-body text-sm text-text-muted hover:text-error hover:bg-surface-elevated rounded-sm transition-all duration-150 w-full text-left"
        >
          <span className="material-symbols-outlined icon-outline text-[18px]">
            logout
          </span>
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 bottom-0 w-60 z-40">
        {Sidebar}
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 flex w-60">
            {Sidebar}
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 md:ml-60 min-h-screen bg-background">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-border bg-surface sticky top-0 z-30">
          <Link
            href="/"
            className="font-heading text-lg font-extrabold italic uppercase text-primary"
          >
            KICKCRAFT
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-text-muted hover:text-text transition-colors"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined icon-outline text-[22px]">
              menu
            </span>
          </button>
        </div>
        <div className="p-5 md:p-8">{children}</div>
      </main>
    </div>
  );
}
