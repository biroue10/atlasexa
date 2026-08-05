export interface ProductPrice {
  merchant: string;
  price: number;
  currency: string;
  product_url: string;
}

export interface ProductSpecification {
  name: string;
  value: string;
  group: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  brand: string;
  category: string;
  score: number;
  score_explanation: string | null;
  prices: ProductPrice[];
  specifications: ProductSpecification[];
}

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://192.168.11.104:8000";

export async function getProduct(slug: string): Promise<ProductDetail> {
  const response = await fetch(`${API_URL}/api/products/${slug}`);

  if (!response.ok) {
    throw new Error(`Unable to load product: ${response.status}`);
  }

  return response.json() as Promise<ProductDetail>;
}
