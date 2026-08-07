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
