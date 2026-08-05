import {
  ArrowLeft,
  ExternalLink,
  LoaderCircle,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { compareProducts } from "@/services/comparisonApi";
import type {
  ProductDetail,
  ProductSpecification,
} from "@/services/productApi";

import { useComparison } from "./useComparison";

export default function ComparisonPage() {
  const {
    products: selectedProducts,
    removeProduct,
    clearProducts,
  } = useComparison();

  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(
    selectedProducts.length >= 2,
  );

  const selectedSlugs = useMemo(
    () => selectedProducts.map((product) => product.slug),
    [selectedProducts],
  );

  useEffect(() => {
    if (selectedSlugs.length < 2) {
      return;
    }

    let cancelled = false;

    async function loadComparison() {
      setIsLoading(true);
      setError("");

      try {
        const data = await compareProducts(selectedSlugs);

        if (!cancelled) {
          setProducts(data.products);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load the product comparison.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadComparison();

    return () => {
      cancelled = true;
    };
  }, [selectedSlugs]);

  const specificationNames = useMemo(() => {
    const names = new Set<string>();

    products.forEach((product) => {
      product.specifications.forEach((specification) => {
        names.add(specification.name);
      });
    });

    return Array.from(names);
  }, [products]);

  function findSpecification(
    product: ProductDetail,
    name: string,
  ): ProductSpecification | undefined {
    return product.specifications.find(
      (specification) => specification.name === name,
    );
  }

  if (selectedProducts.length < 2) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Select at least two products
        </h1>

        <p className="max-w-xl text-slate-600">
          Return to the search page and add two or more products.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-medium text-white"
        >
          <ArrowLeft size={18} />
          Back to search
        </Link>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoaderCircle
          className="animate-spin text-slate-600"
          size={34}
        />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-6">
        <p className="text-lg text-red-600">{error}</p>

        <Link className="text-blue-600 hover:underline" to="/">
          Return home
        </Link>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
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

        <div className="mt-10 overflow-x-auto rounded-3xl border border-slate-200 bg-white">
          <table className="min-w-[900px] w-full border-collapse">
            <thead>
              <tr>
                <th className="w-48 border-b border-r border-slate-200 p-5 text-left text-sm text-slate-500">
                  Product
                </th>

                {products.map((product) => (
                  <th
                    key={product.slug}
                    className="min-w-64 border-b border-r border-slate-200 p-5 text-left last:border-r-0"
                  >
                    <h2 className="text-xl font-semibold text-slate-900">
                      {product.name}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      {product.brand}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeProduct(product.slug)}
                      className="mt-4 text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                <th className="border-b border-r border-slate-200 p-5 text-left">
                  Atlasexa score
                </th>

                {products.map((product) => (
                  <td
                    key={product.slug}
                    className="border-b border-r border-slate-200 p-5 last:border-r-0"
                  >
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                        product.score === Math.max(
                          ...products.map((item) => item.score),
                        )
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {product.score}/100
                    </span>

                    {product.score_explanation && (
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {product.score_explanation}
                      </p>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border-b border-r border-slate-200 p-5 text-left">
                  Price
                </th>

                {products.map((product) => {
                  const offer = product.prices[0];

                  return (
                    <td
                      key={product.slug}
                      className="border-b border-r border-slate-200 p-5 last:border-r-0"
                    >
                      {offer ? (
                        <>
                          <p className="text-2xl font-bold text-slate-900">
                            {offer.price.toLocaleString(undefined, {
                              style: "currency",
                              currency: offer.currency,
                            })}
                          </p>

                          <a
                            href={offer.product_url}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600"
                          >
                            View offer
                            <ExternalLink size={15} />
                          </a>
                        </>
                      ) : (
                        <span className="text-slate-400">
                          No offer
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {specificationNames.map((name) => (
                <tr key={name}>
                  <th className="border-b border-r border-slate-200 p-5 text-left text-sm font-medium text-slate-700">
                    {name}
                  </th>

                  {products.map((product) => {
                    const specification = findSpecification(
                      product,
                      name,
                    );

                    return (
                      <td
                        key={product.slug}
                        className="border-b border-r border-slate-200 p-5 text-slate-600 last:border-r-0"
                      >
                        {specification?.value ?? "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
