import { ArrowLeft, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  getProducts,
  type ProductListResponse,
} from "@/services/catalogApi";

const PAGE_SIZE = 12;

export default function ProductCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPage = Number(searchParams.get("page") ?? "1");
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const [catalog, setCatalog] =
    useState<ProductListResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getProducts(currentPage, PAGE_SIZE);

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
  }, [currentPage]);

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
