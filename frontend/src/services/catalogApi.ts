export interface CatalogProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  brand: string;
  category: string;
  score: number;
  minimum_price: number | null;
  currency: string | null;
  best_for: string | null;
}

export interface ProductListResponse {
  items: CatalogProduct[];
  total: number;
  page: number;
  page_size: number;
}

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface CatalogFilters {
  query?: string;
  brand?: string;
  category?: string;
  maxPrice?: string;
  sortBy?: string;
}

export async function getProducts(
  page: number,
  pageSize = 12,
  filters: CatalogFilters = {},
  signal?: AbortSignal,
): Promise<ProductListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  if (filters.query) {
    params.set("q", filters.query);
  }

  if (filters.brand) {
    params.set("brand", filters.brand);
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.maxPrice) {
    params.set("max_price", filters.maxPrice);
  }

  if (filters.sortBy) {
    params.set("sort_by", filters.sortBy);
  }

  const response = await fetch(
    `${API_URL}/api/products?${params.toString()}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Unable to load products: ${response.status}`);
  }

  return response.json() as Promise<ProductListResponse>;
}
