import type { ProductDetail } from "@/services/productApi";

export interface ComparisonResponse {
  products: ProductDetail[];
}

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function compareProducts(
  slugs: string[],
): Promise<ComparisonResponse> {
  const params = new URLSearchParams({
    slugs: slugs.join(","),
  });

  const response = await fetch(
    `${API_URL}/api/compare?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(
      `Unable to compare products: ${response.status}`,
    );
  }

  return response.json() as Promise<ComparisonResponse>;
}
