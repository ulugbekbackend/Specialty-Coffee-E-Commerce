import { PRODUCTS, type Product } from '../data/products';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const CATALOG_URL = `${API_BASE_URL}/api/products/`;
const ORDERS_URL = `${API_BASE_URL}/api/orders/`;

function normalize(raw: Record<string, unknown>): Product | null {
  if (!raw || typeof raw.id !== 'string' || typeof raw.name !== 'string') return null;
  const p = raw as unknown as Product;
  return { ...p, badge: p.badge ?? undefined };
}

/**
 * Fetch the catalog from the Django 5.2 API (GET /api/products/).
 * Falls back to the bundled seed catalog so the static build works
 * standalone — e.g. when served without the backend.
 */
export async function fetchCatalog(): Promise<Product[] | null> {
  try {
    const res = await fetch(CATALOG_URL, {
      signal: AbortSignal.timeout(1500),
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return null;
    const list = data
      .map((item) => normalize(item as Record<string, unknown>))
      .filter((p): p is Product => p !== null);
    return list.length > 0 ? list : null;
  } catch {
    /* backend unreachable (static demo) — keep bundled catalog */
    return null;
  }
}

export const FALLBACK_CATALOG = PRODUCTS;

export interface OrderItemInput {
  sku: string;
  grind: string;
  quantity: number;
}

export interface OrderPayload {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  items: OrderItemInput[];
}

export interface OrderResponse {
  order_no: string;
  name: string;
  email: string;
  address: string;
  city: string;
  zip_code: string;
  country: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: {
    name: string;
    weight: string;
    grind: string;
    quantity: number;
    unit_price: number;
    lineTotal: number;
  }[];
  created_at: string;
}

export class OrderError extends Error {}

/**
 * POST /api/orders/ — turns the cart into a persisted order.
 * Throws OrderError with a message the checkout form can show.
 */
export async function createOrder(payload: OrderPayload): Promise<OrderResponse> {
  let res: Response;
  try {
    res = await fetch(ORDERS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new OrderError('Could not reach the server. Check your connection and try again.');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new OrderError(body?.detail ?? 'Order could not be placed. Please try again.');
  }
  return res.json();
}
