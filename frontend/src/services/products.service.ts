import type {
  Product,
  ProductFilters,
} from "@/types/api/products";
import type { PaginatedResponse } from "@/types/api/common";

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "nike-air-force-1-07-white",
    name: "Air Force 1 '07",
    brand: "Nike",
    price: 120000,
    images: [],
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
    category: "men",
    description:
      "The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin on what you know best.",
    stock: 12,
    status: "active",
  },
  {
    id: "2",
    slug: "jordan-1-retro-high-chicago",
    name: "Jordan 1 Retro High",
    brand: "Jordan",
    price: 185000,
    images: [],
    sizes: ["39", "40", "41", "42", "43", "44"],
    category: "men",
    description:
      "The Air Jordan 1 Retro High OG brings heritage hoops style to a new generation.",
    stock: 5,
    status: "active",
  },
  {
    id: "3",
    slug: "adidas-forum-84-hi",
    name: "Forum 84 Hi",
    brand: "Adidas",
    price: 95000,
    images: [],
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    category: "men",
    description:
      "Street style icon. The Forum 84 Hi features a bold ankle strap and tooled leather upper.",
    stock: 8,
    status: "active",
  },
  {
    id: "4",
    slug: "new-balance-550-white-green",
    name: "550",
    brand: "New Balance",
    price: 110000,
    images: [],
    sizes: ["37", "38", "39", "40", "41", "42"],
    category: "women",
    description:
      "Originally designed for on-court performance in 1989, the 550 is back and better than ever.",
    stock: 15,
    status: "active",
  },
  {
    id: "5",
    slug: "puma-suede-classic-black",
    name: "Suede Classic",
    brand: "Puma",
    price: 75000,
    images: [],
    sizes: ["38", "39", "40", "41", "42", "43"],
    category: "men",
    description:
      "The PUMA Suede Classic is an icon that never quits. Pure street.",
    stock: 20,
    status: "active",
  },
  {
    id: "6",
    slug: "vans-old-skool-black-white",
    name: "Old Skool",
    brand: "Vans",
    price: 65000,
    images: [],
    sizes: ["35", "36", "37", "38", "39", "40", "41", "42"],
    category: "women",
    description: "The Vans Old Skool is the original skate shoe — built for the streets.",
    stock: 25,
    status: "active",
  },
  {
    id: "7",
    slug: "converse-chuck-taylor-all-star-hi",
    name: "Chuck Taylor All Star Hi",
    brand: "Converse",
    price: 70000,
    images: [],
    sizes: ["35", "36", "37", "38", "39", "40", "41"],
    category: "kids",
    description:
      "The Chuck Taylor All Star is the world's most iconic sneaker, worn by everyone everywhere.",
    stock: 18,
    status: "active",
  },
  {
    id: "8",
    slug: "nike-dunk-low-retro-white-black",
    name: "Dunk Low Retro",
    brand: "Nike",
    price: 140000,
    images: [],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    category: "men",
    description:
      "Created for the hardwood but taken to the streets, the Nike Dunk Low Retro returns.",
    stock: 7,
    status: "active",
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
