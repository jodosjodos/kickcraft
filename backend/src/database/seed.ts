import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import {
  Product,
  ProductCategory,
  ProductSubCategory,
  ProductStatus,
} from '../modules/products/product.entity';
import { User, UserRole } from '../modules/users/user.entity';

const ds = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Product, User],
  synchronize: false,
});

function getRequiredEnv(name: 'ADMIN_EMAIL' | 'ADMIN_PASSWORD'): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

interface SeedProduct {
  slug: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice: number | null;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  stock: number;
  status: ProductStatus;
  isNew: boolean;
  images: { url: string; alt: string; order: number }[];
  sizes: string[];
  rating: number | null;
  reviewCount: number;
}

const products: SeedProduct[] = [
  // ── MEN · SNEAKERS ──────────────────────────────────────────────────────────
  {
    slug: 'nike-air-force-1-07',
    name: "Air Force 1 '07",
    brand: 'Nike',
    description:
      "The radiance lives on in the Nike Air Force 1 '07. The b-ball icon that put air in sneaker culture keeps its legendary shape while the classic colorway stays fresh for any outfit, any day.",
    price: 85000,
    originalPrice: null,
    category: ProductCategory.Men,
    subCategory: ProductSubCategory.Sneakers,
    stock: 24,
    status: ProductStatus.Active,
    isNew: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542291026-5ef1e8cb3ca8?w=800&q=80',
        alt: 'Nike Air Force 1 white side view',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1600185365483-26d0a9fac6d3?w=800&q=80',
        alt: 'Nike Air Force 1 studio shot',
        order: 1,
      },
    ],
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
    rating: 4.8,
    reviewCount: 124,
  },
  {
    slug: 'adidas-ultraboost-23',
    name: 'Ultraboost 23',
    brand: 'Adidas',
    description:
      "Energy returns with every step. The Ultraboost 23 delivers a responsive BOOST midsole and a snug Primeknit upper that adapts to your foot — built for runners who don't stop.",
    price: 120000,
    originalPrice: 148000,
    category: ProductCategory.Men,
    subCategory: ProductSubCategory.Sneakers,
    stock: 15,
    status: ProductStatus.Active,
    isNew: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1494409880771-dd3d925d7e44?w=800&q=80',
        alt: 'Adidas Ultraboost side view',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1539185141122-fe20b3f72e33?w=800&q=80',
        alt: 'Adidas Ultraboost back view',
        order: 1,
      },
    ],
    sizes: ['40', '41', '42', '43', '44', '45', '46'],
    rating: 4.7,
    reviewCount: 89,
  },
  {
    slug: 'jordan-1-retro-high-og-chicago',
    name: '1 Retro High OG Chicago',
    brand: 'Jordan',
    description:
      'The shoe that started it all. The Jordan 1 Retro High OG Chicago brings back the iconic red, white, and black colorway that launched a cultural revolution. Every pair is a piece of history.',
    price: 175000,
    originalPrice: null,
    category: ProductCategory.Men,
    subCategory: ProductSubCategory.Sneakers,
    stock: 8,
    status: ProductStatus.Active,
    isNew: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
        alt: 'Jordan 1 Retro High side view',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1562183241-840b8af0721e?w=800&q=80',
        alt: 'Jordan 1 Retro High detail',
        order: 1,
      },
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    rating: 4.9,
    reviewCount: 203,
  },
  {
    slug: 'new-balance-574-core',
    name: '574 Core',
    brand: 'New Balance',
    description:
      'A street-style icon with decades of heritage. The New Balance 574 combines an ENCAP midsole for all-day support with a versatile silhouette that works from campus to weekend hangs.',
    price: 72000,
    originalPrice: 88000,
    category: ProductCategory.Men,
    subCategory: ProductSubCategory.Sneakers,
    stock: 32,
    status: ProductStatus.Active,
    isNew: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1552346154-21969185db18?w=800&q=80',
        alt: 'New Balance 574 side view',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1511556532299-2f4de0b3e1e8?w=800&q=80',
        alt: 'New Balance 574 top view',
        order: 1,
      },
    ],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    rating: 4.5,
    reviewCount: 67,
  },
  {
    slug: 'puma-rs-x3-cube',
    name: 'RS-X3 Cube',
    brand: 'Puma',
    description:
      "Inspired by late '80s running shoes, the RS-X3 Cube takes the chunky-sole trend to the next level. Bold colour-blocking and the RS cushioning system make it the statement piece your rotation needs.",
    price: 65000,
    originalPrice: null,
    category: ProductCategory.Men,
    subCategory: ProductSubCategory.Sneakers,
    stock: 19,
    status: ProductStatus.Active,
    isNew: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&q=80',
        alt: 'Puma RS-X3 side view',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
        alt: 'Puma RS-X3 angle view',
        order: 1,
      },
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    rating: 4.3,
    reviewCount: 41,
  },
  {
    slug: 'yeezy-boost-350-v2-zebra',
    name: 'Boost 350 V2 Zebra',
    brand: 'Yeezy',
    description:
      'The Yeezy 350 V2 Zebra is one of the most sought-after sneakers ever made. Its full-length BOOST midsole, Primeknit upper, and distinctive stripe design have made it a grail for collectors worldwide.',
    price: 220000,
    originalPrice: 260000,
    category: ProductCategory.Men,
    subCategory: ProductSubCategory.Sneakers,
    stock: 5,
    status: ProductStatus.Active,
    isNew: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1520316587275-6dc81a9f1c74?w=800&q=80',
        alt: 'Yeezy 350 V2 side view',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
        alt: 'Yeezy 350 V2 sole detail',
        order: 1,
      },
    ],
    sizes: ['40', '41', '42', '43', '44'],
    rating: 4.9,
    reviewCount: 318,
  },

  // ── MEN · BOOTS ─────────────────────────────────────────────────────────────
  {
    slug: 'nike-manoa-leather-boot',
    name: 'Manoa Leather Boot',
    brand: 'Nike',
    description:
      'Built for cool-weather traction and all-day wear. The Nike Manoa Leather Boot pairs a durable leather upper with a padded collar and a grippy rubber outsole — ready for whatever the city throws at you.',
    price: 95000,
    originalPrice: null,
    category: ProductCategory.Men,
    subCategory: ProductSubCategory.Boots,
    stock: 14,
    status: ProductStatus.Active,
    isNew: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
        alt: 'Nike Manoa Leather Boot side',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1553545204-4f7d339aa06a?w=800&q=80',
        alt: 'Nike Manoa Leather Boot pair',
        order: 1,
      },
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    rating: 4.4,
    reviewCount: 55,
  },
  {
    slug: 'adidas-terrex-snowpitch-boot',
    name: 'Terrex Snowpitch Boot',
    brand: 'Adidas',
    description:
      'Cold-weather performance in a sleek silhouette. The Terrex Snowpitch Boot features a waterproof upper, CLIMAWARM insulation, and Traxion outsole lugs for grip on slick terrain.',
    price: 115000,
    originalPrice: 135000,
    category: ProductCategory.Men,
    subCategory: ProductSubCategory.Boots,
    stock: 10,
    status: ProductStatus.Active,
    isNew: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1553545204-4f7d339aa06a?w=800&q=80',
        alt: 'Adidas Terrex boot side',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
        alt: 'Adidas Terrex boot sole',
        order: 1,
      },
    ],
    sizes: ['40', '41', '42', '43', '44', '45', '46'],
    rating: 4.6,
    reviewCount: 33,
  },

  // ── MEN · LOAFERS ───────────────────────────────────────────────────────────
  {
    slug: 'adidas-loafer-classic',
    name: 'Loafer Classic',
    brand: 'Adidas',
    description:
      "Where street meets smart. The Adidas Loafer Classic gives you the ease of slip-on comfort with a refined leather upper that's clean enough to dress up and relaxed enough to keep it casual.",
    price: 60000,
    originalPrice: null,
    category: ProductCategory.Men,
    subCategory: ProductSubCategory.Loafers,
    stock: 18,
    status: ProductStatus.Active,
    isNew: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
        alt: 'Adidas Loafer Classic side',
        order: 0,
      },
    ],
    sizes: ['39', '40', '41', '42', '43', '44'],
    rating: 4.2,
    reviewCount: 28,
  },

  // ── MEN · SLIDES ────────────────────────────────────────────────────────────
  {
    slug: 'adidas-adilette-comfort-slides',
    name: 'Adilette Comfort Slides',
    brand: 'Adidas',
    description:
      'Post-game recovery essential. The Adilette Comfort Slides feature a cloudfoam plus footbed and a quick-drying upper so you can kick back in serious style whether at the pool or on the move.',
    price: 28000,
    originalPrice: 35000,
    category: ProductCategory.Men,
    subCategory: ProductSubCategory.Slides,
    stock: 42,
    status: ProductStatus.Active,
    isNew: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600185365483-26d0a9fac6d3?w=800&q=80',
        alt: 'Adidas Adilette slides top view',
        order: 0,
      },
    ],
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
    rating: 4.4,
    reviewCount: 91,
  },

  // ── WOMEN · SNEAKERS ────────────────────────────────────────────────────────
  {
    slug: 'nike-air-max-270-women',
    name: 'Air Max 270',
    brand: 'Nike',
    description:
      "Nike's biggest heel Air unit ever delivers a super-soft ride from heel to toe. The Air Max 270 in a fresh women's colourway keeps your look light, bold, and unmistakably Nike.",
    price: 92000,
    originalPrice: 110000,
    category: ProductCategory.Women,
    subCategory: ProductSubCategory.Sneakers,
    stock: 21,
    status: ProductStatus.Active,
    isNew: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
        alt: 'Nike Air Max 270 women side',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1511556532299-2f4de0b3e1e8?w=800&q=80',
        alt: 'Nike Air Max 270 sole view',
        order: 1,
      },
    ],
    sizes: ['35', '36', '37', '38', '39', '40', '41'],
    rating: 4.6,
    reviewCount: 78,
  },
  {
    slug: 'adidas-gazelle-bold-women',
    name: 'Gazelle Bold',
    brand: 'Adidas',
    description:
      'The Gazelle steps into the platform era. The Gazelle Bold keeps the iconic suede upper and three-stripes branding that defined a generation while adding a raised platform sole for extra presence.',
    price: 78000,
    originalPrice: null,
    category: ProductCategory.Women,
    subCategory: ProductSubCategory.Sneakers,
    stock: 17,
    status: ProductStatus.Active,
    isNew: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&q=80',
        alt: 'Adidas Gazelle Bold side',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1539185141122-fe20b3f72e33?w=800&q=80',
        alt: 'Adidas Gazelle Bold top',
        order: 1,
      },
    ],
    sizes: ['35', '36', '37', '38', '39', '40'],
    rating: 4.5,
    reviewCount: 52,
  },
  {
    slug: 'vans-old-skool-platform-women',
    name: 'Old Skool Platform',
    brand: 'Vans',
    description:
      "The Old Skool gets elevated — literally. The Platform version of Vans' most iconic silhouette adds a 1.5-inch stack without losing any of the canvas-and-suede character that made it famous.",
    price: 55000,
    originalPrice: 65000,
    category: ProductCategory.Women,
    subCategory: ProductSubCategory.Sneakers,
    stock: 28,
    status: ProductStatus.Active,
    isNew: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1562183241-840b8af0721e?w=800&q=80',
        alt: 'Vans Old Skool Platform side',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1600185365483-26d0a9fac6d3?w=800&q=80',
        alt: 'Vans Old Skool Platform top',
        order: 1,
      },
    ],
    sizes: ['35', '36', '37', '38', '39', '40', '41'],
    rating: 4.7,
    reviewCount: 113,
  },
  {
    slug: 'converse-chuck-taylor-all-star-hi-women',
    name: 'Chuck Taylor All Star Hi',
    brand: 'Converse',
    description:
      'More than 100 years and still the most iconic shoe on earth. The Chuck Taylor All Star Hi wraps classic canvas construction around an OrthoLite insole for the most comfortable Chuck yet.',
    price: 45000,
    originalPrice: null,
    category: ProductCategory.Women,
    subCategory: ProductSubCategory.Sneakers,
    stock: 35,
    status: ProductStatus.Active,
    isNew: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542291026-5ef1e8cb3ca8?w=800&q=80',
        alt: 'Converse Chuck Hi side',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
        alt: 'Converse Chuck Hi pair',
        order: 1,
      },
    ],
    sizes: ['35', '36', '37', '38', '39', '40', '41', '42'],
    rating: 4.6,
    reviewCount: 195,
  },

  // ── WOMEN · BOOTS ───────────────────────────────────────────────────────────
  {
    slug: 'converse-chuck-70-hi-boot-women',
    name: 'Chuck 70 Hi Boot',
    brand: 'Converse',
    description:
      'The Chuck 70 heritage meets fall-ready boot silhouette. Higher ankle coverage, a thicker rubber cupsole, and premium canvas construction make this the seasonal Chuck upgrade your wardrobe needs.',
    price: 68000,
    originalPrice: 80000,
    category: ProductCategory.Women,
    subCategory: ProductSubCategory.Boots,
    stock: 12,
    status: ProductStatus.Active,
    isNew: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
        alt: 'Converse Chuck 70 Boot side',
        order: 0,
      },
    ],
    sizes: ['35', '36', '37', '38', '39', '40', '41'],
    rating: 4.4,
    reviewCount: 44,
  },

  // ── WOMEN · SLIDES ──────────────────────────────────────────────────────────
  {
    slug: 'nike-victori-one-slides-women',
    name: 'Victori One Slides',
    brand: 'Nike',
    description:
      'Soft, light, and ready for any day. The Nike Victori One Slides feature a foam sole for lightweight cushioning and a textured strap for a secure fit — perfect from the gym to the street.',
    price: 22000,
    originalPrice: null,
    category: ProductCategory.Women,
    subCategory: ProductSubCategory.Slides,
    stock: 50,
    status: ProductStatus.Active,
    isNew: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
        alt: 'Nike Victori Slides top',
        order: 0,
      },
    ],
    sizes: ['35', '36', '37', '38', '39', '40', '41'],
    rating: 4.3,
    reviewCount: 67,
  },

  // ── KIDS · SNEAKERS ─────────────────────────────────────────────────────────
  {
    slug: 'nike-air-max-270-react-kids',
    name: 'Air Max 270 React Kids',
    brand: 'Nike',
    description:
      "The biggest Air unit meets React foam in a kids' size range. Bold looks, responsive cushioning, and a secure lacing system mean kids can run, jump, and explore all day long.",
    price: 52000,
    originalPrice: 63000,
    category: ProductCategory.Kids,
    subCategory: ProductSubCategory.Sneakers,
    stock: 22,
    status: ProductStatus.Active,
    isNew: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
        alt: 'Nike Air Max Kids side',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1511556532299-2f4de0b3e1e8?w=800&q=80',
        alt: 'Nike Air Max Kids pair',
        order: 1,
      },
    ],
    sizes: ['28', '29', '30', '31', '32', '33', '34', '35'],
    rating: 4.5,
    reviewCount: 39,
  },
  {
    slug: 'adidas-superstar-kids',
    name: 'Superstar Kids',
    brand: 'Adidas',
    description:
      'The shell toe legend, scaled for the next generation. The Adidas Superstar Kids delivers the same iconic look and durable rubber cupsole in sizes built for growing feet.',
    price: 38000,
    originalPrice: null,
    category: ProductCategory.Kids,
    subCategory: ProductSubCategory.Sneakers,
    stock: 30,
    status: ProductStatus.Active,
    isNew: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1520316587275-6dc81a9f1c74?w=800&q=80',
        alt: 'Adidas Superstar Kids side',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1542291026-5ef1e8cb3ca8?w=800&q=80',
        alt: 'Adidas Superstar Kids pair',
        order: 1,
      },
    ],
    sizes: ['28', '29', '30', '31', '32', '33', '34', '35', '36'],
    rating: 4.7,
    reviewCount: 58,
  },
  {
    slug: 'puma-future-rider-kids',
    name: 'Future Rider Kids',
    brand: 'Puma',
    description:
      'Fast looks for fast kids. The Puma Future Rider draws on archival running DNA to deliver a lightweight, colourful sneaker that kids will actually want to wear every single day.',
    price: 32000,
    originalPrice: null,
    category: ProductCategory.Kids,
    subCategory: ProductSubCategory.Sneakers,
    stock: 25,
    status: ProductStatus.Draft,
    isNew: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&q=80',
        alt: 'Puma Future Rider Kids side',
        order: 0,
      },
    ],
    sizes: ['28', '29', '30', '31', '32', '33', '34'],
    rating: 4.2,
    reviewCount: 21,
  },
  {
    slug: 'nike-react-infinity-run-flyknit-3',
    name: 'React Infinity Run Flyknit 3',
    brand: 'Nike',
    description:
      'Designed to help keep you running. The React Infinity Run Flyknit 3 features a wider, rocker-shaped sole and React foam to deliver a smooth, stable ride from your first step to your last.',
    price: 98000,
    originalPrice: 118000,
    category: ProductCategory.Men,
    subCategory: ProductSubCategory.Sneakers,
    stock: 0,
    status: ProductStatus.Archived,
    isNew: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1494409880771-dd3d925d7e44?w=800&q=80',
        alt: 'Nike React Infinity side',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1552346154-21969185db18?w=800&q=80',
        alt: 'Nike React Infinity sole',
        order: 1,
      },
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    rating: 4.7,
    reviewCount: 102,
  },
];

