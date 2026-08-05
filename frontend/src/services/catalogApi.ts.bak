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
}

export interface ProductListResponse {
  items: CatalogProduct[];
  total: number;
  page: number;
  page_size: number;
}

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function getProducts(
  page: number,
  pageSize = 12,
): Promise<ProductListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  const response = await fetch(
    `${API_URL}/api/products?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`Unable to load products: ${response.status}`);
  }

  return response.json() as Promise<ProductListResponse>;
}
