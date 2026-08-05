import { ArrowLeft, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  getProducts,
  type ProductListResponse,
} from "@/services/catalogApi";
import {
  getCatalogOptions,
  type CatalogOptions,
} from "@/services/catalogOptionsApi";

const PAGE_SIZE = 12;

export default function ProductCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [brand, setBrand] = useState(searchParams.get("brand") ?? "");
  const [category, setCategory] = useState(
    searchParams.get("category") ?? "",
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("max_price") ?? "",
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort_by") ?? "score",
  );
  const requestedPage = Number(searchParams.get("page") ?? "1");
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const [catalog, setCatalog] =
    useState<ProductListResponse | null>(null);
  const [options, setOptions] = useState<CatalogOptions | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
    let cancelled = false;

    async function loadCatalog() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getProducts(currentPage, PAGE_SIZE, {
          brand,
          category,
          maxPrice,
          sortBy,
        });

        if (!cancelled) {
          setCatalog(data);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load the product catalog.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadCatalog();

    return () => {
      cancelled = true;
    };
  }, [currentPage, brand, category, maxPrice, sortBy]);

  const totalPages = catalog
    ? Math.max(1, Math.ceil(catalog.total / catalog.page_size))
    : 1;

  function changePage(page: number) {
    setSearchParams({ page: String(page) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Back to search
        </Link>

        <div className="mt-6">
          <h1 className="text-4xl font-bold text-slate-900">
            Product catalog
          </h1>

          <p className="mt-3 text-slate-600">
            Explore products ranked and analyzed by Atlasexa.
          </p>
        </div>

        <section className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-4">
          <label className="grid gap-2 text-sm text-slate-700">
            Brand
            <select
              value={brand}
              onChange={(event) => {
                setBrand(event.target.value);
                setSearchParams({ page: "1" });
              }}
              className="rounded-xl border border-slate-300 px-3 py-3"
            >
              <option value="">All brands</option>
              {options?.brands.map((brandName) => (
                <option key={brandName} value={brandName}>
                  {brandName}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-slate-700">
            Category
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setSearchParams({ page: "1" });
              }}
              className="rounded-xl border border-slate-300 px-3 py-3"
            >
              <option value="">All categories</option>
              {options?.categories.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-slate-700">
            Maximum price
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => {
                setMaxPrice(event.target.value);
                setSearchParams({ page: "1" });
              }}
              placeholder="900"
              className="rounded-xl border border-slate-300 px-3 py-3"
            />
          </label>

          <label className="grid gap-2 text-sm text-slate-700">
            Sort by
            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setSearchParams({ page: "1" });
              }}
              className="rounded-xl border border-slate-300 px-3 py-3"
            >
              <option value="score">Best score</option>
              <option value="price_low">Lowest price</option>
              <option value="price_high">Highest price</option>
              <option value="name">Product name</option>
            </select>
          </label>
        </section>
        {isLoading && (
          <div className="flex min-h-80 items-center justify-center">
            <LoaderCircle
              className="animate-spin text-slate-600"
              size={34}
            />
          </div>
        )}

        {error && (
          <p className="mt-10 text-red-600" role="alert">
            {error}
          </p>
        )}

        {!isLoading && catalog && (
          <>
            <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {catalog.items.map((product) => (
                <Link
                  key={product.slug}
                  to={`/products/${product.slug}`}
                  className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">
                        {product.brand}
                      </p>

                      <h2 className="mt-2 text-xl font-semibold text-slate-900">
                        {product.name}
                      </h2>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                      {product.score}/100
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                    {product.description ?? "No description available."}
                  </p>

                  <div className="mt-auto pt-6">
                    <p className="text-sm text-slate-500">
                      Starting from
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {product.minimum_price !== null &&
                      product.currency
                        ? product.minimum_price.toLocaleString("en-US", {
                            style: "currency",
                            currency: product.currency,
                          })
                        : "Unavailable"}
                    </p>

                    <p className="mt-4 text-sm font-medium text-blue-600">
                      View product details →
                    </p>
                  </div>
                </Link>
              ))}
            </section>

            <nav
              className="mt-12 flex items-center justify-center gap-4"
              aria-label="Product catalog pagination"
            >
              <button
                type="button"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              <span className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={17} />
              </button>
            </nav>
          </>
        )}
      </div>
    </main>
  );
}
