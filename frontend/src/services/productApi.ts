export interface ProductPrice {
  merchant: string;
  price: number;
  currency: string;
  market: string;
  country_code: string;
  is_affiliate: boolean;
  product_url: string;
}

export interface ProductImage {
  image_url: string;
  alt_text: string | null;
  position: number;
  is_primary: boolean;
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
  seo_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  is_indexable: boolean;
  prices: ProductPrice[];
  images: ProductImage[];
  specifications: ProductSpecification[];
}

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function getProduct(slug: string): Promise<ProductDetail> {
  const response = await fetch(`${API_URL}/api/products/${slug}`);

  if (!response.ok) {
    throw new Error(`Unable to load product: ${response.status}`);
  }

  return response.json() as Promise<ProductDetail>;
}
