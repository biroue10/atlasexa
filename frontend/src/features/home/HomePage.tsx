import { LoaderCircle, Search } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useComparison } from "@/features/comparison/useComparison";
import {
  searchProducts,
  type SearchResponse,
} from "@/services/searchApi";

const suggestions = [
  "Laptop",
  "Headphones",
  "Smartwatch",
  "Smartphone",
  "Monitor",
  "Camera",
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    addProduct,
    removeProduct,
    isSelected,
    products: comparisonProducts,
  } = useComparison();

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
      <div className="mx-auto w-full max-w-5xl text-center">
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

        {error && (
          <p className="mt-10 text-red-600" role="alert">
            {error}
          </p>
        )}

        {result && (
          <section className="mx-auto mt-16 max-w-4xl text-left">
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
