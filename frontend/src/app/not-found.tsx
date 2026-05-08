import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SHOE_IMAGES = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0XgqSnNP6yyiZsGtTnwho0QhE5_--2j0vcVeW4w2yRVaRFTaZlVSa54uI7h1y0iGSLoT1pcra7ybwyyw92FL2ESzWeenwFg0Qks5Epc78Shdx_i2cuQqkskCoxKKeUHJhfRXhpuXBWQS06-lhCcjY5reCj9l9fMKyxF3ngA4CgERt7WRp1VALJb1LvfXlBCe_ZQWnzvEHRRGiOtyCd7wy0kNreFWG3YvPeBOEPt0ts3i3vlJLJq9W8txbiQ7iLi5N2tThNsoK9omI",
    alt: "Sneaker sole texture",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqzqF6mcMi5fwQ3mLW6uQoDmMkz_7hYZYzy1PCXXy0LyAlK5kzc_zd2jfoGjL110PmRHRZ2lxursTqUO5FDO9_OwfPm2_ZAsm4yfX969FSM0ftbU2m5A01w65uICC2IDzCxLG6BfmfmpPrBCpQcNE9Y1jGAdOd2yOK-QQIzL3MolrkDMxYYtIOqeqWOo3yYlK_peCTsmPP3EBr_meRCT8T_AydUJ6dhicOSsZLeOK3HE2E6ggtS0mEe2iLxZYgwzjr8sm58gfRiiAd",
    alt: "Sneaker laces",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeZ81mQS3wUTuQ6XQuCYlQuohpsxDc-VR8m6q5-qBo6K2-dSTT3AGmKYQ37CzkAxqTpRhLLwne74aaKd_EG9qnNO-hCd_2yp52vB1DZbafHG1SwTDqPrRQyHtZb54LvOxCSEpRMA2boYR6mbawNR4DFY0Qesn7l44hmZFb5m8E3r9oO0jjLoEol_jfBB6IJvy_zJUmfsK7SjvEDMbvtCXzg1e5JGtSzJzmRROMuEc3T9GZfoXvgoli-w8w5UJsptvlvbEt7dX06dfe",
    alt: "Athletic shoe profile",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDR3-IUUX6e_6ljYJXKXk1j5WZiQA03ntqssCkXdVPsg3bjHpl7ncrScowxXTMoTl0V5s25woOcfS26_NIBX_C3HxVeX5Lcg3ydT2XI3v2ZgfEaTjWgttomqaT-mtLY4S-uk__4XwrtsgSkcWA4kvDx9s8vZBpIzreniOfNCVZvWX6go5MHbYGKqTSQj8wRU1rw0OKMNKjmk9jIhq0G2678tjItAAowmklW5KF0Zogv5EXa4ujXcYaqn7zQF8Xxa4b64lh_fB8tmYuv",
    alt: "Vintage sneaker top view",
  },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Ghost 404 — large background text creating depth */}
      <div
        className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
        aria-hidden="true"
        style={{ opacity: 0.06 }}
      >
        <span
          className="font-heading font-extrabold leading-none text-text select-none"
          style={{ fontSize: "35vw" }}
        >
          404
        </span>
      </div>

      <Header />
      <div className="hidden md:block h-[112px]" aria-hidden="true" />

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-16 text-center relative z-10">
        {/* Big 404 with hover border lines */}
        <div className="relative group cursor-default mb-6">
          <p
            className="font-heading font-extrabold text-primary leading-none select-none tracking-tighter"
            style={{
              fontSize: "clamp(120px, 18vw, 200px)",
              animation: "scale-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            404
          </p>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-t border-b border-border group-hover:border-primary transition-colors duration-500 pointer-events-none scale-110 opacity-25" />
        </div>

        <h1
          className="font-heading text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-text mb-3"
          style={{ animation: "fade-up 0.5s ease both", animationDelay: "0.15s" }}
        >
          Looks like this shoe walked away.
        </h1>

        <p
          className="font-body text-sm text-text-muted max-w-sm mx-auto mb-10"
          style={{ animation: "fade-up 0.5s ease both", animationDelay: "0.25s" }}
        >
          The page you&apos;re looking for doesn&apos;t exist, was moved, or
          maybe it was just a limited release.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
          style={{ animation: "fade-up 0.5s ease both", animationDelay: "0.35s" }}
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center h-12 px-8 font-body text-sm font-bold uppercase tracking-wider bg-primary text-white hover:bg-primary-inverse transition-colors active:scale-95"
          >
            Go Back Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center h-12 px-8 font-body text-sm font-bold uppercase tracking-wider border border-border text-text hover:border-primary hover:text-primary transition-colors active:scale-95"
          >
            Browse All Shoes
          </Link>
        </div>

        {/* Shoe image grid — grayscale at rest, full color on hover */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-lg opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700"
          style={{ animation: "fade-in 0.6s ease both", animationDelay: "0.45s" }}
        >
          {SHOE_IMAGES.map(({ src, alt }, i) => (
            <div
              key={alt}
              className="relative h-24 overflow-hidden bg-surface-elevated border border-border"
              style={{
                animationDelay: `${0.45 + i * 0.07}s`,
              }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 45vw, 130px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
