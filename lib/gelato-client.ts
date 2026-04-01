// =====================================================
// GELATO API CLIENT — Print-on-Demand Fulfillment
// =====================================================
// Docs: https://dashboard.gelato.com/docs/
// Order API Base: https://order.gelatoapis.com
// Product API Base: https://product.gelatoapis.com/v3

// TYPES
export interface GelatoShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postCode: string;
  state?: string;
  country: string; // ISO 3166-1 alpha-2 (z.B. "DE")
  email: string;
  phone?: string;
}

export interface GelatoOrderItem {
  itemReferenceId: string;
  productUid: string;
  quantity: number;
  files: {
    type: "default" | "back" | "neck_inner" | "neck_outer";
    url: string;
  }[];
}

export interface GelatoOrderRequest {
  orderType: "order" | "draft";
  orderReferenceId: string;
  customerReferenceId: string;
  currency: string;
  items: GelatoOrderItem[];
  shippingAddress: GelatoShippingAddress;
}

export interface GelatoOrderResponse {
  id: string;
  orderReferenceId: string;
  fulfillmentStatus: string;
  financialStatus: string;
  items: {
    id: string;
    itemReferenceId: string;
    fulfillmentStatus: string;
  }[];
  createdAt: string;
}

export interface GelatoWebhookEvent {
  id: string;
  event:
    | "order:status:created"
    | "order:status:passed"
    | "order:status:in_production"
    | "order:status:shipped"
    | "order:status:delivered"
    | "order:status:cancelled"
    | "order:status:not_accepted";
  orderId: string;
  orderReferenceId: string;
  fulfillmentStatus: string;
  shipments?: {
    trackingCode: string;
    trackingUrl: string;
    carrier: string;
  }[];
  createdAt: string;
}

// CONSTANTS
const ORDER_API_BASE = "https://order.gelatoapis.com/v4";
const PRODUCT_API_BASE = "https://product.gelatoapis.com/v3";

function getApiKey(): string {
  const key = process.env.GELATO_API_KEY;
  if (!key) {
    throw new Error(
      "GELATO_API_KEY is not set. Add it to .env.local",
    );
  }
  return key;
}

// HELPER
async function gelatoFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const apiKey = getApiKey();
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "No body");
    throw new Error(
      `Gelato API error ${response.status}: ${response.statusText} — ${errorBody}`,
    );
  }

  return response.json() as Promise<T>;
}

// =====================================================
// ORDER API
// =====================================================

/** Bestellung bei Gelato erstellen */
export async function createGelatoOrder(
  order: GelatoOrderRequest,
): Promise<GelatoOrderResponse> {
  return gelatoFetch<GelatoOrderResponse>(`${ORDER_API_BASE}/orders`, {
    method: "POST",
    body: JSON.stringify(order),
  });
}

/** Bestellstatus abfragen */
export async function getGelatoOrder(
  orderId: string,
): Promise<GelatoOrderResponse> {
  return gelatoFetch<GelatoOrderResponse>(
    `${ORDER_API_BASE}/orders/${orderId}`,
  );
}

/** Bestellung stornieren */
export async function cancelGelatoOrder(
  orderId: string,
): Promise<{ id: string; fulfillmentStatus: string }> {
  return gelatoFetch(`${ORDER_API_BASE}/orders/${orderId}:cancel`, {
    method: "POST",
  });
}

// =====================================================
// PRODUCT CATALOG API
// =====================================================

/** Alle Kataloge auflisten */
export async function listCatalogs(): Promise<{
  catalogs: { catalogUid: string; title: string }[];
}> {
  return gelatoFetch(`${PRODUCT_API_BASE}/catalogs`);
}

/** Produkte in einem Katalog suchen */
export async function searchCatalogProducts(
  catalogUid: string,
  filters?: Record<string, string[]>,
): Promise<{
  products: { productUid: string; title: string; variants: unknown[] }[];
}> {
  return gelatoFetch(
    `${PRODUCT_API_BASE}/catalogs/${catalogUid}/products:search`,
    {
      method: "POST",
      body: JSON.stringify({ filters: filters || {} }),
    },
  );
}

/** Einzelnes Produkt abfragen */
export async function getProduct(
  productUid: string,
): Promise<{ productUid: string; title: string; variants: unknown[] }> {
  return gelatoFetch(`${PRODUCT_API_BASE}/products/${productUid}`);
}
