"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useLogout } from "@/hooks/api/use-auth";
import { useCart } from "@/providers/cart-provider";
import { useWishlist } from "@/providers/wishlist-provider";
import { Icon } from "@/components/ui/icon";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Sales", href: "/shop" },
  { label: "Deals", href: "/hot-deals" },
  { label: "Men", href: "/shop?category=men" },
  { label: "Women", href: "/shop?category=women" },
  { label: "Kids", href: "/shop?category=kids" },
  { label: "Sports", href: "/shop?category=sports" },
];

const navLinkClass =
  "font-heading text-sm font-bold uppercase tracking-tight py-1 transition-colors duration-200";

function NavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (href: string): boolean => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/shop?category=")) {
      const cat = new URLSearchParams(href.split("?")[1]).get("category");
      return (
        pathname === "/shop" &&
        searchParams.getAll("category").includes(cat ?? "")
      );
    }
    if (href === "/shop") {
      return pathname === "/shop" && searchParams.getAll("category").length === 0;
    }
    return pathname.startsWith(href);
  };

  return (
    <ul className="flex items-center gap-6">
      {navLinks.map(({ label, href }) => (
        <li key={href}>
          <Link
            href={href}
            className={cn(
              navLinkClass,
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
  );
}

function NavLinksFallback() {
  return (
    <ul className="flex items-center gap-6">
      {navLinks.map(({ label, href }) => (
        <li key={href}>
          <Link href={href} className={cn(navLinkClass, "text-text-muted hover:text-primary")}>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const logoutMutation = useLogout();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = useCallback(() => {
    setDropdownOpen(false);
    logoutMutation.mutate();
  }, [logoutMutation]);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

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
              <Suspense fallback={<NavLinksFallback />}>
                <NavLinks />
              </Suspense>
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
              aria-label="Bag"
            >
              <Icon name="shopping_bag" size={22} />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-white font-body text-[10px] font-bold px-1">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <ThemeToggle className="p-2 active:scale-95" />

            {user ? (
              <div className="relative ml-1" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className={cn(
                    "p-2 transition-colors duration-200 active:scale-95",
                    dropdownOpen ? "text-primary" : "hover:text-primary"
                  )}
                  aria-label="Account menu"
                  aria-expanded={dropdownOpen}
                >
                  <Icon name="account_circle" size={22} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-surface border border-border shadow-[0_8px_24px_rgba(0,0,0,0.4)] z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-heading text-sm font-extrabold uppercase tracking-tight text-text truncate">
                        {user.name}
                      </p>
                      <p className="font-body text-xs text-text-muted truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href={user.role === "admin" ? "/admin/dashboard" : "/account"}
                        className="flex items-center gap-2.5 px-4 py-2.5 font-body text-sm text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
                      >
                        <Icon
                          name={user.role === "admin" ? "dashboard" : "person"}
                          size={16}
                        />
                        {user.role === "admin" ? "Dashboard" : "My Account"}
                      </Link>

                      {user.role === "user" && (
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-2.5 px-4 py-2.5 font-body text-sm text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
                        >
                          <Icon name="package_2" size={16} />
                          My Orders
                        </Link>
                      )}

                      <div className="my-1 border-t border-border" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 font-body text-sm text-error hover:bg-error/8 transition-colors"
                      >
                        <Icon name="logout" size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
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

      {/* Announcement strip */}
      <div className="hidden md:block fixed top-[72px] left-0 right-0 z-40 bg-primary py-2 text-center">
        <p className="font-body text-xs font-semibold uppercase tracking-wider text-white">
          Free Delivery on orders above 20,000 RWF
        </p>
      </div>
    </>
  );
}
