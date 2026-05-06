import { apiFetch } from "./api";

export type Part = {
  id: number;
  name: string;
  category: string;
  brand: string;
  price?: number;

  // optional because backend may vary
  compatibility?: string;
  specs?: Record<string, unknown>;
};

export type PartQuery = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStockOnly?: boolean;
  sort?: "price_asc" | "price_desc";
  specKey?: string;
  specValue?: string;
};

function buildQuery(params: PartQuery = {}) {
  const query = new URLSearchParams();

  if (params.category) query.set("category", params.category);
  if (params.minPrice !== undefined) query.set("min_price", String(params.minPrice));
  if (params.maxPrice !== undefined) query.set("max_price", String(params.maxPrice));
  if (params.brand) query.set("brand", params.brand);
  if (params.inStockOnly) query.set("in_stock_only", "true");
  if (params.sort) query.set("sort", params.sort);
  if (params.specKey) query.set("spec_key", params.specKey);
  if (params.specValue) query.set("spec_value", params.specValue);

  return query.toString() ? `?${query.toString()}` : "";
}

/**
 * Get all parts
 */
export async function getParts(params: PartQuery = {}): Promise<Part[]> {
  return apiFetch<Part[]>(`/parts${buildQuery(params)}`);
}

/**
 * Get parts by category (cpu, gpu, etc.)
 */
export async function getPartsByCategory(
  category: string,
  params: Omit<PartQuery, "category"> = {}
): Promise<Part[]> {
  return apiFetch<Part[]>(`/parts/category/${category}${buildQuery(params)}`);
}

/**
 * Get one part by ID
 */
export async function getPartById(id: string): Promise<Part> {
  return apiFetch<Part>(`/parts/${id}`);
}
