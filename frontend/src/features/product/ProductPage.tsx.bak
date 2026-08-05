import { ArrowLeft, ExternalLink, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getProduct,
  type ProductDetail,
} from "@/services/productApi";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const productSlug = slug ?? "";

  const [product, setProduct] = useState<ProductDetail | null>(null);
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
