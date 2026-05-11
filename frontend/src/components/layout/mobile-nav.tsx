"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useLogout } from "@/hooks/api/use-auth";
import { useCart } from "@/providers/cart-provider";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const logoutMutation = useLogout();
  const { itemCount } = useCart();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const accountHref = user
    ? user.role === "admin"
      ? "/admin/dashboard"
      : "/account"
    : "/auth/login";
  const accountLabel = user ? (user.role === "admin" ? "Admin" : "Account") : "Login";
  const accountIcon = user ? "account_circle" : "login";

  const baseItems = [
    { label: "Shop", href: "/shop", icon: "storefront" },
    { label: "Search", href: "/search", icon: "search" },
    { label: "Home", href: "/", icon: "home", primary: true },
    { label: "Cart", href: "/cart", icon: "shopping_bag", badge: itemCount },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background px-4 h-16 shadow-[0_-4px_20px_rgba(255,69,0,0.08)]">
      {baseItems.map(({ label, href, icon, primary, badge }) => {
        const active = isActive(href);

        if (primary) {
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className="-mt-5 flex flex-col items-center justify-center rounded-full border-4 border-background bg-primary p-3 text-white active:scale-90 transition-transform"
            >
              <Icon name={icon} size={22} filled={active} />
              <span className="font-heading text-[9px] font-bold uppercase tracking-widest mt-0.5">
                {label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={cn(
              "relative flex flex-col items-center justify-center gap-0.5 p-2 transition-colors duration-200",
              active ? "text-primary" : "text-text-muted hover:text-primary"
            )}
          >
            <Icon name={icon} size={22} filled={active} />
            {badge && badge > 0 && (
              <span className="absolute top-0 right-0 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-primary text-white font-body text-[9px] font-bold px-0.5">
                {badge > 99 ? "99+" : badge}
              </span>
            )}
            <span className="font-heading text-[9px] font-bold uppercase tracking-widest">
              {label}
            </span>
          </Link>
        );
      })}

      {/* Account / Login / Logout */}
      {user ? (
        <button
          onClick={() => logoutMutation.mutate()}
          aria-label="Sign out"
          className="flex flex-col items-center justify-center gap-0.5 p-2 text-text-muted hover:text-error transition-colors duration-200"
        >
          <Icon name="logout" size={22} />
          <span className="font-heading text-[9px] font-bold uppercase tracking-widest">
            {accountLabel}
          </span>
        </button>
      ) : (
        <Link
          href={accountHref}
          aria-label={accountLabel}
          className={cn(
            "flex flex-col items-center justify-center gap-0.5 p-2 transition-colors duration-200",
            isActive(accountHref) ? "text-primary" : "text-text-muted hover:text-primary"
          )}
        >
          <Icon name={accountIcon} size={22} filled={isActive(accountHref)} />
          <span className="font-heading text-[9px] font-bold uppercase tracking-widest">
            {accountLabel}
          </span>
        </Link>
      )}
    </nav>
  );
}
