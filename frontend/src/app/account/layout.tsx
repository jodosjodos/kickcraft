"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useLogout } from "@/hooks/api/use-auth";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const navItems = [
  { label: "Orders", href: "/account/orders", icon: "receipt_long" },
  { label: "Profile", href: "/account/profile", icon: "person" },
  { label: "Security", href: "/account/security", icon: "shield" },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading || !user) return null;

  return (
    <div className="bg-background min-h-screen">
      {/* Top banner */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-container px-5 md:px-8 pt-4 pb-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-body text-xs text-text-muted hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined icon-outline text-[14px]">
              arrow_back
            </span>
            Back to shop
          </Link>
        </div>
        <div className="mx-auto max-w-container px-5 md:px-8 py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="font-heading text-base font-extrabold text-white">
              {getInitials(user.name)}
            </span>
          </div>
          <div>
            <p className="font-heading text-base font-extrabold uppercase tracking-tight text-text">
              {user.name}
            </p>
            <p className="font-body text-xs text-text-muted">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-container px-5 md:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-52 shrink-0">
            <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto scrollbar-none">
              {navItems.map(({ label, href, icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 font-body text-sm font-semibold shrink-0 transition-all duration-150",
                      active
                        ? "bg-primary/10 text-primary border-l-2 border-primary"
                        : "text-text-muted hover:text-text hover:bg-surface-elevated border-l-2 border-transparent"
                    )}
                  >
                    <span
                      className={cn(
                        "material-symbols-outlined text-[18px]",
                        active ? "icon-fill" : "icon-outline"
                      )}
                    >
                      {icon}
                    </span>
                    {label}
                  </Link>
                );
              })}

              <button
                onClick={() => logoutMutation.mutate()}
                className="flex items-center gap-3 px-4 py-3 font-body text-sm font-semibold text-text-muted hover:text-error hover:bg-surface-elevated transition-all duration-150 shrink-0 w-full text-left border-l-2 border-transparent"
              >
                <span className="material-symbols-outlined icon-outline text-[18px]">
                  logout
                </span>
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
