import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ExternalLink,
  LoaderCircle,
  Sparkles,
  Trash2,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import ProductImage from "@/components/product/ProductImage";
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

  const highestScore = useMemo(() => {
    return products.length
      ? Math.max(...products.map((product) => product.score))
      : 0;
  }, [products]);

  const lowestPrice = useMemo(() => {
    const prices = products
      .flatMap((product) => product.prices)
      .map((offer) => offer.price);

    return prices.length ? Math.min(...prices) : null;
  }, [products]);

  function findSpecification(
    product: ProductDetail,
    name: string,
  ): ProductSpecification | undefined {
    return product.specifications.find(
      (specification) => specification.name === name,
    );
  }

  function getBestFor(product: ProductDetail) {
    return findSpecification(product, "Best for")?.value;
  }

  function getBestOffer(product: ProductDetail) {
    if (!product.prices.length) {
      return null;
    }

    return [...product.prices].sort(
      (a, b) => a.price - b.price,
    )[0];
  }

  if (selectedProducts.length < 2) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <Trophy size={24} />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">
          Select at least two products
        </h1>

        <p className="mt-3 max-w-xl leading-7 text-slate-500">
          Choose two or more products to compare their scores, prices and
          specifications side by side.
        </p>

        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          <ArrowLeft size={17} />
          Back to search
        </Link>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoaderCircle
          className="animate-spin text-slate-500"
          size={34}
        />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-6">
        <p className="text-lg font-medium text-red-600">
          {error}
        </p>

        <Link
          className="font-medium text-blue-600 hover:underline"
          to="/"
        >
          Return home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              <ArrowLeft size={17} />
              Back to search
            </Link>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
              <Sparkles size={14} />
              Atlasexa comparison
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Compare products
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              See the strongest differences, understand the trade-offs and
              choose the product that fits you best.
            </p>
          </div>

          <button
            type="button"
            onClick={clearProducts}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
          >
            <Trash2 size={16} />
            Clear comparison
          </button>
        </div>

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          {products.map((product) => {
            const offer = getBestOffer(product);
            const bestFor = getBestFor(product);
            const isBestOverall = product.score === highestScore;
            const isBestPrice =
              offer &&
              lowestPrice !== null &&
              offer.price === lowestPrice;

            return (
              <article
                key={product.slug}
                className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="absolute right-5 top-5 flex flex-wrap justify-end gap-2">
                  {isBestOverall && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                      <Trophy size={13} />
                      Best overall
                    </span>
                  )}

                  {isBestPrice && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                      <Award size={13} />
                      Best price
                    </span>
                  )}
                </div>

                <ProductImage
                  src={product.image_url}
                  alt={product.name}
                  className="aspect-[4/3] rounded-[1.5rem] border border-slate-100 bg-slate-50"
                />

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
                    {product.brand} · {product.category}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                    {product.name}
                  </h2>

                  {product.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                      {product.description}
                    </p>
                  )}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                        Atlasexa score
                      </p>

                      <p className="mt-1 text-2xl font-bold text-emerald-950">
                        {product.score}
                        <span className="ml-1 text-sm font-medium text-emerald-700">
                          /100
                        </span>
                      </p>
                    </div>

                    {bestFor && (
                      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                          Best for
                        </p>

                        <p className="mt-1 text-sm font-semibold text-blue-950">
                          {bestFor}
                        </p>
                      </div>
                    )}
                  </div>

                  {offer && (
                    <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Best available offer
                      </p>

                      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-3xl font-bold tracking-tight">
                            {offer.price.toLocaleString(undefined, {
                              style: "currency",
                              currency: offer.currency,
                            })}
                          </p>

                          <p className="mt-1 text-sm text-slate-400">
                            {offer.merchant}
                          </p>
                        </div>

                        <a
                          href={offer.product_url}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                        >
                          View offer
                          <ExternalLink size={15} />
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => removeProduct(product.slug)}
                      className="text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>

                    <Link
                      to={`/products/${product.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      View product
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-7 text-white shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Atlasexa verdict
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            {products.find((product) => product.score === highestScore)?.name}
            {" "}leads overall.
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            It has the highest Atlasexa score in this comparison. Review the
            detailed specifications below to see whether its strengths match
            your priorities.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products
              .find((product) => product.score === highestScore)
              ?.specifications.filter(
                (specification) =>
                  specification.name.toLowerCase() !== "best for",
              )
              .slice(0, 3)
              .map((specification) => (
                <div
                  key={`${specification.group}-${specification.name}`}
                  className="flex items-start gap-3 rounded-2xl bg-white/5 p-4"
                >
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-emerald-400"
                    size={17}
                  />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {specification.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      {specification.value}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
              Detailed comparison
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Specifications side by side
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-52 border-b border-r border-slate-200 bg-slate-50 p-5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Specification
                  </th>

                  {products.map((product) => (
                    <th
                      key={product.slug}
                      className="min-w-72 border-b border-r border-slate-200 p-5 text-left last:border-r-0"
                    >
                      <p className="font-bold text-slate-950">
                        {product.name}
                      </p>

                      <p className="mt-1 text-sm font-normal text-slate-500">
                        {product.brand}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {specificationNames.map((name) => (
                  <tr key={name} className="hover:bg-slate-50/70">
                    <th className="border-b border-r border-slate-200 p-5 text-left text-sm font-semibold text-slate-700">
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
                          className="border-b border-r border-slate-200 p-5 text-sm leading-6 text-slate-600 last:border-r-0"
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
        </section>
      </div>
    </main>
  );
}
