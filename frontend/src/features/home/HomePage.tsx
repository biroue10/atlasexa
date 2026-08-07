import {
  ArrowRight,
  CheckCircle2,
  Headphones,
  Laptop,
  LoaderCircle,
  Monitor,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tablet,
  Watch,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import ProductImage from "@/components/product/ProductImage";
import { useComparison } from "@/features/comparison/useComparison";
import {
  getHomeHighlights,
  type HomeHighlightProduct,
} from "@/services/homeApi";
import {
  searchProducts,
  type SearchResponse,
} from "@/services/searchApi";

const suggestions = [
  "Laptop for programming",
  "Travel headphones",
  "Best smartphone",
  "4K monitor",
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
  const [topProducts, setTopProducts] = useState<HomeHighlightProduct[]>([]);
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
        const products = await getHomeHighlights(controller.signal);
        setTopProducts(products);
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        setTopProductsError("Unable to load top picks.");
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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <section className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur">
              <Sparkles size={16} />
              Smarter product decisions
            </div>

            <div className="mt-7 flex items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white shadow-lg">
                A
              </div>

              <h1 className="text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Atlasexa
              </h1>
            </div>

            <h2 className="mx-auto mt-8 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Find the right product,
              <span className="text-blue-600"> without the research overload.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Tell Atlasexa what you need. We compare products, explain the
              differences and surface the strongest options for your use case.
            </p>

            <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-4xl">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-2 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.22)]">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <Search
                      className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={21}
                    />

                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="e.g. Best headphones for long flights under $300"
                      className="min-h-14 w-full rounded-2xl border-0 bg-transparent py-4 pl-14 pr-4 text-base text-slate-900 outline-none placeholder:text-slate-400 sm:text-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <LoaderCircle className="animate-spin" size={18} />
                        Analyzing
                      </>
                    ) : (
                      <>
                        Find products
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="mr-1 py-2 text-sm text-slate-400">
                Try:
              </span>

              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setQuery(suggestion)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-left shadow-sm backdrop-blur">
                <p className="text-2xl font-bold text-slate-950">30+</p>
                <p className="mt-1 text-sm text-slate-500">
                  Curated products
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-left shadow-sm backdrop-blur">
                <p className="text-2xl font-bold text-slate-950">6</p>
                <p className="mt-1 text-sm text-slate-500">
                  Core categories
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-left shadow-sm backdrop-blur">
                <p className="text-2xl font-bold text-slate-950">100%</p>
                <p className="mt-1 text-sm text-slate-500">
                  Decision-focused
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <section>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                Explore
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Shop by category
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-500">
                Start with the type of product you need and narrow down from
                there.
              </p>
            </div>

            <Link
              to="/products?page=1"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Browse all products
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  to={`/products?category=${encodeURIComponent(
                    category.name,
                  )}&page=1`}
                  className="group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 transition group-hover:bg-slate-950 group-hover:text-white">
                      <Icon size={22} />
                    </div>

                    <ArrowRight
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700"
                      size={18}
                    />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-950">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {category.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-24">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Atlasexa picks
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Top picks by category
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-500">
                Our highest-rated picks across the categories people shop most.
              </p>
            </div>

            <Link
              to="/products?sort_by=score&page=1"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all products
              <ArrowRight size={16} />
            </Link>
          </div>

          {topProductsError && (
            <p className="mt-8 text-sm text-red-600" role="alert">
              {topProductsError}
            </p>
          )}

          {topProducts.length > 0 && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {topProducts.map((product) => (
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
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                      <span>{product.category}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400">
                        {product.brand}
                      </span>
                    </div>

                    <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-950">
                      {product.name}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                      {product.description ?? "No description available."}
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

                        <p className="mt-1 text-xl font-bold text-slate-950">
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

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition group-hover:translate-x-1">
                        <ArrowRight size={17} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-24 overflow-hidden rounded-[2rem] bg-slate-950 text-white">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <ShieldCheck size={23} />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Why Atlasexa
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Less browsing. Better decisions.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-300">
                Product pages should help you decide, not overwhelm you with
                specifications. Atlasexa focuses on fit, value and clear
                trade-offs.
              </p>
            </div>

            <div className="grid gap-px bg-white/10 sm:grid-cols-3">
              {[
                {
                  title: "Compare",
                  text: "See products side by side with the details that matter.",
                },
                {
                  title: "Understand",
                  text: "Know why a product fits a specific use case.",
                },
                {
                  title: "Decide",
                  text: "Move from research to purchase with more confidence.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-slate-950 p-8 sm:p-7 lg:p-8"
                >
                  <CheckCircle2
                    className="text-emerald-400"
                    size={20}
                  />

                  <h3 className="mt-5 text-lg font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {error && (
          <p className="mt-10 text-center text-red-600" role="alert">
            {error}
          </p>
        )}

        {result && (
          <section className="mt-24">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Recommendations
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  Best matches for your search
                </h2>

                <p className="mt-3 leading-7 text-slate-500">
                  {result.summary}
                </p>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {result.products.map((product) => (
                  <Link
                    key={product.slug}
                    to={`/products/${product.slug}`}
                    className="group flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-slate-50/60 p-6 transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-slate-950">
                        {product.name}
                      </h3>

                      <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                        {product.score}/100
                      </span>
                    </div>

                    <p className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
                      {product.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: product.currency,
                      })}
                    </p>

                    <p className="mt-4 text-sm leading-6 text-slate-500">
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
                      className={`mt-6 w-full rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        isSelected(product.slug)
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                      }`}
                    >
                      {isSelected(product.slug)
                        ? "Selected for comparison"
                        : "Add to comparison"}
                    </button>

                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
                      View product details
                      <ArrowRight
                        className="transition group-hover:translate-x-1"
                        size={16}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
