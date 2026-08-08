import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ProductImage from "@/components/product/ProductImage";
import SeoHead from "@/components/seo/SeoHead";
import {
  getProduct,
  type ProductDetail,
} from "@/services/productApi";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const productSlug = slug ?? "";

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productSlug) {
      return;
    }

    let cancelled = false;

    async function loadProduct() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getProduct(productSlug);

        if (!cancelled) {
          setProduct(data);

          const primaryImage =
            data.images.find((image) => image.is_primary)?.image_url ??
            data.images[0]?.image_url ??
            data.image_url;

          setSelectedImage(primaryImage);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load this product.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productSlug]);

  const bestFor = useMemo(() => {
    return product?.specifications.find(
      (specification) =>
        specification.name.toLowerCase() === "best for",
    )?.value;
  }, [product]);

  const bestOffer = useMemo(() => {
    if (!product?.prices.length) {
      return null;
    }

    return [...product.prices].sort(
      (a, b) => a.price - b.price,
    )[0];
  }, [product]);

  const groupedSpecifications = useMemo(() => {
    if (!product) {
      return [];
    }

    return product.specifications.filter(
      (specification) =>
        specification.name.toLowerCase() !== "best for",
    );
  }, [product]);

  if (!productSlug) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50">
        <p className="text-lg font-medium text-red-600">
          Invalid product.
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

  if (error || !product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50">
        <p className="text-lg font-medium text-red-600">
          {error || "Product not found."}
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

  const seoTitle =
    product.seo_title?.trim() ||
    `${product.name} Review, Specs & Best Price | Atlasexa`;

  const seoDescription =
    product.meta_description?.trim() ||
    product.description?.slice(0, 160) ||
    `Compare ${product.name} specifications, Atlasexa score and current offers.`;

  const canonicalUrl =
    product.canonical_url?.trim() ||
    `https://atlasexa.com/products/${product.slug}`;

  const primarySeoImage =
    product.images.find(
      (image) => image.is_primary,
    )?.image_url ??
    product.image_url;

  return (
    <>
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        canonical={canonicalUrl}
        image={primarySeoImage}
        ogTitle={product.og_title}
        ogDescription={product.og_description}
        indexable={product.is_indexable}
      />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <nav className="mb-7 flex items-center gap-2 text-sm text-slate-500">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-medium transition hover:text-slate-900"
          >
            <ArrowLeft size={17} />
            Back to search
          </Link>

          <span className="hidden text-slate-300 sm:inline">/</span>

          <span className="hidden sm:inline">
            {product.category}
          </span>

          <span className="hidden text-slate-300 sm:inline">/</span>

          <span className="hidden max-w-64 truncate font-medium text-slate-700 sm:inline">
            {product.name}
          </span>
        </nav>

        <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.18)]">
          <div className="grid gap-10 p-5 sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:p-12">
            <div className="min-w-0">
              <div className="relative">
                <div className="absolute left-4 top-4 z-10 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm backdrop-blur">
                  {product.brand}
                </div>

                <ProductImage
                  src={selectedImage ?? product.image_url}
                  alt={product.name}
                  className="aspect-square rounded-[1.75rem] border border-slate-200 bg-slate-50"
                />
              </div>

              {product.images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {product.images.map((image) => {
                    const isSelected =
                      image.image_url === selectedImage;

                    return (
                      <button
                        key={image.image_url}
                        type="button"
                        onClick={() =>
                          setSelectedImage(image.image_url)
                        }
                        aria-label={`View ${
                          image.alt_text ?? product.name
                        }`}
                        aria-pressed={isSelected}
                        className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white p-1.5 transition duration-200 hover:-translate-y-0.5 ${
                          isSelected
                            ? "border-blue-600 shadow-md"
                            : "border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        <ProductImage
                          src={image.image_url}
                          alt={image.alt_text ?? product.name}
                          className="h-full w-full rounded-xl"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {product.category}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <Sparkles size={14} />
                  Atlasexa pick
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                {product.name}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                {product.description ??
                  "No product description available."}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 font-bold text-white">
                    {product.score}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      Atlasexa score
                    </p>
                    <p className="text-sm font-medium text-emerald-950">
                      {product.score}/100
                    </p>
                  </div>
                </div>

                {bestFor && (
                  <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      Best for
                    </p>
                    <p className="mt-1 text-sm font-semibold text-blue-950">
                      {bestFor}
                    </p>
                  </div>
                )}
              </div>

              {bestOffer && (
                <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl shadow-slate-200/60">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Best available offer
                      </p>

                      <div className="mt-2 flex flex-wrap items-baseline gap-3">
                        <p className="text-4xl font-bold tracking-tight">
                          {bestOffer.price.toLocaleString(
                            undefined,
                            {
                              style: "currency",
                              currency: bestOffer.currency,
                            },
                          )}
                        </p>

                        <span className="text-sm text-slate-400">
                          at {bestOffer.merchant}
                        </span>
                      </div>

                      {bestOffer.is_affiliate && (
                        <p className="mt-2 text-xs text-slate-400">
                          Affiliate link
                        </p>
                      )}
                    </div>

                    <a
                      href={bestOffer.product_url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
                    >
                      {bestOffer.merchant === "Amazon.com"
                        ? "View on Amazon"
                        : "View offer"}
                      <ExternalLink size={17} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <article className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-7 text-white shadow-sm sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
              <ShieldCheck size={22} />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Why Atlasexa recommends it
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              A strong choice for {bestFor?.toLowerCase() ?? "everyday use"}.
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              {product.score_explanation ??
                "This product delivers a strong balance of features, usability and overall value."}
            </p>

            <div className="mt-7 space-y-3">
              {groupedSpecifications
                .slice(0, 3)
                .map((specification) => (
                  <div
                    key={`${specification.group}-${specification.name}-reason`}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      className="mt-0.5 shrink-0 text-emerald-400"
                      size={18}
                    />

                    <p className="text-sm leading-6 text-slate-300">
                      <span className="font-semibold text-white">
                        {specification.name}:
                      </span>{" "}
                      {specification.value}
                    </p>
                  </div>
                ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                Product details
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                Technical specifications
              </h2>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {groupedSpecifications.map((specification) => (
                <div
                  key={`${specification.group}-${specification.name}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-slate-300 hover:bg-white"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {specification.group}
                  </p>

                  <p className="mt-2 font-semibold text-slate-900">
                    {specification.name}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {specification.value}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>

        {product.prices.length > 0 && (
          <section className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Compare retailers
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                  Available offers
                </h2>
              </div>

              <p className="text-sm text-slate-500">
                Prices may change after you leave Atlasexa.
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              {product.prices.map((offer) => (
                <article
                  key={`${offer.merchant}-${offer.product_url}`}
                  className="group flex flex-col gap-5 rounded-2xl border border-slate-200 p-5 transition hover:border-slate-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-sm font-bold text-slate-700">
                      {offer.merchant
                        .replace(".com", "")
                        .slice(0, 1)}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-950">
                          {offer.merchant}
                        </p>

                        {offer.is_affiliate && (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                            Affiliate
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                        {offer.price.toLocaleString(undefined, {
                          style: "currency",
                          currency: offer.currency,
                        })}
                      </p>
                    </div>
                  </div>

                  <a
                    href={offer.product_url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    {offer.merchant === "Amazon.com"
                      ? "View on Amazon"
                      : "View offer"}
                    <ExternalLink size={16} />
                  </a>
                </article>
              ))}
            </div>

            {product.prices.some(
              (offer) => offer.is_affiliate,
            ) && (
              <p className="mt-5 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-500">
                Some links are affiliate links. As an Amazon Associate I earn
                from qualifying purchases.
              </p>
            )}
          </section>
        )}
      </div>
      </main>
    </>
  );
}
