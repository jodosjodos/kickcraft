"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/providers/cart-provider";
import { useWishlist } from "@/providers/wishlist-provider";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Deals", href: "/hot-deals" },
  { label: "Men", href: "/shop/men" },
  { label: "Women", href: "/shop/women" },
  { label: "Kids", href: "/shop/kids" },
];

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Desktop nav — fixed, full width */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-container items-center justify-between px-6 py-4">
          {/* Left: logo + links */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="font-heading text-2xl font-extrabold italic uppercase text-primary"
            >
              KICKCRAFT
            </Link>

            <nav>
              <ul className="flex items-center gap-6">
                {navLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "font-heading text-sm font-bold uppercase tracking-tight py-1 transition-colors duration-200",
                        isActive(href)
                          ? "text-primary border-b-2 border-primary"
                          : "text-text-muted hover:text-primary"
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1 text-text-muted">
            <Link
              href="/search"
              className="p-2 hover:text-primary transition-colors duration-200 active:scale-95"
              aria-label="Search"
            >
              <Icon name="search" size={22} />
            </Link>

            <Link
              href="/wishlist"
              className="p-2 hover:text-primary transition-colors duration-200 active:scale-95 relative"
              aria-label="Wishlist"
            >
              <Icon name="favorite" size={22} />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-white font-body text-[10px] font-bold px-1">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="p-2 hover:text-primary transition-colors duration-200 active:scale-95 relative"
              aria-label="Cart"
            >
              <Icon name="shopping_bag" size={22} />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-white font-body text-[10px] font-bold px-1">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <Link
                href={user.role === "admin" ? "/admin/dashboard" : "/account"}
                className="p-2 hover:text-primary transition-colors duration-200 active:scale-95"
                aria-label="Account"
              >
                <Icon name="account_circle" size={22} />
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="ml-2 font-heading text-xs font-bold uppercase tracking-wider border border-border px-3 py-1.5 rounded hover:border-primary hover:text-primary transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Announcement strip — scrolls with page on mobile, fixed offset on desktop */}
      <div className="hidden md:block fixed top-[72px] left-0 right-0 z-40 bg-primary py-2 text-center">
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-white">
          Free Delivery on orders above 20,000 RWF
        </p>
      </div>
    </>
  );
}
