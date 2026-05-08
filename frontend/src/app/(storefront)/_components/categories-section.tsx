import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  {
    slug: "men",
    label: "Men",
    description: "Jordans, Dunks & more",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBvLFmBfnNVA9bJijjZph__8KpuIvMmO4Y2TAmqT9GLMhGuAXmCJ27BIddwZ3Qq-bh8cbstcbPyyB-ZtzHwv6LRRTcLb6_jl49bQQpiFVr8jOHLjq1PqdXXGZw3I2j-kX2spGaq4aaS2rXpssMaV6ZmTIw_97lfVIe0ChNkWG885HhTqm8sPsKbqz6MMbJtMkhCVHqrQsj8MODDT1qEbgrqWkk3fDiBdzEDH9zpFamsUOFrc8WPpYt2vmJvFozIjEY3BGu1-zwLiLIN",
  },
  {
    slug: "women",
    label: "Women",
    description: "New Balance, Vans & more",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCGIDc-lpNpj-R7G2E_uQ67RB80Bc_vmaq7ZPG0P2-yKZieZE9ARV-YUsFL92_ahK7Tn02W_2UTCmdrxUR3aJw9GrTtjtTD9plYpwFVIUYIS_HhRHyhYBE3-gTBqqOzcDgrfx3-qCOob-MjddIIRgIz5HQ1MJpPLWW_HbR5RUF12lEWW9szYdXbV-htyzPQ5BC_dvrYJptvdbUCeIIS8dy4dT9tc7Y6NkjUvthU4NBDRpnJ5NiDorsF458C1Nd64oTjGhttlioO-ORs",
  },
  {
    slug: "kids",
    label: "Kids",
    description: "Converse, Puma & more",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFkjOWq_r41Z10pKAIKaG44pHnXpM-fzy4LjNzIAsvs-V-rpKMBiFHyPMesq8bRn2bRlLdrTqfAwL-lZb1G_EV-wIbA73WYamv0wRHhFrk-1bG-xGwiB7y8I9Tg_nJcsJPakqLGLN5Bt3nDcrblaekmBe9B5pzC2CA1DtKkizFhVDDBp7kG9Wp2U0tWrumQMRAwzeGJ44Sz6qEu7Y8sDl8W44i1XQLC7F5XowTX74YrgEGSJ1Vc1u_R5ZVJIjyHMo7WiAM4RRZN9K4",
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
                sizes="(max-width: 768px) 100vw, 33vw"
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
