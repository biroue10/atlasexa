export interface ProductResult {
  name: string;
  price: number;
  currency: string;
  score: number;
  reason: string;
  slug: string;
}

export interface SearchResponse {
  query: string;
  summary: string;
  products: ProductResult[];
}

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function searchProducts(
  query: string,
): Promise<SearchResponse> {
  const response = await fetch(`${API_URL}/api/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Search failed with status ${response.status}`);
  }

  return response.json() as Promise<SearchResponse>;
}
