import {
  ArrowLeft,
  ExternalLink,
  GripVertical,
  ImagePlus,
  LoaderCircle,
  Save,
  Star,
  Trash2,
} from "lucide-react";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  deleteAdminProductImage,
  getAdminProduct,
  getAdminToken,
  reorderAdminProductImages,
  setAdminProductPrimaryImage,
  updateAdminProduct,
  updateAdminProductImage,
  uploadAdminProductImages,
  type AdminProductDetail,
  type AdminProductOfferInput,
  type AdminProductSpecificationInput,
} from "@/services/adminApi";

const tabs = [
  "Identity",
  "Content",
  "Specifications",
  "Images",
  "Score",
  "Offers",
  "Publishing",
];

export default function AdminProductEditPage() {
  const navigate = useNavigate();
  const params = useParams();

  const productId = Number(params.id);

  const [product, setProduct] =
    useState<AdminProductDetail | null>(null);

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] =
    useState(false);

  const [draggedImageId, setDraggedImageId] =
    useState<number | null>(null);
  const [error, setError] = useState("");
  const [lastSavedAt, setLastSavedAt] =
    useState<Date | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] =
    useState<"idle" | "saving" | "saved" | "error">("idle");

  const hasHydratedForm = useRef(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] =
    useState("");
  const [modelNumber, setModelNumber] =
    useState("");
  const [releaseYear, setReleaseYear] =
    useState("");
  const [status, setStatus] =
    useState("draft");
  const [score, setScore] = useState("");
  const [
    scoreExplanation,
    setScoreExplanation,
  ] = useState("");

  const [
    specifications,
    setSpecifications,
  ] = useState<
    AdminProductSpecificationInput[]
  >([]);

  const [offers, setOffers] = useState<
    AdminProductOfferInput[]
  >([]);

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminProduct(
        productId,
      );

      setProduct(data);

      setName(data.name);
      setSlug(data.slug);
      setBrand(data.brand);
      setCategory(data.category);
      setDescription(data.description ?? "");
      setModelNumber(data.model_number ?? "");
      setReleaseYear(
        data.release_year
          ? String(data.release_year)
          : "",
      );
      setStatus(data.status);
      setScore(
        data.score !== null
          ? String(data.score)
          : "",
      );
      setScoreExplanation(
        data.score_explanation ?? "",
      );

      setSpecifications(
        data.specifications.map((item) => ({
          name: item.name,
          value: item.value,
          group: item.group,
        })),
      );

      setOffers(
        data.offers.map((offer) => ({
          merchant: offer.merchant,
          price: offer.price,
          currency: offer.currency,
          market: offer.market,
          country_code: offer.country_code,
          is_affiliate: offer.is_affiliate,
          product_url: offer.product_url,
        })),
      );
    } catch (requestError) {
      if (
        requestError instanceof Error &&
        requestError.message === "UNAUTHORIZED"
      ) {
        navigate("/admin/login", {
          replace: true,
        });
        return;
      }

      setError("Unable to load product.");
    } finally {
      setLoading(false);
    }
  }, [navigate, productId]);

  useEffect(() => {
    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadProduct();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadProduct, productId]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!hasHydratedForm.current) {
      hasHydratedForm.current = true;
      return;
    }

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !name.trim() ||
      !slug.trim() ||
      !brand.trim() ||
      !category.trim()
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      async function autoSave() {
        setAutoSaveStatus("saving");

        try {
          const updated = await updateAdminProduct(
            productId,
            {
              name,
              slug,
              brand,
              category,
              description:
                description.trim() || null,
              model_number:
                modelNumber.trim() || null,
              release_year:
                releaseYear
                  ? Number(releaseYear)
                  : null,
              status,
              score:
                score !== ""
                  ? Number(score)
                  : null,
              score_explanation:
                scoreExplanation.trim() || null,
              specifications,
              offers,
            },
          );

          setProduct(updated);
          setLastSavedAt(new Date());
          setAutoSaveStatus("saved");
        } catch (requestError) {
          if (
            requestError instanceof Error &&
            requestError.message === "UNAUTHORIZED"
          ) {
            navigate("/admin/login", {
              replace: true,
            });
            return;
          }

          setAutoSaveStatus("error");
        }
      }

      void autoSave();
    }, 1200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    loading,
    productId,
    name,
    slug,
    brand,
    category,
    description,
    modelNumber,
    releaseYear,
    status,
    score,
    scoreExplanation,
    specifications,
    offers,
    navigate,
  ]);

  if (!getAdminToken()) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  async function saveProduct() {
    setSaving(true);
    setAutoSaveStatus("saving");
    setError("");

    try {
      const updated =
        await updateAdminProduct(
          productId,
          {
            name,
            slug,
            brand,
            category,
            description:
              description.trim() || null,
            model_number:
              modelNumber.trim() || null,
            release_year:
              releaseYear
                ? Number(releaseYear)
                : null,
            status,
            score:
              score !== ""
                ? Number(score)
                : null,
            score_explanation:
              scoreExplanation.trim()
                || null,
            specifications,
            offers,
          },
        );

      setProduct(updated);
      setLastSavedAt(new Date());
      setAutoSaveStatus("saved");
      setLastSavedAt(new Date());
      setAutoSaveStatus("saved");
    } catch (requestError) {
      if (
        requestError instanceof Error &&
        requestError.message ===
          "SLUG_EXISTS"
      ) {
        setError(
          "Another product already uses this slug.",
        );
      } else {
        setError(
          "Unable to save product.",
        );
        setAutoSaveStatus("error");
        setAutoSaveStatus("error");
      }
    } finally {
      setSaving(false);
    }
  }

  async function uploadImages(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(
      event.target.files ?? [],
    );

    if (!files.length) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      await uploadAdminProductImages(
        productId,
        files,
        `${name} product image`,
      );

      await loadProduct();
    } catch {
      setError(
        "Unable to upload images.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function removeImage(
    imageId: number,
  ) {
    await deleteAdminProductImage(
      productId,
      imageId,
    );

    await loadProduct();
  }

  async function makePrimary(
    imageId: number,
  ) {
    await setAdminProductPrimaryImage(
      productId,
      imageId,
    );

    await loadProduct();
  }

  async function moveImage(
    targetImageId: number,
  ) {
    if (
      draggedImageId === null ||
      draggedImageId === targetImageId ||
      !product
    ) {
      setDraggedImageId(null);
      return;
    }

    const images = [...product.images];

    const sourceIndex = images.findIndex(
      (image) =>
        image.id === draggedImageId,
    );

    const targetIndex = images.findIndex(
      (image) =>
        image.id === targetImageId,
    );

    if (
      sourceIndex < 0 ||
      targetIndex < 0
    ) {
      setDraggedImageId(null);
      return;
    }

    const [movedImage] = images.splice(
      sourceIndex,
      1,
    );

    images.splice(
      targetIndex,
      0,
      movedImage,
    );

    setProduct({
      ...product,
      images,
    });

    try {
      const reordered =
        await reorderAdminProductImages(
          productId,
          images,
        );

      setProduct((current) =>
        current
          ? {
              ...current,
              images: reordered,
            }
          : current,
      );
    } catch {
      setError(
        "Unable to reorder images.",
      );

      await loadProduct();
    } finally {
      setDraggedImageId(null);
    }
  }

  async function saveImageAltText(
    imageId: number,
    altText: string,
  ) {
    try {
      const updated =
        await updateAdminProductImage(
          productId,
          imageId,
          altText,
        );

      setProduct((current) =>
        current
          ? {
              ...current,
              images:
                current.images.map(
                  (image) =>
                    image.id === imageId
                      ? updated
                      : image,
                ),
            }
          : current,
      );
    } catch {
      setError(
        "Unable to update image alt text.",
      );
    }
  }

  const quality = (() => {
    const checks = [
      {
        label: "Identity",
        ok: Boolean(
          name.trim() &&
          slug.trim() &&
          brand.trim() &&
          category.trim(),
        ),
      },
      {
        label: "Content",
        ok: description.trim().length >= 120,
      },
      {
        label: "Specifications",
        ok:
          specifications.filter(
            (item) =>
              item.name.trim() &&
              item.value.trim(),
          ).length >= 5,
      },
      {
        label: "Images",
        ok: (product?.images.length ?? 0) >= 4,
      },
      {
        label: "Score",
        ok:
          score !== "" &&
          Number(score) >= 0 &&
          Number(score) <= 100,
      },
      {
        label: "Offers",
        ok:
          offers.filter(
            (offer) =>
              offer.merchant.trim() &&
              offer.product_url.trim() &&
              offer.price > 0,
          ).length >= 1,
      },
    ];

    const completed = checks.filter(
      (check) => check.ok,
    ).length;

    return {
      checks,
      percent: Math.round(
        (completed / checks.length) * 100,
      ),
      complete: completed === checks.length,
    };
  })();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <LoaderCircle
          className="animate-spin text-slate-500"
          size={32}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950"
            >
              <ArrowLeft size={16} />
              Products
            </Link>

            <h1 className="mt-6 text-3xl font-bold text-slate-950">
              {name}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Edit product details, images,
              offers and publication status.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span
                className={
                  autoSaveStatus === "error"
                    ? "font-semibold text-red-600"
                    : autoSaveStatus === "saved"
                      ? "font-semibold text-emerald-600"
                      : "text-slate-500"
                }
              >
                {autoSaveStatus === "saving" &&
                  "Saving changes..."}

                {autoSaveStatus === "saved" &&
                  "All changes saved"}

                {autoSaveStatus === "error" &&
                  "Autosave failed"}

                {autoSaveStatus === "idle" &&
                  "No unsaved changes"}
              </span>

              {lastSavedAt && (
                <span className="text-slate-400">
                  · {lastSavedAt.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {product && (
              <Link
                to={`/products/${product.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
              >
                <ExternalLink size={16} />
                Preview
              </Link>
            )}

            <button
              type="button"
              onClick={() =>
                void saveProduct()
              }
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? (
                <LoaderCircle
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Save size={16} />
              )}

              Save changes
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-4">
            {tabs.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => setTab(index)}
                className={[
                  "w-full rounded-xl px-3 py-3 text-left text-sm font-semibold",
                  tab === index
                    ? "bg-slate-950 text-white"
                    : "text-slate-500 hover:bg-slate-50",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </aside>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            {tab === 0 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Name"
                  value={name}
                  onChange={setName}
                />

                <Field
                  label="Slug"
                  value={slug}
                  onChange={setSlug}
                />

                <Field
                  label="Brand"
                  value={brand}
                  onChange={setBrand}
                />

                <Field
                  label="Category"
                  value={category}
                  onChange={setCategory}
                />

                <Field
                  label="Model number"
                  value={modelNumber}
                  onChange={setModelNumber}
                />

                <Field
                  label="Release year"
                  value={releaseYear}
                  onChange={setReleaseYear}
                  type="number"
                />
              </div>
            )}

            {tab === 1 && (
              <textarea
                rows={12}
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-blue-500"
              />
            )}

            {tab === 2 && (
              <div className="grid gap-4">
                {specifications.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="grid gap-3 rounded-2xl border border-slate-200 p-4 sm:grid-cols-3"
                    >
                      <Field
                        label="Name"
                        value={item.name}
                        onChange={(value) => {
                          const next = [
                            ...specifications,
                          ];
                          next[index] = {
                            ...next[index],
                            name: value,
                          };
                          setSpecifications(next);
                        }}
                      />

                      <Field
                        label="Value"
                        value={item.value}
                        onChange={(value) => {
                          const next = [
                            ...specifications,
                          ];
                          next[index] = {
                            ...next[index],
                            value,
                          };
                          setSpecifications(next);
                        }}
                      />

                      <Field
                        label="Group"
                        value={item.group}
                        onChange={(value) => {
                          const next = [
                            ...specifications,
                          ];
                          next[index] = {
                            ...next[index],
                            group: value,
                          };
                          setSpecifications(next);
                        }}
                      />
                    </div>
                  ),
                )}

                <button
                  type="button"
                  onClick={() =>
                    setSpecifications(
                      (items) => [
                        ...items,
                        {
                          name: "",
                          value: "",
                          group: "General",
                        },
                      ],
                    )
                  }
                  className="w-fit rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold"
                >
                  Add specification
                </button>
              </div>
            )}

            {tab === 3 && (
              <div>
                <label className="flex cursor-pointer items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                  <ImagePlus size={24} />

                  <span className="font-semibold text-slate-700">
                    {uploading
                      ? "Uploading..."
                      : "Upload product images"}
                  </span>

                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) =>
                      void uploadImages(event)
                    }
                    className="hidden"
                  />
                </label>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {product?.images.map(
                    (image) => (
                      <div
                        key={image.id}
                        draggable
                        onDragStart={() =>
                          setDraggedImageId(image.id)
                        }
                        onDragEnd={() =>
                          setDraggedImageId(null)
                        }
                        onDragOver={(event) =>
                          event.preventDefault()
                        }
                        onDrop={() =>
                          void moveImage(image.id)
                        }
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md"
                      >
                        <img
                          src={image.image_url}
                          alt={
                            image.alt_text ?? name
                          }
                          className="aspect-[4/3] w-full object-contain bg-slate-50"
                        />

                        <div className="p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <div className="inline-flex cursor-grab items-center gap-2 text-xs font-semibold text-slate-400">
                              <GripVertical size={15} />
                              Drag to reorder
                            </div>

                            <span className="text-xs text-slate-400">
                              #{image.position + 1}
                            </span>
                          </div>

                          {image.is_primary && (
                            <p className="mb-3 text-xs font-semibold text-emerald-700">
                              Primary image
                            </p>
                          )}

                          <label className="mb-4 grid gap-2">
                            <span className="text-xs font-semibold text-slate-500">
                              SEO alt text
                            </span>

                            <input
                              type="text"
                              defaultValue={image.alt_text ?? ""}
                              onBlur={(event) =>
                                void saveImageAltText(
                                  image.id,
                                  event.target.value,
                                )
                              }
                              className="min-h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
                            />
                          </label>

                          <div className="flex gap-2">
                            {!image.is_primary && (
                              <button
                                type="button"
                                onClick={() =>
                                  void makePrimary(
                                    image.id,
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200"
                              >
                                <Star size={15} />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                void removeImage(
                                  image.id,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {tab === 4 && (
              <div className="grid gap-5">
                <Field
                  label="Score / 100"
                  value={score}
                  onChange={setScore}
                  type="number"
                />

                <textarea
                  rows={6}
                  value={scoreExplanation}
                  onChange={(event) =>
                    setScoreExplanation(
                      event.target.value,
                    )
                  }
                  placeholder="Explain the Atlasexa score..."
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm"
                />
              </div>
            )}

            {tab === 5 && (
              <div className="grid gap-4">
                {offers.map(
                  (offer, index) => (
                    <div
                      key={index}
                      className="grid gap-4 rounded-2xl border border-slate-200 p-4 sm:grid-cols-2"
                    >
                      <Field
                        label="Merchant"
                        value={offer.merchant}
                        onChange={(value) => {
                          const next = [...offers];
                          next[index] = {
                            ...next[index],
                            merchant: value,
                          };
                          setOffers(next);
                        }}
                      />

                      <Field
                        label="Price"
                        value={String(
                          offer.price,
                        )}
                        type="number"
                        onChange={(value) => {
                          const next = [...offers];
                          next[index] = {
                            ...next[index],
                            price: Number(value),
                          };
                          setOffers(next);
                        }}
                      />

                      <Field
                        label="Currency"
                        value={offer.currency}
                        onChange={(value) => {
                          const next = [...offers];
                          next[index] = {
                            ...next[index],
                            currency: value,
                          };
                          setOffers(next);
                        }}
                      />

                      <Field
                        label="URL"
                        value={offer.product_url}
                        onChange={(value) => {
                          const next = [...offers];
                          next[index] = {
                            ...next[index],
                            product_url: value,
                          };
                          setOffers(next);
                        }}
                      />
                    </div>
                  ),
                )}

                <button
                  type="button"
                  onClick={() =>
                    setOffers((items) => [
                      ...items,
                      {
                        merchant: "",
                        price: 0,
                        currency: "USD",
                        market: "US",
                        country_code: "US",
                        is_affiliate: false,
                        product_url: "",
                      },
                    ])
                  }
                  className="w-fit rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold"
                >
                  Add offer
                </button>
              </div>
            )}

            {tab === 6 && (
              <div>
                <div className="mb-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-sm font-bold text-slate-950">
                        Product quality
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Complete the required product information before publication.
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-bold text-slate-950">
                        {quality.percent}%
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        complete
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-slate-950 transition-all"
                      style={{
                        width: `${quality.percent}%`,
                      }}
                    />
                  </div>

                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {quality.checks.map((check) => (
                      <div
                        key={check.label}
                        className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm"
                      >
                        <span className="text-slate-600">
                          {check.label}
                        </span>

                        <span
                          className={
                            check.ok
                              ? "font-semibold text-emerald-600"
                              : "font-semibold text-amber-600"
                          }
                        >
                          {check.ok
                            ? "Complete"
                            : "Missing"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold">
                    Publication status
                  </span>

                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target.value,
                      )
                    }
                    className="min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-4"
                  >
                    <option value="draft">
                      Draft
                    </option>

                    <option
                      value="published"
                      disabled={!quality.complete}
                    >
                      Published
                    </option>

                    <option value="archived">
                      Archived
                    </option>
                  </select>

                  {!quality.complete && (
                    <p className="mt-2 text-xs font-medium text-amber-600">
                      Complete all required sections before publishing.
                    </p>
                  )}
                </label>

                <button
                  type="button"
                  onClick={() =>
                    void saveProduct()
                  }
                  className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
                >
                  Save publication status
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
      />
    </label>
  );
}
