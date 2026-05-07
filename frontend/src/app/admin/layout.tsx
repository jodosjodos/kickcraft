"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
  { label: "Products", href: "/admin/products", icon: "inventory_2" },
  { label: "Orders", href: "/admin/orders", icon: "receipt_long" },
  { label: "Deliveries", href: "/admin/deliveries", icon: "local_shipping" },
  { label: "Users", href: "/admin/users", icon: "group" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (user.role !== "admin") {
        router.replace("/");
      }
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading || !user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-surface fixed top-0 left-0 bottom-0 z-40">
        <div className="px-5 py-6 border-b border-border">
          <Link
            href="/"
            className="font-heading text-xl font-extrabold italic uppercase text-primary"
          >
            KICKCRAFT
          </Link>
          <p className="font-body text-[10px] text-text-muted uppercase tracking-[0.1em] mt-0.5">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map(({ label, href, icon }) => {
            const active =
              href === "/admin/dashboard"
                ? pathname === href
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 font-body text-sm font-semibold transition-colors duration-150",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:text-text hover:bg-surface-elevated"
                )}
              >
                <span className="material-symbols-outlined icon-outline text-[20px]">
                  {icon}
                </span>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-border">
          <div className="px-3 py-2 mb-1">
            <p className="font-body text-xs font-semibold text-text truncate">
              {user.name}
            </p>
            <p className="font-body text-[10px] text-text-muted uppercase tracking-wider">
              Admin
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 font-body text-sm text-text-muted hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined icon-outline text-[18px]">
              storefront
            </span>
            View Store
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-60 min-h-screen bg-background">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
