"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const LOGIN_SLIDES = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvLFmBfnNVA9bJijjZph__8KpuIvMmO4Y2TAmqT9GLMhGuAXmCJ27BIddwZ3Qq-bh8cbstcbPyyB-ZtzHwv6LRRTcLb6_jl49bQQpiFVr8jOHLjq1PqdXXGZw3I2j-kX2spGaq4aaS2rXpssMaV6ZmTIw_97lfVIe0ChNkWG885HhTqm8sPsKbqz6MMbJtMkhCVHqrQsj8MODDT1qEbgrqWkk3fDiBdzEDH9zpFamsUOFrc8WPpYt2vmJvFozIjEY3BGu1-zwLiLIN",
    lines: ["Welcome", "Back."],
    sub: "Your next pair is waiting.",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAk86VJoETBMB1mP_aF7sDBZ2iyTs54d4APlfhfkEqQHIMLyfGRjvLl2WQskoitBeEylkS3QGpJjBPmDE4LwgPXMi0IgkEhuupb_kxKaPIyt1kYRnrXcm6mYu37aWtamiyRfDwOTbBjlRs5Bqd4WXwYg2iFJEtNNBBqWnDcC-z7rhwcLmPb_wprR17leS7lwvtMYrG0IpwSIsjozCWe00hX4W89q7v3TjiULJHdgQzm1RrifyFSaSV64tiwm7may-vOh1wgx7kW2hig",
    lines: ["Authentic Kicks.", "Fair Prices."],
    sub: "Fast delivery across Kigali.",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGIDc-lpNpj-R7G2E_uQ67RB80Bc_vmaq7ZPG0P2-yKZieZE9ARV-YUsFL92_ahK7Tn02W_2UTCmdrxUR3aJw9GrTtjtTD9plYpwFVIUYIS_HhRHyhYBE3-gTBqqOzcDgrfx3-qCOob-MjddIIRgIz5HQ1MJpPLWW_HbR5RUF12lEWW9szYdXbV-htyzPQ5BC_dvrYJptvdbUCeIIS8dy4dT9tc7Y6NkjUvthU4NBDRpnJ5NiDorsF458C1Nd64oTjGhttlioO-ORs",
    lines: ["Kigali's", "Sneaker Spot."],
    sub: "Find your perfect pair today.",
  },
];

const REGISTER_SLIDES = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFkjOWq_r41Z10pKAIKaG44pHnXpM-fzy4LjNzIAsvs-V-rpKMBiFHyPMesq8bRn2bRlLdrTqfAwL-lZb1G_EV-wIbA73WYamv0wRHhFrk-1bG-xGwiB7y8I9Tg_nJcsJPakqLGLN5Bt3nDcrblaekmBe9B5pzC2CA1DtKkizFhVDDBp7kG9Wp2U0tWrumQMRAwzeGJ44Sz6qEu7Y8sDl8W44i1XQLC7F5XowTX74YrgEGSJ1Vc1u_R5ZVJIjyHMo7WiAM4RRZN9K4",
    lines: ["Your Journey", "Starts Here."],
    sub: "Join thousands of sneaker lovers.",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5sjw4u7yVhUa7HmtviUYddVArv_7obv6egfnb5MQpJl_AF_YO_-QJLBjJhkzaHfYFGDozrY9atNJFFb4iO2UKOst2EN36ib-VKIyIeTuERHhenNhw8IhwFVaYy6vKH5ldRndC8481lJzCIC39XKC1mEgKEhoRJfO048KEZpByyEb9LMqYCFV2YaP4vOrhi9PTTCmxf_AJOPw8U_F9kGPOpnQtWzg-elJB4xltuMkk-AHMs7xgKlVERDKt4bZoIyH4NwG9LchCyfpY",
    lines: ["Exclusive", "Drops."],
    sub: "Be first to shop new arrivals.",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeZ81mQS3wUTuQ6XQuCYlQuohpsxDc-VR8m6q5-qBo6K2-dSTT3AGmKYQ37CzkAxqTpRhLLwne74aaKd_EG9qnNO-hCd_2yp52vB1DZbafHG1SwTDqPrRQyHtZb54LvOxCSEpRMA2boYR6mbawNR4DFY0Qesn7l44hmZFb5m8E3r9oO0jjLoEol_jfBB6IJvy_zJUmfsK7SjvEDMbvtCXzg1e5JGtSzJzmRROMuEc3T9GZfoXvgoli-w8w5UJsptvlvbEt7dX06dfe",
    lines: ["Free", "Account."],
    sub: "Track orders, save wishlist, pay easy.",
  },
];

export function AuthImagePanel() {
  const pathname = usePathname();
  const slides = pathname?.includes("register") ? REGISTER_SLIDES : LOGIN_SLIDES;

  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
      setAnimKey((k) => k + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="hidden md:block relative w-1/2 overflow-hidden bg-surface-elevated">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <Image
            src={slide.src}
            alt="Kickcraft sneakers"
            fill
            sizes="50vw"
            className={cn(
              "object-cover transition-transform ease-linear",
              i === current ? "scale-[1.06] duration-[8000ms]" : "scale-100 duration-700"
            )}
            priority={i === 0}
          />
        </div>
      ))}

      {/* Gradient — left fade + bottom fade */}
      <div className="absolute inset-0 bg-linear-to-r from-background/80 via-background/40 to-transparent z-10" />
      <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent z-10" />

      {/* Corner brand mark */}
      <div className="absolute top-8 right-8 z-20">
        <p className="font-heading text-sm font-extrabold italic uppercase text-white/20 tracking-widest">
          KICKCRAFT
        </p>
      </div>

      {/* Bottom tagline */}
      <div className="absolute bottom-12 left-10 right-10 z-20">
        <p className="font-body text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-3">
          Kigali&apos;s sneaker destination
        </p>

        {/* Animated text — re-mounts on slide change */}
        <div
          key={animKey}
          style={{ animation: "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <h2 className="font-heading text-4xl font-extrabold uppercase tracking-tight text-white leading-[1.05] mb-2">
            {slides[current].lines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="font-body text-sm text-white/60">{slides[current].sub}</p>
        </div>

        {/* Dot/bar progress indicators */}
        <div className="flex items-center gap-2 mt-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrent(i);
                setAnimKey((k) => k + 1);
              }}
              aria-label={`Slide ${i + 1}`}
              className={cn(
                "h-0.5 transition-all duration-400",
                i === current
                  ? "w-8 bg-primary"
                  : "w-3 bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
