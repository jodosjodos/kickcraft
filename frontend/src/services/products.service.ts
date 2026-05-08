import type {
  Product,
  ProductFilters,
} from "@/types/api/products";
import type { PaginatedResponse } from "@/types/api/common";

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function img(url: string, alt: string, order = 0) {
  return { id: `${order}`, url, alt, order };
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "air-jordan-1-retro-high-chicago",
    name: "Air Jordan 1 Retro High OG 'Chicago'",
    brand: "Jordan Brand",
    price: 245000,
    images: [
      img(
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAzuOuEY8cePX82qUzkrKwMXwzhsV_MNizHkHpo9O6d9_R8U4j2Pos_J8apP75bjfO-74aQBoXoSNQ9IFjcyhsVSgS6zQqJqEcHnCPQPNSVTWMkgHLZp7PLWZUIMLZCCmCokk_2AX9WiEygzTbiQKbeZSDQDqHqJQFEv8tVPRMd6p0ndoXtRIRtW7TI5Q_zMqb_naEmzeH96BgQC54qpLNd8DiaBQ3j1aNMmOnc_O-RUefBgDQkSv60YywiziwJagAMsFuRPMZBofQO",
        "Air Jordan 1 Retro High OG Chicago",
        0
      ),
      img(
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAw5SpcJTpZo-K7PaDZaY7DKH3T6N_N21OMQbY7P75jSyZPwjNKrer5y7IS13SEXp9xpRUwo4SVNtwhebny_cPPcknSjdfkKybfuw7KiNAt0XZM1Hn7nf0aUS_AOwKxRbg7SUX1wrMxLXXqjq_1Oo5inp-30y-Ta0pitVWrtkYlea-ymFHmO59ImU1YghcNixgAwPLS4U1AUaJZDvYIwLWvQ8fy9j9qLteIcBlyLXz_iZUCN1-dfO3QFmfPeKQ6KoHomrtFic7jxpa0",
        "Air Jordan 1 Chicago side view",
        1
      ),
    ],
    sizes: ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"],
    category: "men",
    subCategory: "sneakers",
    description:
      "The Air Jordan 1 Retro High OG 'Chicago' Lost & Found brings back the classic colorway that started it all. Premium leather construction with deliberate aged detailing. Classic Varsity Red, Black, and Sail color blocking.",
    stock: 5,
    status: "active",
    colors: ["#B22222", "#001F5B"],
    rating: 4.8,
    reviewCount: 12,
  },
  {
    id: "2",
    slug: "new-balance-550-white-green",
    name: "550 White Green",
    brand: "New Balance",
    price: 145000,
    images: [
      img(
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD9oiAzknuK_64tCOrgxaD0SHqFZvzpVsUiNIqiEiDcPcY5TDNB0AvqrmYMyjfSkxZg9aWxNbGXYN8xrc8x-TPf0vpsSqLUfGiIXE7xor_ZIKAzXL94F7TmxrEB_Wa25a_zQfCPBmfv1Jcd6RX90L_NbR3nF56XVNXJx2ttudMd_xD5QBkKk5OW1VVscZS1q8M7bEFgUKzDMRuFbGiXO2I7h8G1to41P6hhJXUQjXXMkj-0_KfdaSRqkAhCCOlcmLP6pLANNKVqU9BR",
        "New Balance 550 White Green",
        0
      ),
    ],
    sizes: ["37", "38", "39", "40", "41", "42", "43"],
    category: "men",
    subCategory: "sneakers",
    description:
      "Originally designed for on-court performance in 1989, the 550 is back. Premium leather upper with the iconic NB branding. Clean white and green colourway built for the streets.",
    stock: 15,
    status: "active",
    isNew: true,
    colors: ["#FFFFFF", "#2D6A2D"],
    rating: 4.5,
    reviewCount: 28,
  },
  {
    id: "3",
    slug: "nike-dunk-high-retro",
    name: "Dunk High Retro",
    brand: "Nike",
    price: 130000,
    images: [
      img(
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAkKGNtDDiXeY-CE7b0XDi9HWic7F0NFPyvoEcTw1nw5LbkKmTv_D_LkMMD4C-jz6JDFFGt2X_nf7Ta4B-v5IpsrV5BC3a6Sexb0p3Oe7PUpYdSrjrumdbKZi9EtSGB1L6HauOL1J9AlGS_yO0DrH7FPRvXdk6HhCRZumt4yYSBEItgaWS-Iav8h0az2xd7yL1c0CfwK5MboDC7NiKB5tTKbCdhKlbtxXziACit0kVqWyFdS7vcEHobmIUP3bNZImdvOMlObaHKNzI6",
        "Nike Dunk High Retro",
        0
      ),
    ],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    category: "men",
    subCategory: "sneakers",
    description:
      "Created for the hardwood but taken to the streets, the Nike Dunk Low Retro returns with crisp overlays and bold colour-blocking.",
    stock: 9,
    status: "active",
    colors: ["#C41E3A", "#1B4F8A", "#F5D020"],
    rating: 4.6,
    reviewCount: 19,
  },
  {
    id: "4",
    slug: "adidas-ultraboost-22",
    name: "Ultraboost 22",
    brand: "Adidas",
    price: 165000,
    images: [
      img(
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCWDqXVFHEceDa0soVytZHhei2uFEKOgswzg2KvkXD1oidJupxGzpgeBuZ1pCkpB4pTIc1njVhhQKDy7gFXv8fmsen37LHE1MI7YIz431uvX2l2s9CUB7WW7j51LephtCegsbuvNMbTJ_3GhcYb9JXw_nyzozMy_OBJ2VlIt3srES9XzGKxPH8xwZiuhkzq8sZlJPcYZP2oQmIhtmtn69b3Oz1BzCfSqWAFsZ6_wW_uuhMwiLPk2Z2bXdVXqUid86cQ8x9fxAUNSdSz",
        "Adidas Ultraboost 22",
        0
      ),
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    category: "men",
    subCategory: "sneakers",
    description:
      "The Ultraboost 22 delivers incredible energy return and a pillow-soft feel. Engineered Primeknit upper adapts to your foot for a sock-like fit.",
    stock: 11,
    status: "active",
    colors: ["#1A1A1A", "#FFFFFF"],
    rating: 4.7,
    reviewCount: 34,
  },
  {
    id: "5",
    slug: "vans-classic-slip-on",
    name: "Classic Slip-On",
    brand: "Vans",
    price: 45000,
    originalPrice: 65000,
    images: [
      img(
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB1EWirK9JGXOH7M8vri5mMu7Dn5JwUGTwP2ydPcmbUO9-qNiE1GYjeV-spYJ4GGf_nctepFW8jmEENcTEDmksMtwIVpT_i_-FOKVpw0DqfPF9qkk3hUf2UdtKyj8u4_0xldtVOKt9GIrpamkvOAU203sDxOKtJgeFvn9G3lzlfpZ17LMjiYFpefMkxFWz_QmFgpypB96f2GXmpDWd3yfld-6k5RKX507agi2p7Q5AombF4VFXlsMubLROQaDLESY3Fq4K94WErZ4Jl",
        "Vans Classic Slip-On",
        0
      ),
    ],
    sizes: ["35", "36", "37", "38", "39", "40", "41", "42"],
    category: "women",
    subCategory: "slides",
    description:
      "The Vans Classic Slip-On features the iconic waffle outsole and elastic side accents. Effortless style for every occasion.",
    stock: 22,
    status: "active",
    colors: ["#808080"],
    rating: 4.3,
    reviewCount: 61,
  },
  {
    id: "6",
    slug: "timberland-6-inch-premium-boot",
    name: "6-Inch Premium Boot",
    brand: "Timberland",
    price: 210000,
    images: [
      img(
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC6ShLZuwEYZg9ruDM-VMgcj8fpMlHzzeeWL3CJk3wxiDFcKSD4l_GEdufKLgL0c6-tI9suWm8weGpNvEAlWG1APqgvM6xjtnB8maqc1v229Nw0OYAD0LbBI_usfyBIWbbOneW62_VDA0G24IEZHncc3tGI7MhWPbEZ77PYo-UdmG0g7lwhfDuW3bpEIX0MxNQlNPK8aL9x-59ZKkhz_VJhaPdiaXbXZ1R-7ne3iks08PdPx91G1IhOCPwRZoH-Ui9R1ScpUPPPcElE",
        "Timberland 6-Inch Premium Boot",
        0
      ),
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    category: "men",
    subCategory: "boots",
    description:
      "The original Timberland boot. Waterproof full-grain leather upper, seam-sealed waterproof construction, and the iconic lug outsole.",
    stock: 6,
    status: "active",
    colors: ["#8B5E3C"],
    rating: 4.9,
    reviewCount: 47,
  },
  {
    id: "7",
    slug: "asics-gel-kayano-29",
    name: "Gel-Kayano 29",
    brand: "Asics",
    price: 155000,
    images: [
      img(
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBj6EaagvFt5O4ukUigi7UMtfiZU2_Xr0Fj2cuFxiudvu8qlFU0i3PEYxLc8dXF03UZ-kY-TI5d_P0zXCOg7oivqkk9PRcKbA-5vTutRYSZqr1SiDG1lTnqMHuN7pEaiVgqb6fPzV7CAsFNqbIUfG3wlkl9E8cFvsvHwz-aI_itWDu83HyAeCuM73oqrHwtnN6P5_QqRV0qVpDv6l0K5SMXDMX8pClBRUt_h-Bb_13lLB_oKXCExaIy5E44bG-fSb5nUnjvoknnD6tY",
        "Asics Gel-Kayano 29",
        0
      ),
    ],
    sizes: ["37", "38", "39", "40", "41", "42", "43"],
    category: "women",
    subCategory: "sneakers",
    description:
      "Built for serious runners, the Gel-Kayano 29 delivers maximum support and stability. FF BLAST PLUS ECO cushioning for a smooth, responsive ride.",
    stock: 13,
    status: "active",
    colors: ["#FFFFFF", "#C0C0C0"],
    rating: 4.6,
    reviewCount: 23,
  },
  {
    id: "8",
    slug: "converse-chuck-taylor-all-star-hi",
    name: "Chuck Taylor All Star Hi",
    brand: "Converse",
    price: 70000,
    images: [
      img(
        "https://lh3.googleusercontent.com/aida-public/AB6AXuClm3b46SrTklFmVswT2HLQ68LH_xc1QRLqPrMGJLK2MgabpR2m169htgTZC5506Utk8hjMfxa_Vysfm7gAJeSObR4xInUERerpPT7JHMwGBXoHE6SR_TUnWvc6D-CW2sJVD_oUmJLJC2rECjoCCB9tEDMKNtC1k55oDh1EHjiV02afiJ1H3hxKKgVRfcccraXi-s5JNTE-NxQD076RR1ySigtRGe4ahaR3T2Kt-hNiKQkWRcgijilW4oqRdLBjv_hyd8D5rt19Ybnf",
        "Converse Chuck Taylor All Star Hi",
        0
      ),
    ],
    sizes: ["35", "36", "37", "38", "39", "40", "41"],
    category: "kids",
    subCategory: "sneakers",
    description:
      "The Chuck Taylor All Star is the world's most iconic sneaker. Canvas upper, vulcanised rubber sole, and the iconic ankle patch.",
    stock: 18,
    status: "active",
    isNew: true,
    colors: ["#1A1A1A", "#FFFFFF", "#C41E3A"],
    rating: 4.4,
    reviewCount: 89,
  },
  {
    id: "9",
    slug: "air-jordan-4-bred-reimagined",
    name: "Air Jordan 4 'Bred Reimagined'",
    brand: "Jordan Brand",
    price: 280000,
    images: [
      img(
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA0mVP7RD-YsI21NJw6zAfUi6bMt6ackfTuqKXAo2L9xMC-qbaV-DLKY272dCl4mSWOVVjZY5aN0ehO_dlqfD6QFfzZ5Q9m2k831dI1QOAWvRX8kuWvwauY1CtsM0rZwA79tss3cJMx3vpY1QUcKvKY-ionqncseFdPEMBZaUxnDRWzhuyJcVH8_2qsuL4WsKbNrLtvIIUogx3fLMAqskETduej55QuHxKCXSd3GtkK-VAlxVPeBhkQUtRyRkqxihmfV2OJr-wQb2qK",
        "Air Jordan 4 Bred Reimagined",
        0
      ),
    ],
    sizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11"],
    category: "men",
    subCategory: "sneakers",
    description:
      "The Air Jordan 4 'Bred Reimagined' is a modern reinterpretation of the iconic Black/Red colourway. Tumbled leather upper with visible Air unit.",
    stock: 3,
    status: "active",
    colors: ["#1A1A1A", "#C41E3A"],
    rating: 4.9,
    reviewCount: 7,
  },
  {
    id: "10",
    slug: "nike-dunk-low-panda",
    name: "Dunk Low 'Panda'",
    brand: "Nike",
    price: 136000,
    originalPrice: 160000,
    images: [
      img(
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCx7ucuszjPpLLtDj0gnbyzJPML32ZTmVEgPgKI1i2SkWgoYg_m8ANa8vrlJ4MGnCVpOPVIvX3ltj73LUwiTlxZT-xzGwbTqtKuj1q_S5ytna9LX-1cT1DjFEhfEf_G5Z7vKldx1gotY41w7zdvASt8mgVagimbYnOmg3jmuSlE6jsQR5qmk6zBJdULk7PghQDFrjxaSnL437bwRyM_8nbL9XTO_SWS74Bkg8QwgBaI61ikW0PJYU5YUhxtcs4zsBmqHU7GpkrBzTSp",
        "Nike Dunk Low Panda",
        0
      ),
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    category: "men",
    subCategory: "sneakers",
    description:
      "Clean. Classic. The Dunk Low 'Panda' keeps it simple with a black and white leather upper that goes with everything.",
    stock: 20,
    status: "active",
    colors: ["#FFFFFF", "#1A1A1A"],
    rating: 4.7,
    reviewCount: 52,
  },
  {
    id: "11",
    slug: "new-balance-550-white-grey",
    name: "550 White/Grey",
    brand: "New Balance",
    price: 112000,
    originalPrice: 140000,
    images: [
      img(
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDNfd0y-Fv8ZVO63ZeLfq0eSznpoxLQKCeRxQzcjDMTnuqAofek1V5KHeFK0JnOxVs1WKGKbsscJEueuf3ztb2AgFWTz0AGoKFWQYx7lCai7LVmDAWpy8bmva94o23WOn30XrHSWYYQMzrbFPHZBjqO7S3Ytu5JcDytq71ID3e37Etb2MxaIej8myhW5Arm9KKOqIP-ndM6tm5YaoZSDLiRPZ_XsP_qGEiH8s0zJHISI-9XJf93-BGe-WVoeZUnVf9kLSTeOac8f8Wq",
        "New Balance 550 White Grey",
        0
      ),
    ],
    sizes: ["37", "38", "39", "40", "41", "42"],
    category: "women",
    subCategory: "sneakers",
    description:
      "The NB 550 in a clean white/grey colourway. Leather and mesh upper with classic court silhouette.",
    stock: 16,
    status: "active",
    colors: ["#FFFFFF", "#A0A0A0"],
    rating: 4.5,
    reviewCount: 31,
  },
  {
    id: "12",
    slug: "asics-gel-kayano-14",
    name: "Gel-Kayano 14",
    brand: "Asics",
    price: 133000,
    originalPrice: 190000,
    images: [
      img(
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAP5wI1X039PQx3BQJSiRoLIPBO7EoLu7nbSwAVa_n7psBeQ_xe4draq-5qmTx6ofk-E5q7TLzo2ihdjBAJ18DuGwLjYzr03d99jvwgvW7HrhZg3OR8idOMkz0nDBTJ4avb2i5W6lWOosJQRLRxfuFTmf9WWi_htnoZyadI4UCkL2CF0nC76DZ6-2WJP6MCmWtiS62iLmZV_xDgyL9lpkavB6r5UQA2Q1JkbC7-595iEh_WQXTFTZTCLE3P3zRoa5cUQhd19055ISMQ",
        "Asics Gel-Kayano 14",
        0
      ),
    ],
    sizes: ["37", "38", "39", "40", "41", "42", "43"],
    category: "women",
    subCategory: "sneakers",
    description:
      "The retro Gel-Kayano 14 is back in a bold, chunky silhouette. GEL technology cushioning in the rearfoot for shock absorption.",
    stock: 9,
    status: "active",
    colors: ["#E8E0D0", "#C0A080"],
    rating: 4.8,
    reviewCount: 15,
  },
  {
    id: "13",
    slug: "converse-chuck-70-high",
    name: "Chuck 70 High",
    brand: "Converse",
    price: 71250,
    originalPrice: 95000,
    images: [
      img(
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAcX_fu0yy4B_AC_78MZk_c9kBfz_rGhOo2Lo0Rti1fsO_9gnZuL9DDxWCcYQMM7Pc2vpPHcCyJTkOEjqY24xwEHaFZ5FZEI3aWHQzKoQI5iEXIq_-qMfV3HRFp172IuIiJaxl1JxDyN9ad84meOJIz5shP8lDElZxZtVqDBIHTMETFrgcuD2pjjBq0_Qk7Ugq4W6nyfYJwTsS-Hp34fONzoMjoYit2AEbGqYcVTAk0hXfZLsyMTpSlFHoEWFRP-gEFB5EkWhbjZMK4",
        "Converse Chuck 70 High",
        0
      ),
    ],
    sizes: ["36", "37", "38", "39", "40", "41"],
    category: "kids",
    subCategory: "sneakers",
    description:
      "The Chuck 70 is the premium version of the classic. Higher rubber foxing, more cupsole support, and vintage-inspired details.",
    stock: 24,
    status: "active",
    colors: ["#1A1A1A"],
    rating: 4.3,
    reviewCount: 42,
  },
  {
    id: "14",
    slug: "puma-suede-classic-loafer",
    name: "Suede Classic XXI",
    brand: "Puma",
    price: 85000,
    images: [
      img(
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCh-0bePnIQFYl6JmSIAaJxwTjExIEI3t7PsPzOTtOvtIV6CPqe0F7Lm7W-WKH_jJF7vCNIuZLy9mwcMqPPwIgSDpwC2GarW-wR2AALBPi7uNyUEgH4KqsmTIsw4_meASfa0nGQm9WIx7uVxj5P2qUqD9zV8LztVeStXLXbsAELuHwYHWj0XqGJP2ODZ6T4Fx0md0HqjQKy_1MkB3CYVA4OsaCKu-2s-KIt-vPU6X5vksAF3zM1we_a1lHPm861rJKD7pwX8TlWyzAX",
        "Puma Suede Classic XXI",
        0
      ),
    ],
    sizes: ["38", "39", "40", "41", "42", "43"],
    category: "women",
    subCategory: "loafers",
    description:
      "The PUMA Suede Classic is a pure street icon. Soft suede upper with the iconic T-toe and formstrip branding.",
    stock: 19,
    status: "active",
    colors: ["#1A1A1A", "#C41E3A", "#FFFFFF"],
    rating: 4.4,
    reviewCount: 38,
  },
];

// TODO: replace with real API call
export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<Product>> {
  await delay(600);

  let results = [...MOCK_PRODUCTS];

  if (filters.category) {
    results = results.filter((p) => p.category === filters.category);
  }

  if (filters.subCategory) {
    results = results.filter((p) => p.subCategory === filters.subCategory);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  if (filters.minPrice !== undefined) {
    results = results.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.size) {
    results = results.filter((p) => p.sizes.includes(filters.size!));
  }

  if (filters.sort === "price-asc") {
    results.sort((a, b) => a.price - b.price);
  } else if (filters.sort === "price-desc") {
    results.sort((a, b) => b.price - a.price);
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const start = (page - 1) * limit;

  return {
    data: results.slice(start, start + limit),
    total: results.length,
    page,
    limit,
  };
}

// TODO: replace with real API call
export async function getProductBySlug(slug: string): Promise<Product> {
  await delay(400);
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    throw { message: "Product not found", statusCode: 404 };
  }
  return product;
}

// TODO: replace with real API call
export async function getFeaturedProducts(): Promise<Product[]> {
  await delay(500);
  return MOCK_PRODUCTS.slice(0, 6);
}

// TODO: replace with real API call
export async function getSimilarProducts(
  productId: string,
  subCategory: string
): Promise<Product[]> {
  await delay(400);
  return MOCK_PRODUCTS.filter(
    (p) => p.id !== productId && p.subCategory === subCategory
  ).slice(0, 4);
}

// TODO: replace with real API call
export async function getSaleProducts(): Promise<Product[]> {
  await delay(500);
  return MOCK_PRODUCTS.filter((p) => p.originalPrice !== undefined);
}
