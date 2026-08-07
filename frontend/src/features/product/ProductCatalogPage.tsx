import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  LoaderCircle,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import ProductImage from "@/components/product/ProductImage";
import {
  getCatalogOptions,
  type CatalogOptions,
} from "@/services/catalogOptionsApi";
import {
  getProducts,
  type ProductListResponse,
} from "@/services/catalogApi";

const PAGE_SIZE = 12;

export default function ProductCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const brand = searchParams.get("brand") ?? "";
  const category = searchParams.get("category") ?? "";
  const maxPrice = searchParams.get("max_price") ?? "";
  const sortBy = searchParams.get("sort_by") ?? "score";

  const searchTimeoutRef = useRef<number | null>(null);
  const maxPriceTimeoutRef = useRef<number | null>(null);

  const requestedPage = Number(searchParams.get("page") ?? "1");

  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const [catalog, setCatalog] =
    useState<ProductListResponse | null>(null);

  const [options, setOptions] =
    useState<CatalogOptions | null>(null);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current !== null) {
        window.clearTimeout(searchTimeoutRef.current);
      }

      if (maxPriceTimeoutRef.current !== null) {
        window.clearTimeout(maxPriceTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      try {
        const data = await getCatalogOptions();

        if (!cancelled) {
          setOptions(data);
        }
      } catch {
        if (!cancelled) {
          setOptions({
            brands: [],
            categories: [],
          });
        }
      }
    }

    void loadOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCatalog() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getProducts(
          currentPage,
          PAGE_SIZE,
          {
            query,
            brand,
            category,
            maxPrice,
            sortBy,
          },
          controller.signal,
        );

        setCatalog(data);
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        setError("Unable to load the product catalog.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadCatalog();

    return () => {
      controller.abort();
    };
  }, [
    currentPage,
    query,
    brand,
    category,
    maxPrice,
    sortBy,
    retryCount,
  ]);

  const totalPages = catalog
    ? Math.max(1, Math.ceil(catalog.total / catalog.page_size))
    : 1;

  const hasActiveFilters =
    Boolean(query || brand || category || maxPrice) ||
    sortBy !== "score";

  useEffect(() => {
    if (
      !isLoading &&
      catalog &&
      catalog.total > 0 &&
      currentPage > totalPages
    ) {
      const nextParams = new URLSearchParams(searchParams);

      nextParams.set("page", String(totalPages));
      setSearchParams(nextParams, { replace: true });
    }
  }, [
    catalog,
    currentPage,
    isLoading,
    searchParams,
    setSearchParams,
    totalPages,
  ]);

  function updateFilter(name: string, value: string) {
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set(name, value);
    } else {
      nextParams.delete(name);
    }

    nextParams.set("page", "1");
    setSearchParams(nextParams);
  }

  function clearFilters() {
    setSearchParams({});
  }

  function changePage(page: number) {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.set("page", String(page));
    setSearchParams(nextParams);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
        >
          <ArrowLeft size={17} />
          Back to search
        </Link>

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-xl shadow-slate-200/50">
          <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-200">
                <Sparkles size={14} />
                Atlasexa catalog
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
                Explore products built around your needs.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Compare scores, use cases and prices across Atlasexa's
                curated product catalog.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-bold">
                  {catalog?.total ?? "—"}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Products available
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-3xl font-bold">
                  {options?.categories.length ?? 6}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Product categories
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          aria-labelledby="catalog-filters-title"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <SlidersHorizontal size={19} />
              </div>

              <div>
                <h2
                  id="catalog-filters-title"
                  className="font-bold text-slate-950"
                >
                  Refine your search
                </h2>

                <p className="text-sm text-slate-500">
                  Filter products by what matters to you.
                </p>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
              >
                <Filter size={15} />
                Clear filters
              </button>
            )}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-4">
            <label className="relative lg:col-span-4">
              <span className="sr-only">Search products</span>

              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={19}
              />

              <input
                key={query}
                type="search"
                defaultValue={query}
                placeholder="Search by product, brand or feature..."
                autoComplete="off"
                onChange={(event) => {
                  const value = event.target.value.trim();

                  if (searchTimeoutRef.current !== null) {
                    window.clearTimeout(searchTimeoutRef.current);
                  }

                  searchTimeoutRef.current = window.setTimeout(() => {
                    updateFilter(
                      "q",
                      value.length >= 2 ? value : "",
                    );

                    searchTimeoutRef.current = null;
                  }, 400);
                }}
                className="min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-600">
              Brand
              <select
                value={brand}
                onChange={(event) =>
                  updateFilter("brand", event.target.value)
                }
                className="min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >
                <option value="">All brands</option>

                {options?.brands.map((brandName) => (
                  <option key={brandName} value={brandName}>
                    {brandName}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-600">
              Category
              <select
                value={category}
                onChange={(event) =>
                  updateFilter("category", event.target.value)
                }
                className="min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >
                <option value="">All categories</option>

                {options?.categories.map((categoryName) => (
                  <option key={categoryName} value={categoryName}>
                    {categoryName}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-600">
              Maximum price
              <input
                type="number"
                min="0"
                key={maxPrice}
                defaultValue={maxPrice}
                placeholder="e.g. 900"
                onChange={(event) => {
                  const value = event.target.value;

                  if (maxPriceTimeoutRef.current !== null) {
                    window.clearTimeout(maxPriceTimeoutRef.current);
                  }

                  maxPriceTimeoutRef.current = window.setTimeout(() => {
                    updateFilter("max_price", value);
                    maxPriceTimeoutRef.current = null;
                  }, 400);
                }}
                className="min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-600">
              Sort by
              <select
                value={sortBy}
                onChange={(event) =>
                  updateFilter("sort_by", event.target.value)
                }
                className="min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >
                <option value="score">Best score</option>
                <option value="price_low">Lowest price</option>
                <option value="price_high">Highest price</option>
                <option value="name">Product name</option>
              </select>
            </label>
          </div>
        </section>

        {!isLoading && !error && catalog && (
          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                Results
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                {catalog.total === 1
                  ? "1 product found"
                  : `${catalog.total} products found`}
              </h2>
            </div>

            {category && (
              <p className="text-sm text-slate-500">
                Showing products in{" "}
                <span className="font-semibold text-slate-800">
                  {category}
                </span>
              </p>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex min-h-[420px] items-center justify-center">
            <div className="text-center">
              <LoaderCircle
                className="mx-auto animate-spin text-slate-500"
                size={34}
              />

              <p className="mt-4 text-sm text-slate-500">
                Loading products...
              </p>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <section
            className="mt-10 rounded-[1.75rem] border border-red-200 bg-red-50 px-6 py-12 text-center"
            role="alert"
          >
            <h2 className="text-xl font-bold text-red-950">
              Unable to load products
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-6 rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
            >
              Retry
            </button>
          </section>
        )}

        {!isLoading &&
          !error &&
          catalog &&
          catalog.items.length === 0 && (
            <section className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                <Search size={20} className="text-slate-500" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-950">
                No products found
              </h2>

              <p className="mt-3 text-sm text-slate-500">
                Try changing or clearing the selected filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Clear filters
              </button>
            </section>
          )}

        {!isLoading &&
          !error &&
          catalog &&
          catalog.items.length > 0 && (
            <>
              <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {catalog.items.map((product) => (
                  <Link
                    key={product.slug}
                    to={`/products/${product.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
                  >
                    <div className="relative p-4 pb-0">
                      <ProductImage
                        src={product.image_url}
                        alt={product.name}
                        className="aspect-[4/3] rounded-[1.4rem] border border-slate-100 bg-slate-50"
                      />

                      <span className="absolute right-7 top-7 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                        {product.score}/100
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                        <span className="text-blue-600">
                          {product.category}
                        </span>

                        <span className="text-slate-300">
                          •
                        </span>

                        <span className="text-slate-400">
                          {product.brand}
                        </span>
                      </div>

                      <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-950">
                        {product.name}
                      </h2>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                        {product.description ??
                          "No description available."}
                      </p>

                      {product.best_for && (
                        <div className="mt-5 rounded-2xl bg-blue-50 px-4 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                            Best for
                          </p>

                          <p className="mt-1 text-sm font-semibold text-blue-950">
                            {product.best_for}
                          </p>
                        </div>
                      )}

                      <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                        <div>
                          <p className="text-xs text-slate-400">
                            Starting from
                          </p>

                          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                            {product.minimum_price !== null &&
                            product.currency
                              ? product.minimum_price.toLocaleString(
                                  "en-US",
                                  {
                                    style: "currency",
                                    currency: product.currency,
                                  },
                                )
                              : "Unavailable"}
                          </p>
                        </div>

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white transition group-hover:translate-x-1">
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </section>

              {totalPages > 1 && (
                <nav
                  className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
                  aria-label="Product catalog pagination"
                >
                  <button
                    type="button"
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={17} />
                    Previous
                  </button>

                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={17} />
                  </button>
                </nav>
              )}
            </>
          )}
      </div>
    </main>
  );
}
