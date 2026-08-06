import { afterEach, describe, expect, it, vi } from "vitest";

import { getProducts } from "@/services/catalogApi";

describe("getProducts", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends pagination, search and catalog filters", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [],
          total: 0,
          page: 2,
          page_size: 12,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    const result = await getProducts(
      2,
      12,
      {
        query: "programming",
        brand: "Lenovo",
        category: "Laptops",
        maxPrice: "900",
        sortBy: "price_high",
      },
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [requestUrl, requestOptions] = fetchMock.mock.calls[0];
    const url = new URL(String(requestUrl));

    expect(url.pathname).toBe("/api/products");
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("page_size")).toBe("12");
    expect(url.searchParams.get("q")).toBe("programming");
    expect(url.searchParams.get("brand")).toBe("Lenovo");
    expect(url.searchParams.get("category")).toBe("Laptops");
    expect(url.searchParams.get("max_price")).toBe("900");
    expect(url.searchParams.get("sort_by")).toBe("price_high");
    expect(requestOptions).toEqual({ signal: undefined });

    expect(result).toEqual({
      items: [],
      total: 0,
      page: 2,
      page_size: 12,
    });
  });

  it("omits empty optional filters", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [],
          total: 0,
          page: 1,
          page_size: 12,
        }),
        { status: 200 },
      ),
    );

    await getProducts(1);

    const [requestUrl] = fetchMock.mock.calls[0];
    const url = new URL(String(requestUrl));

    expect(url.searchParams.get("page")).toBe("1");
    expect(url.searchParams.get("page_size")).toBe("12");
    expect(url.searchParams.has("q")).toBe(false);
    expect(url.searchParams.has("brand")).toBe(false);
    expect(url.searchParams.has("category")).toBe(false);
    expect(url.searchParams.has("max_price")).toBe(false);
    expect(url.searchParams.has("sort_by")).toBe(false);
  });

  it("throws when the API response is unsuccessful", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 500 }),
    );

    await expect(getProducts(1)).rejects.toThrow(
      "Unable to load products: 500",
    );
  });
});
