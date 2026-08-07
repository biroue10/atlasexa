import {
  Headphones,
  Laptop,
  LoaderCircle,
  Monitor,
  Search,
  Smartphone,
  Tablet,
  Watch,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { useComparison } from "@/features/comparison/useComparison";
import {
  searchProducts,
  type SearchResponse,
} from "@/services/searchApi";
import {
  getProducts,
  type CatalogProduct,
} from "@/services/catalogApi";

const suggestions = [
  "Laptop",
  "Headphones",
  "Smartwatch",
  "Smartphone",
  "Monitor",
  "Tablet",
];

const categories = [
  {
    name: "Laptops",
    description: "Work, study, programming and everyday productivity.",
    icon: Laptop,
  },
  {
    name: "Smartphones",
    description: "Compare cameras, performance, battery and value.",
    icon: Smartphone,
  },
  {
    name: "Headphones",
    description: "Find the right sound, comfort and noise cancellation.",
    icon: Headphones,
  },
  {
    name: "Tablets",
    description: "Discover tablets for creativity, study and entertainment.",
    icon: Tablet,
  },
  {
    name: "Monitors",
    description: "Compare monitors for work, design and gaming.",
    icon: Monitor,
  },
  {
    name: "Smartwatches",
    description: "Explore health, fitness and everyday smart features.",
    icon: Watch,
  },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [topProducts, setTopProducts] = useState<CatalogProduct[]>([]);
  const [topProductsError, setTopProductsError] = useState("");

  const {
    addProduct,
    removeProduct,
    isSelected,
    products: comparisonProducts,
  } = useComparison();

  useEffect(() => {
    const controller = new AbortController();

    async function loadTopProducts() {
      try {
        const data = await getProducts(
          1,
          6,
          { sortBy: "score" },
          controller.signal,
        );

        setTopProducts(data.items);
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        setTopProductsError("Unable to load top rated products.");
      }
    }

    void loadTopProducts();

    return () => {
      controller.abort();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanQuery = query.trim();

    if (!cleanQuery || isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await searchProducts(cleanQuery);
      setResult(data);
    } catch {
      setError("Unable to search products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <section className="text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-bold text-white">
              A
            </div>

            <h1 className="text-6xl font-bold tracking-tight text-slate-900">
              Atlasexa
            </h1>
          </div>

          <p className="mt-6 text-3xl text-slate-700">
            Find the best product with AI.
          </p>

          <p className="mt-3 text-lg text-slate-500">
            Tell Atlasexa what you need. We’ll compare, explain and recommend.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto mt-12 max-w-4xl">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                size={22}
              />

              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="What are you looking for today?"
                className="w-full rounded-2xl border border-slate-300 py-5 pl-14 pr-5 text-lg outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="mt-8 inline-flex min-w-48 items-center justify-center gap-2 rounded-xl bg-slate-900 px-10 py-4 text-lg font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin" size={20} />
                  Analyzing...
                </>
              ) : (
                "Find Products"
              )}
            </button>
          </form>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuery(suggestion)}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Explore
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Browse by category
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              Start with a category and compare the products that fit your needs.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  to={`/products?category=${encodeURIComponent(category.name)}&page=1`}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-800 transition group-hover:bg-slate-900 group-hover:text-white">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-slate-900">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {category.description}
                  </p>

                  <p className="mt-5 text-sm font-medium text-blue-600">
                    Explore category →
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Top picks
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                Top rated products
              </h2>

              <p className="mt-3 text-slate-500">
                Discover the highest-rated products currently available in Atlasexa.
              </p>
            </div>

            <Link
              to="/products?sort_by=score&page=1"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all products →
            </Link>
          </div>

          {topProductsError && (
            <p className="mt-8 text-sm text-red-600" role="alert">
              {topProductsError}
            </p>
          )}

          {topProducts.length > 0 && (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {topProducts.map((product) => (
                <Link
                  key={product.slug}
                  to={`/products/${product.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-blue-600">
                        {product.category}
                      </p>

                      <h3 className="mt-2 text-lg font-semibold text-slate-900">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {product.brand}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
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

                    <p className="mt-1 text-xl font-bold text-slate-900">
                      {product.minimum_price !== null &&
                      product.currency
                        ? product.minimum_price.toLocaleString("en-US", {
                            style: "currency",
                            currency: product.currency,
                          })
                        : "Unavailable"}
                    </p>

                    <p className="mt-5 text-sm font-medium text-blue-600">
                      View product →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-24 rounded-3xl bg-slate-950 px-8 py-12 text-white">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Compare
              </p>
              <h3 className="mt-3 text-xl font-semibold">
                Compare products side by side
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Review specifications, prices and scores in one place.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Understand
              </p>
              <h3 className="mt-3 text-xl font-semibold">
                Clear recommendations
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Atlasexa explains why a product may be a better fit for you.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Decide
              </p>
              <h3 className="mt-3 text-xl font-semibold">
                Make decisions faster
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Filter by category, brand, price and relevance before comparing.
              </p>
            </div>
          </div>
        </section>

        {error && (
          <p className="mt-10 text-center text-red-600" role="alert">
            {error}
          </p>
        )}

        {result && (
          <section className="mx-auto mt-20 max-w-5xl text-left">
            <h2 className="text-2xl font-bold text-slate-900">
              Recommendations
            </h2>

            <p className="mt-2 text-slate-500">{result.summary}</p>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {result.products.map((product) => (
                <Link
                  key={product.slug}
                  to={`/products/${product.slug}`}
                  className="flex h-full flex-col rounded-2xl border border-slate-200 p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-slate-900">
                      {product.name}
                    </h3>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                      {product.score}/100
                    </span>
                  </div>

                  <p className="mt-4 text-2xl font-bold text-slate-900">
                    {product.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: product.currency,
                    })}
                  </p>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {product.reason}
                  </p>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      if (isSelected(product.slug)) {
                        removeProduct(product.slug);
                        return;
                      }

                      addProduct(product);
                    }}
                    disabled={
                      !isSelected(product.slug) &&
                      comparisonProducts.length >= 4
                    }
                    className={`mt-auto w-full rounded-xl border px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      isSelected(product.slug)
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {isSelected(product.slug)
                      ? "Selected for comparison"
                      : "Add to comparison"}
                  </button>

                  <p className="mt-5 text-sm font-medium text-blue-600">
                    View product details →
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
