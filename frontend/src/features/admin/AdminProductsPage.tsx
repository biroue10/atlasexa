import {
  ArrowLeft,
  Edit3,
  ExternalLink,
  Image as ImageIcon,
  LoaderCircle,
  PackagePlus,
  Search,
  ShoppingCart,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import ProductImage from "@/components/product/ProductImage";
import {
  clearAdminToken,
  getAdminProducts,
  getAdminToken,
  type AdminProductListItem,
} from "@/services/adminApi";

export default function AdminProductsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<
    AdminProductListItem[]
  >([]);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const timeout = window.setTimeout(
      async () => {
        setIsLoading(true);
        setError("");

        try {
          const data = await getAdminProducts(
            query,
            status,
          );

          setProducts(data.items);
        } catch (requestError) {
          if (
            requestError instanceof Error &&
            requestError.message ===
              "UNAUTHORIZED"
          ) {
            clearAdminToken();
            navigate("/admin/login", {
              replace: true,
            });
            return;
          }

          setError(
            "Unable to load products.",
          );
        } finally {
          setIsLoading(false);
        }
      },
      250,
    );

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [navigate, query, status]);

  if (!getAdminToken()) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
              Catalog
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Products
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage products, publication status,
              images and offers.
            </p>
          </div>

          <Link
            to="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <PackagePlus size={17} />
            Add product
          </Link>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <label className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search product, brand or slug..."
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            >
              <option value="">
                All statuses
              </option>

              <option value="published">
                Published
              </option>

              <option value="draft">
                Draft
              </option>

              <option value="archived">
                Archived
              </option>
            </select>
          </div>
        </section>

        {isLoading && (
          <div className="mt-8 flex min-h-64 items-center justify-center">
            <LoaderCircle
              size={30}
              className="animate-spin text-slate-500"
            />
          </div>
        )}

        {error && !isLoading && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {!isLoading &&
          !error &&
          products.length === 0 && (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center">
              <p className="font-semibold text-slate-900">
                No products found.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Try changing the current filters.
              </p>
            </div>
          )}

        {!isLoading &&
          !error &&
          products.length > 0 && (
            <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Product
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Category
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Score
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Images
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Offers
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Price
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            <ProductImage
                              src={product.image_url}
                              alt={product.name}
                              className="h-14 w-16 rounded-xl border border-slate-100 bg-slate-50"
                            />

                            <div>
                              <p className="font-semibold text-slate-950">
                                {product.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {product.brand}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {product.category}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                            {product.score !== null
                              ? `${product.score}/100`
                              : "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                            <ImageIcon size={15} />
                            {product.image_count}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                            <ShoppingCart size={15} />
                            {product.offer_count}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                          {product.minimum_price !== null &&
                          product.currency
                            ? product.minimum_price.toLocaleString(
                                "en-US",
                                {
                                  style: "currency",
                                  currency:
                                    product.currency,
                                },
                              )
                            : "—"}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={product.status}
                          />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/products/${product.id}`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                              aria-label={`Edit ${product.name}`}
                            >
                              <Edit3 size={15} />
                            </Link>

                            <Link
                              to={`/products/${product.slug}`}
                              target="_blank"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                              aria-label={`Preview ${product.name}`}
                            >
                              <ExternalLink size={15} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-500">
                {products.length} products
              </div>
            </section>
          )}
      </div>
    </main>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles =
    status === "published"
      ? "bg-emerald-50 text-emerald-700"
      : status === "draft"
        ? "bg-amber-50 text-amber-700"
        : "bg-slate-100 text-slate-600";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles}`}
    >
      {status}
    </span>
  );
}
