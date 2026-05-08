import Link from "next/link";

const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "Snapchat", href: "#" },
  { label: "WhatsApp", href: "https://wa.me/250794050537" },
];

const shopLinks = [
  { label: "Shop All", href: "/shop" },
  { label: "Hot Deals", href: "/hot-deals" },
  { label: "Men", href: "/shop/men" },
  { label: "Women", href: "/shop/women" },
  { label: "Kids", href: "/shop/kids" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background pt-20 pb-28 md:pb-10">
      <div className="mx-auto grid max-w-container grid-cols-1 gap-12 px-8 md:grid-cols-5">
        {/* Branding */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="font-heading text-4xl font-extrabold uppercase text-text mb-4">
            KICKCRAFT
          </h2>
          <p className="font-body text-sm text-text-muted max-w-sm leading-relaxed">
            Rwanda&apos;s premier destination for high-end sneakers and
            streetwear culture. Based in Kigali.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-text mb-4">
            Shop
          </h3>
          <ul className="flex flex-col gap-2">
            {shopLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-body text-sm text-text-muted hover:text-text underline decoration-primary underline-offset-4 transition-all duration-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-text mb-4">
            Company
          </h3>
          <ul className="flex flex-col gap-2">
            {[
              { label: "About Us", href: "/about" },
              { label: "Contact", href: "/contact" },
              { label: "Wishlist", href: "/wishlist" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-body text-sm text-text-muted hover:text-text underline decoration-primary underline-offset-4 transition-all duration-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-text mb-4">
            Socials
          </h3>
          <ul className="flex flex-col gap-2">
            {socialLinks.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="font-body text-sm text-text-muted hover:text-text underline decoration-primary underline-offset-4 transition-all duration-300"
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Copyright */}
        <div className="col-span-1 md:col-span-5 mt-8 border-t border-border pt-8">
          <p className="font-body text-xs font-semibold uppercase tracking-wider text-text-muted text-center">
            © {new Date().getFullYear()} Kickcraft Rwanda. High-End Sneaker
            Destination.
          </p>
        </div>
      </div>
    </footer>
  );
}
