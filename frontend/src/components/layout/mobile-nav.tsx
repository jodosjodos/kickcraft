"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  primary?: boolean;
}

const navItems: NavItem[] = [
  { label: "Shop", href: "/shop", icon: "storefront" },
  { label: "Search", href: "/search", icon: "search" },
  { label: "Home", href: "/", icon: "home", primary: true },
  { label: "Cart", href: "/cart", icon: "shopping_bag" },
  { label: "Account", href: "/account", icon: "person" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background px-4 h-16 shadow-[0_-4px_20px_rgba(255,69,0,0.08)]">
      {navItems.map(({ label, href, icon, primary }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);

        if (primary) {
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className="-mt-5 flex flex-col items-center justify-center rounded-full border-4 border-background bg-primary p-3 text-white active:scale-90 transition-transform"
            >
              <Icon name={icon} size={22} filled={isActive} />
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
              "flex flex-col items-center justify-center gap-0.5 p-2 transition-colors duration-200",
              isActive ? "text-primary" : "text-text-muted hover:text-primary"
            )}
          >
            <Icon name={icon} size={22} filled={isActive} />
            <span className="font-heading text-[9px] font-bold uppercase tracking-widest">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
