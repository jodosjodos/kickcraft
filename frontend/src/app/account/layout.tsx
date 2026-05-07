"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const navItems = [
  { label: "Orders", href: "/account/orders", icon: "receipt_long" },
  { label: "Profile", href: "/account/profile", icon: "person" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading || !user) return null;

  return (
    <div className="max-w-container mx-auto px-5 md:px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-52 shrink-0">
          <div className="mb-4">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
              My Account
            </p>
            <p className="font-body text-sm font-semibold text-text mt-1 truncate">
              {user.name}
            </p>
          </div>

          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto scrollbar-none">
            {navItems.map(({ label, href, icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 font-body text-sm font-semibold shrink-0",
                    "transition-colors duration-150",
                    active
                      ? "text-primary border-l-2 border-primary pl-[10px] bg-primary/5"
                      : "text-text-muted hover:text-text hover:bg-surface-elevated"
                  )}
                >
                  <span className="material-symbols-outlined icon-outline text-[18px]">
                    {icon}
                  </span>
                  {label}
                </Link>
              );
            })}

            <button
              onClick={() => {
                // TODO: call logout when backend ready
                router.push("/");
              }}
              className="flex items-center gap-3 px-3 py-2.5 font-body text-sm font-semibold text-text-muted hover:text-error hover:bg-surface-elevated transition-colors shrink-0 w-full text-left"
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
  );
}
