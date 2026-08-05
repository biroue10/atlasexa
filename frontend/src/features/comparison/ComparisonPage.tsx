import { ArrowLeft, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { useComparison } from "@/features/comparison/useComparison";

export default function ComparisonPage() {
  const {
    products,
    removeProduct,
    clearProducts,
  } = useComparison();

  const bestScore =
    products.length > 0
      ? Math.max(...products.map((product) => product.score))
      : 0;

  if (products.length < 2) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Select at least two products
        </h1>

        <p className="max-w-xl text-slate-600">
          Return to the search page and add two or more products to compare.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800"
        >
          <ArrowLeft size={18} />
          Back to search
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft size={18} />
              Back to search
            </Link>

            <h1 className="mt-5 text-4xl font-bold text-slate-900">
              Product comparison
            </h1>

            <p className="mt-2 text-slate-600">
              Compare prices, scores and recommendations side by side.
            </p>
          </div>

          <button
            type="button"
            onClick={clearProducts}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 hover:bg-white"
          >
            <Trash2 size={17} />
            Clear comparison
          </button>
        </div>

        <section className="mt-10 overflow-x-auto">
          <div
            className="grid min-w-[720px] gap-5"
            style={{
              gridTemplateColumns: `repeat(${products.length}, minmax(220px, 1fr))`,
            }}
          >
            {products.map((product) => {
              const isBest = product.score === bestScore;

              return (
                <article
                  key={product.slug}
                  className={`relative rounded-3xl border bg-white p-6 shadow-sm ${
                    isBest
                      ? "border-emerald-500 ring-2 ring-emerald-100"
                      : "border-slate-200"
                  }`}
                >
                  {isBest && (
                    <span className="absolute right-5 top-5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Best score
                    </span>
                  )}

                  <h2 className="pr-24 text-xl font-semibold text-slate-900">
                    {product.name}
                  </h2>

                  <p className="mt-6 text-3xl font-bold text-slate-900">
                    {product.price.toLocaleString(undefined, {
                      style: "currency",
                      currency: product.currency,
                    })}
                  </p>

                  <div className="mt-6">
                    <p className="text-sm text-slate-500">Atlasexa score</p>

                    <p className="mt-1 text-2xl font-bold text-emerald-700">
                      {product.score}/100
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-medium text-slate-900">
                      Why it is recommended
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {product.reason}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-col gap-3">
                    <Link
                      to={`/products/${product.slug}`}
                      className="rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white hover:bg-slate-800"
                    >
                      View product
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeProduct(product.slug)}
                      className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
