const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const TOKEN_KEY = "atlasexa_admin_token";

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface AdminDashboard {
  total_products: number;
  published_products: number;
  draft_products: number;
  archived_products: number;
  missing_images: number;
  missing_offers: number;
}

export function getAdminToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function adminFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = getAdminToken();

  const headers = new Headers(init.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });
}

export async function loginAdmin(
  email: string,
  password: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/admin/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Invalid email or password.");
  }

  const data = (await response.json()) as {
    access_token: string;
  };

  setAdminToken(data.access_token);
}

export async function getCurrentAdmin(): Promise<AdminUser> {
  const response = await adminFetch(
    "/api/admin/auth/me",
  );

  if (response.status === 401) {
    clearAdminToken();
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error("Unable to load admin account.");
  }

  return response.json() as Promise<AdminUser>;
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const response = await adminFetch(
    "/api/admin/dashboard",
  );

  if (response.status === 401) {
    clearAdminToken();
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error("Unable to load admin dashboard.");
  }

  return response.json() as Promise<AdminDashboard>;
}

export interface AdminProductListItem {
  id: number;
  name: string;
  slug: string;
  brand: string;
  category: string;
  status: string;
  score: number | null;
  image_url: string | null;
  image_count: number;
  offer_count: number;
  minimum_price: number | null;
  currency: string | null;
  model_number: string | null;
  gtin: string | null;
  sku: string | null;
  mpn: string | null;
  release_year: number | null;
  updated_at: string;
}

export interface AdminProductListResponse {
  items: AdminProductListItem[];
  total: number;
}

export async function getAdminProducts(
  query = "",
  status = "",
): Promise<AdminProductListResponse> {
  const params = new URLSearchParams();

  if (query.trim()) {
    params.set("q", query.trim());
  }

  if (status) {
    params.set("status", status);
  }

  const suffix = params.toString()
    ? `?${params.toString()}`
    : "";

  const response = await adminFetch(
    `/api/admin/products${suffix}`,
  );

  if (response.status === 401) {
    clearAdminToken();
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error(
      "Unable to load admin products.",
    );
  }

  return response.json() as Promise<AdminProductListResponse>;
}

export interface AdminProductSpecificationInput {
  id?: number;
  name: string;
  value: string;
  group: string;
}

export interface AdminProductOfferInput {
  id?: number;
  merchant: string;
  price: number;
  currency: string;
  market: string;
  country_code: string;
  is_affiliate: boolean;
  availability: string | null;
  item_condition: string | null;
  price_valid_until: string | null;
  product_url: string;
}

export interface AdminProductCreatePayload {
  name: string;
  brand: string;
  category: string;
  slug: string;
  description?: string | null;
  model_number?: string | null;
  gtin?: string | null;
  sku?: string | null;
  mpn?: string | null;
  release_year?: number | null;
  status: string;
  score?: number | null;
  score_explanation?: string | null;
  seo_title?: string | null;
  meta_description?: string | null;
  canonical_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  is_indexable?: boolean;
  specifications: AdminProductSpecificationInput[];
  offers: AdminProductOfferInput[];
}

export async function createAdminProduct(
  payload: AdminProductCreatePayload,
): Promise<{
  id: number;
  slug: string;
  status: string;
}> {
  const response = await adminFetch(
    "/api/admin/products",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (response.status === 401) {
    clearAdminToken();
    throw new Error("UNAUTHORIZED");
  }

  if (response.status === 409) {
    throw new Error("SLUG_EXISTS");
  }

  if (!response.ok) {
    throw new Error("Unable to create product.");
  }

  return response.json();
}


export interface AdminProductImage {
  id: number;
  image_url: string;
  alt_text: string | null;
  position: number;
  is_primary: boolean;
}

export async function uploadAdminProductImages(
  productId: number,
  files: File[],
  altText = "",
): Promise<AdminProductImage[]> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  formData.append(
    "alt_text",
    altText,
  );

  const response = await adminFetch(
    `/api/admin/products/${productId}/images`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (response.status === 401) {
    clearAdminToken();
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error(
      "Unable to upload images.",
    );
  }

  return response.json();
}


export async function deleteAdminProductImage(
  productId: number,
  imageId: number,
): Promise<void> {
  const response = await adminFetch(
    `/api/admin/products/${productId}/images/${imageId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Unable to delete image.",
    );
  }
}


export async function setAdminProductPrimaryImage(
  productId: number,
  imageId: number,
): Promise<AdminProductImage> {
  const response = await adminFetch(
    `/api/admin/products/${productId}/images/${imageId}/primary`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Unable to set primary image.",
    );
  }

  return response.json();
}


export interface AdminProductSpecification {
  id: number;
  name: string;
  value: string;
  group: string;
}

export interface AdminProductOffer {
  id: number;
  merchant: string;
  price: number;
  currency: string;
  market: string;
  country_code: string;
  is_affiliate: boolean;
  availability: string | null;
  item_condition: string | null;
  price_valid_until: string | null;
  product_url: string;
}

export interface AdminProductDetail {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  brand: string;
  category: string;
  status: string;
  model_number: string | null;
  gtin: string | null;
  sku: string | null;
  mpn: string | null;
  release_year: number | null;
  image_url: string | null;
  score: number | null;
  score_explanation: string | null;
  seo_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  is_indexable: boolean;
  specifications: AdminProductSpecification[];
  images: AdminProductImage[];
  offers: AdminProductOffer[];
  created_at: string;
  updated_at: string;
}

export async function getAdminProduct(
  productId: number,
): Promise<AdminProductDetail> {
  const response = await adminFetch(
    `/api/admin/products/${productId}`,
  );

  if (response.status === 401) {
    clearAdminToken();
    throw new Error("UNAUTHORIZED");
  }

  if (response.status === 404) {
    throw new Error("NOT_FOUND");
  }

  if (!response.ok) {
    throw new Error("Unable to load product.");
  }

  return response.json();
}

export async function updateAdminProduct(
  productId: number,
  payload: AdminProductCreatePayload,
): Promise<AdminProductDetail> {
  const response = await adminFetch(
    `/api/admin/products/${productId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (response.status === 401) {
    clearAdminToken();
    throw new Error("UNAUTHORIZED");
  }

  if (response.status === 409) {
    throw new Error("SLUG_EXISTS");
  }

  if (!response.ok) {
    throw new Error("Unable to update product.");
  }

  return response.json();
}


export async function reorderAdminProductImages(
  productId: number,
  images: AdminProductImage[],
): Promise<AdminProductImage[]> {
  const response = await adminFetch(
    `/api/admin/products/${productId}/images/order`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        images: images.map(
          (image, position) => ({
            id: image.id,
            position,
          }),
        ),
      }),
    },
  );

  if (response.status === 401) {
    clearAdminToken();
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error(
      "Unable to reorder images.",
    );
  }

  return response.json();
}


export async function updateAdminProductImage(
  productId: number,
  imageId: number,
  altText: string,
): Promise<AdminProductImage> {
  const response = await adminFetch(
    `/api/admin/products/${productId}/images/${imageId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        alt_text: altText,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Unable to update image.",
    );
  }

  return response.json();
}
