export interface CatalogOptions {
  brands: string[];
  categories: string[];
}

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function getCatalogOptions(): Promise<CatalogOptions> {
  const response = await fetch(`${API_URL}/api/catalog/options`);

  if (!response.ok) {
    throw new Error(
      `Unable to load catalog options: ${response.status}`,
    );
  }

  return response.json() as Promise<CatalogOptions>;
}
