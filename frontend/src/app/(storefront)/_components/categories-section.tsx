import Link from "next/link";

const CATEGORIES = [
  {
    slug: "men",
    label: "Men",
    description: "Jordans, Dunks & more",
    gradient: "from-orange-950/80 via-orange-900/40 to-surface-elevated/80",
    accent: "border-orange-800/50 hover:border-primary",
  },
  {
    slug: "women",
    label: "Women",
    description: "New Balance, Vans & more",
    gradient: "from-violet-950/80 via-violet-900/40 to-surface-elevated/80",
    accent: "border-violet-800/50 hover:border-primary",
  },
  {
    slug: "kids",
    label: "Kids",
    description: "Converse, Puma & more",
    gradient: "from-emerald-950/80 via-emerald-900/40 to-surface-elevated/80",
    accent: "border-emerald-800/50 hover:border-primary",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-20 px-5 md:px-8">
      <div className="mx-auto max-w-container">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1">
              Browse by
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-text">
              Categories
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-1 font-body text-sm font-semibold uppercase tracking-wider text-text-muted hover:text-primary transition-colors"
          >
            All products →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[520px]">
          {CATEGORIES.map(({ slug, label, description, gradient, accent }) => (
            <Link
              key={slug}
              href={`/shop/${slug}`}
              className={`group relative overflow-hidden rounded border ${accent} bg-surface-elevated transition-colors duration-300 min-h-[200px] md:min-h-0`}
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-linear-to-t ${gradient} transition-opacity duration-500 group-hover:opacity-90`}
              />

              {/* Decorative circle */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white/3 blur-2xl group-hover:scale-150 transition-transform duration-700" />

              {/* Shoe placeholder icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <span className="material-symbols-outlined icon-outline text-[120px] text-text">
                  footwear
                </span>
              </div>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-text group-hover:text-primary transition-colors duration-200">
                  {label}
                </h3>
                <p className="font-body text-xs text-text-muted mt-1 group-hover:text-text-muted/80 transition-colors">
                  {description}
                </p>
                <span className="inline-flex items-center gap-1 mt-3 font-body text-xs font-semibold uppercase tracking-wider text-text-muted group-hover:text-primary transition-colors duration-200">
                  Shop now
                  <span className="material-symbols-outlined icon-outline text-base leading-none transition-transform duration-200 group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
