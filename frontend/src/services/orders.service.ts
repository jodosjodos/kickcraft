import type { Order } from "@/types/api/orders";

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

const MOCK_ORDERS: Order[] = [
  {
    id: "ord_001",
    orderToken: "KC-10042",
    status: "delivered",
    paymentPhase: "fully_paid",
    items: [
      {
        id: "oi_001",
        product: {
          id: "1",
          slug: "nike-air-force-1-07-white",
          name: "Air Force 1 '07",
          brand: "Nike",
          price: 120000,
          images: [],
          sizes: ["40", "41", "42"],
          category: "men",
          subCategory: "sneakers",
          description: "Nike Air Force 1",
          stock: 12,
          status: "active",
        },
        size: "42",
        quantity: 1,
        price: 120000,
      },
    ],
    total: 120000,
    deliveryMethod: "delivery",
    deliveryAddress: "Kimironko, Gasabo",
    phone: "250794050537",
    email: "user@example.com",
    createdAt: "2025-04-10T10:30:00Z",
  },
  {
    id: "ord_002",
    orderToken: "KC-10058",
    status: "out_for_delivery",
    paymentPhase: "upfront_paid",
    items: [
      {
        id: "oi_002",
        product: {
          id: "2",
          slug: "jordan-1-retro-high-chicago",
          name: "Jordan 1 Retro High",
          brand: "Jordan",
          price: 185000,
          images: [],
          sizes: ["41", "42", "43"],
          category: "men",
          subCategory: "sneakers",
          description: "Air Jordan 1",
          stock: 5,
          status: "active",
        },
        size: "43",
        quantity: 1,
        price: 185000,
      },
    ],
    total: 185000,
    deliveryMethod: "delivery",
    deliveryAddress: "Nyamirambo, Nyarugenge",
    phone: "250794050537",
    createdAt: "2025-04-28T14:15:00Z",
  },
  {
    id: "ord_003",
    orderToken: "KC-10071",
    status: "pending",
    paymentPhase: "upfront_paid",
    items: [
      {
        id: "oi_003",
        product: {
          id: "8",
          slug: "nike-dunk-low-retro-white-black",
          name: "Dunk Low Retro",
          brand: "Nike",
          price: 140000,
          images: [],
          sizes: ["40", "41", "42"],
          category: "men",
          subCategory: "sneakers",
          description: "Nike Dunk Low",
          stock: 7,
          status: "active",
        },
        size: "41",
        quantity: 1,
        price: 140000,
      },
    ],
    total: 140000,
    deliveryMethod: "pickup",
    phone: "250794050537",
    createdAt: "2025-05-03T09:00:00Z",
  },
];

// TODO: replace with real API call
export async function getMyOrders(): Promise<Order[]> {
  await delay(500);
  return [...MOCK_ORDERS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// TODO: replace with real API call
export async function getOrderById(id: string): Promise<Order> {
  await delay(300);
  const order = MOCK_ORDERS.find((o) => o.id === id);
  if (!order) throw { message: "Order not found", statusCode: 404 };
  return order;
}
