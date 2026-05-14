import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  {
    slug: "men",
    label: "Men",
    description: "Jordans, Dunks & more",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "women",
    label: "Women",
    description: "New Balance, Vans & more",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "kids",
    label: "Kids",
    description: "Converse, Puma & more",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "sports",
    label: "Sports",
    description: "Running, training & more",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-auto lg:h-[460px]">
          {CATEGORIES.map(({ slug, label, description, image }) => (
            <Link
              key={slug}
              href={`/shop/${slug}`}
              className="group relative overflow-hidden rounded border border-border hover:border-primary bg-surface-elevated transition-colors duration-300 min-h-[200px] md:min-h-0"
            >
              {/* Photo */}
              <Image
                src={image}
                alt={`${label}'s shoes`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/30 to-transparent" />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-white group-hover:text-primary transition-colors duration-200">
                  {label}
                </h3>
                <p className="font-body text-xs text-text-muted mt-1">
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
