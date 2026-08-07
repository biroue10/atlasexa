export interface HomeHighlightProduct {
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

interface HomeHighlightsResponse {
  items: HomeHighlightProduct[];
}

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function getHomeHighlights(
  signal?: AbortSignal,
): Promise<HomeHighlightProduct[]> {
  const response = await fetch(
    `${API_URL}/api/home/highlights`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load homepage highlights: ${response.status}`,
    );
  }

  const data =
    (await response.json()) as HomeHighlightsResponse;

  return data.items;
}