async function seedAdmin() {
  const repo = ds.getRepository(User);

  const ADMIN_EMAIL = getRequiredEnv('ADMIN_EMAIL');
  const ADMIN_PASSWORD = getRequiredEnv('ADMIN_PASSWORD');

  const existing = await repo.findOne({ where: { email: ADMIN_EMAIL } });
  if (existing) {
    console.log(`Admin user already exists (${ADMIN_EMAIL}), skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const admin = repo.create({
    name: 'Kickcraft Admin',
    email: ADMIN_EMAIL,
    phone: '+250700000001',
    passwordHash,
    role: UserRole.Admin,
    isVerified: true,
  });
  await repo.save(admin);
  console.log(
    `Admin seeded — email: ${ADMIN_EMAIL}  password: ${ADMIN_PASSWORD}`,
  );
}

async function seedProducts() {
  const repo = ds.getRepository(Product);

  const existing = await repo.count();
  if (existing > 0) {
    console.log(
      `Skipping products seed — ${existing} products already exist. To re-seed, truncate the products table first.`,
    );
    return;
  }

  const entities = products.map((p) => repo.create(p));
  await repo.save(entities);
  console.log(`Seeded ${entities.length} products`);
}

async function seed() {
  await ds.initialize();
  console.log('Database connected');

  await seedAdmin();
  await seedProducts();

  await ds.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
