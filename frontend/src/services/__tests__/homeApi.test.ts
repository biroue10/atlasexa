import { afterEach, describe, expect, it, vi } from "vitest";

import { getHomeHighlights } from "@/services/homeApi";

describe("getHomeHighlights", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns homepage highlight products", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [
            {
              id: 10,
              name: "MacBook Air 13",
              slug: "macbook-air-13",
              description: "Test description",
              image_url: null,
              brand: "Apple",
              category: "Laptops",
              score: 94,
              minimum_price: 1099,
              currency: "USD",
              best_for: "Travel and productivity",
            },
          ],
        }),
        { status: 200 },
      ),
    );

    const products = await getHomeHighlights();

    expect(products).toHaveLength(1);
    expect(products[0].slug).toBe("macbook-air-13");
    expect(products[0].best_for).toBe(
      "Travel and productivity",
    );
  });

  it("throws when homepage highlights fail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 500 }),
    );

    await expect(getHomeHighlights()).rejects.toThrow(
      "Unable to load homepage highlights: 500",
    );
  });
});
