import { ArrowLeft, ExternalLink, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ProductImage from "@/components/product/ProductImage";
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

  if (!productSlug) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6">
        <p className="text-lg text-red-600">Invalid product.</p>

        <Link className="text-blue-600 hover:underline" to="/">
          Return home
        </Link>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="animate-spin text-slate-600" size={32} />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6">
        <p className="text-lg text-red-600">
          {error || "Product not found."}
        </p>

        <Link className="text-blue-600 hover:underline" to="/">
          Return home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Back to search
        </Link>

        <section className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <div className="grid gap-8 md:grid-cols-[320px_1fr] md:items-center">
            <div>
              <ProductImage
                src={selectedImage ?? product.image_url}
                alt={product.name}
                className="aspect-square rounded-2xl border border-slate-200"
              />

              {product.images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {product.images.map((image) => {
                    const isSelected =
                      image.image_url === selectedImage;

                    return (
                      <button
                        key={image.image_url}
                        type="button"
                        onClick={() => setSelectedImage(image.image_url)}
                        aria-label={`View ${image.alt_text ?? product.name}`}
                        aria-pressed={isSelected}
                        className={`overflow-hidden rounded-xl border-2 bg-white p-1 transition ${
                          isSelected
                            ? "border-blue-600"
                            : "border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        <ProductImage
                          src={image.image_url}
                          alt={image.alt_text ?? product.name}
                          className="aspect-square rounded-lg"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                  {product.brand}
                </span>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                  {product.category}
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-bold text-slate-900">
                {product.name}
              </h1>

              <p className="mt-5 max-w-3xl leading-7 text-slate-600">
                {product.description ?? "No product description available."}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              Atlasexa score
            </p>

            <div className="mt-3 flex flex-wrap items-end gap-4">
              <p className="text-5xl font-bold text-emerald-800">
                {product.score}
              </p>

              <p className="pb-1 text-lg font-medium text-emerald-700">
                /100
              </p>
            </div>

            {product.score_explanation && (
              <p className="mt-4 max-w-3xl leading-7 text-emerald-900">
                {product.score_explanation}
              </p>
            )}
          </div>
          <h2 className="mt-10 text-2xl font-semibold text-slate-900">
            Technical specifications
          </h2>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            {product.specifications.map((specification) => (
              <div
                key={`${specification.group}-${specification.name}`}
                className="grid grid-cols-1 gap-2 border-b border-slate-200 px-5 py-4 last:border-b-0 sm:grid-cols-3"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {specification.group}
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {specification.name}
                  </p>
                </div>

                <p className="text-slate-600 sm:col-span-2 sm:self-center">
                  {specification.value}
                </p>
              </div>
            ))}
          </div>
          <h2 className="mt-10 text-2xl font-semibold text-slate-900">
            Available offers
          </h2>

          <div className="mt-5 grid gap-4">
            {product.prices.map((offer) => (
              <article
                key={`${offer.merchant}-${offer.product_url}`}
                className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-slate-200 p-5"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {offer.merchant}
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {offer.price.toLocaleString(undefined, {
                      style: "currency",
                      currency: offer.currency,
                    })}
                  </p>
                </div>

                <a
                  href={offer.product_url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800"
                >
                  View offer
                  <ExternalLink size={17} />
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
