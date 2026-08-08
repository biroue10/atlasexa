import {
  ArrowLeft,
  ArrowRight,
  Check,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import {
  type FormEvent,
  useMemo,
  useState,
} from "react";
import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  createAdminProduct,
  getAdminToken,
  type AdminProductOfferInput,
  type AdminProductSpecificationInput,
} from "@/services/adminApi";

const steps = [
  "Identity",
  "Content",
  "Specifications",
  "Score",
  "Offers",
  "Review",
];

export default function AdminProductCreatePage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [score, setScore] = useState("");
  const [scoreExplanation, setScoreExplanation] =
    useState("");

  const [
    specifications,
    setSpecifications,
  ] = useState<AdminProductSpecificationInput[]>([]);

  const [offers, setOffers] =
    useState<AdminProductOfferInput[]>([]);

  const canContinue = useMemo(() => {
    if (step === 0) {
      return Boolean(
        name.trim() &&
          brand.trim() &&
          category.trim() &&
          slug.trim(),
      );
    }

    return true;
  }, [
    brand,
    category,
    name,
    slug,
    step,
  ]);

  if (!getAdminToken()) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  function autoSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function addSpecification() {
    setSpecifications((items) => [
      ...items,
      {
        name: "",
        value: "",
        group: "General",
      },
    ]);
  }

  function addOffer() {
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
    ]);
  }

  async function saveDraft(
    event?: FormEvent,
  ) {
    event?.preventDefault();

    setError("");
    setIsSaving(true);

    try {
      const result = await createAdminProduct({
        name,
        brand,
        category,
        slug,
        description:
          description.trim() || null,
        model_number:
          modelNumber.trim() || null,
        release_year:
          releaseYear
            ? Number(releaseYear)
            : null,
        status: "draft",
        score:
          score !== ""
            ? Number(score)
            : null,
        score_explanation:
          scoreExplanation.trim() || null,
        specifications:
          specifications.filter(
            (item) =>
              item.name.trim() &&
              item.value.trim(),
          ),
        offers:
          offers.filter(
            (offer) =>
              offer.merchant.trim() &&
              offer.product_url.trim(),
          ),
      });

      navigate(
        `/admin/products/${result.id}`,
        { replace: true },
      );
    } catch (requestError) {
      if (
        requestError instanceof Error &&
        requestError.message ===
          "SLUG_EXISTS"
      ) {
        setError(
          "A product with this slug already exists.",
        );
      } else {
        setError(
          "Unable to create the product.",
        );
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950"
            >
              <ArrowLeft size={16} />
              Products
            </Link>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
              New product
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Create product
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Build a complete product entry and save it as a draft.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void saveDraft()}
            disabled={
              isSaving ||
              !name ||
              !brand ||
              !category ||
              !slug
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSaving ? (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            ) : (
              <Save size={17} />
            )}

            Save draft
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-1">
              {steps.map(
                (stepName, index) => (
                  <button
                    key={stepName}
                    type="button"
                    onClick={() =>
                      setStep(index)
                    }
                    className={[
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold",
                      index === step
                        ? "bg-slate-950 text-white"
                        : "text-slate-500 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs">
                      {index < step ? (
                        <Check size={13} />
                      ) : (
                        index + 1
                      )}
                    </span>

                    {stepName}
                  </button>
                ),
              )}
            </div>
          </aside>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {step === 0 && (
              <div className="grid gap-5">
                <SectionTitle
                  title="Identity"
                  description="Core information used throughout Atlasexa."
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Product name"
                    value={name}
                    onChange={(value) => {
                      setName(value);

                      if (!slug) {
                        setSlug(
                          autoSlug(value),
                        );
                      }
                    }}
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
                    label="Slug"
                    value={slug}
                    onChange={(value) =>
                      setSlug(
                        autoSlug(value),
                      )
                    }
                  />

                  <Field
                    label="Model number"
                    value={modelNumber}
                    onChange={setModelNumber}
                  />

                  <Field
                    label="Release year"
                    type="number"
                    value={releaseYear}
                    onChange={setReleaseYear}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <SectionTitle
                  title="Content"
                  description="Editorial content shown on the product page."
                />

                <label className="mt-6 grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Description
                  </span>

                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value,
                      )
                    }
                    rows={8}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />
                </label>
              </div>
            )}

            {step === 2 && (
              <div>
                <SectionTitle
                  title="Specifications"
                  description="Add structured specs for comparison."
                />

                <div className="mt-6 grid gap-4">
                  {specifications.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="grid gap-3 rounded-2xl border border-slate-200 p-4 sm:grid-cols-[1fr_1.2fr_1fr_auto]"
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

                            setSpecifications(
                              next,
                            );
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

                            setSpecifications(
                              next,
                            );
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

                            setSpecifications(
                              next,
                            );
                          }}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setSpecifications(
                              (items) =>
                                items.filter(
                                  (_, i) =>
                                    i !== index,
                                ),
                            )
                          }
                          className="mt-7 flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ),
                  )}

                  <button
                    type="button"
                    onClick={addSpecification}
                    className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    <Plus size={16} />
                    Add specification
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <SectionTitle
                  title="Score"
                  description="Optional Atlasexa score and editorial explanation."
                />

                <div className="mt-6 grid gap-5">
                  <Field
                    label="Score / 100"
                    type="number"
                    value={score}
                    onChange={setScore}
                  />

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Score explanation
                    </span>

                    <textarea
                      value={scoreExplanation}
                      onChange={(event) =>
                        setScoreExplanation(
                          event.target.value,
                        )
                      }
                      rows={5}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                    />
                  </label>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <SectionTitle
                  title="Offers"
                  description="Add merchant and affiliate offers."
                />

                <div className="mt-6 grid gap-4">
                  {offers.map(
                    (offer, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <Field
                            label="Merchant"
                            value={offer.merchant}
                            onChange={(value) => {
                              const next = [
                                ...offers,
                              ];

                              next[index] = {
                                ...next[index],
                                merchant: value,
                              };

                              setOffers(next);
                            }}
                          />

                          <Field
                            label="Price"
                            type="number"
                            value={String(
                              offer.price,
                            )}
                            onChange={(value) => {
                              const next = [
                                ...offers,
                              ];

                              next[index] = {
                                ...next[index],
                                price:
                                  Number(value),
                              };

                              setOffers(next);
                            }}
                          />

                          <Field
                            label="Currency"
                            value={offer.currency}
                            onChange={(value) => {
                              const next = [
                                ...offers,
                              ];

                              next[index] = {
                                ...next[index],
                                currency: value,
                              };

                              setOffers(next);
                            }}
                          />

                          <Field
                            label="Market"
                            value={offer.market}
                            onChange={(value) => {
                              const next = [
                                ...offers,
                              ];

                              next[index] = {
                                ...next[index],
                                market: value,
                              };

                              setOffers(next);
                            }}
                          />

                          <Field
                            label="Country"
                            value={
                              offer.country_code
                            }
                            onChange={(value) => {
                              const next = [
                                ...offers,
                              ];

                              next[index] = {
                                ...next[index],
                                country_code:
                                  value,
                              };

                              setOffers(next);
                            }}
                          />

                          <label className="grid gap-2">
                            <span className="text-sm font-semibold text-slate-700">
                              Affiliate
                            </span>

                            <input
                              type="checkbox"
                              checked={
                                offer.is_affiliate
                              }
                              onChange={(event) => {
                                const next = [
                                  ...offers,
                                ];

                                next[index] = {
                                  ...next[index],
                                  is_affiliate:
                                    event.target
                                      .checked,
                                };

                                setOffers(next);
                              }}
                              className="h-5 w-5"
                            />
                          </label>
                        </div>

                        <div className="mt-4">
                          <Field
                            label="Product URL"
                            value={
                              offer.product_url
                            }
                            onChange={(value) => {
                              const next = [
                                ...offers,
                              ];

                              next[index] = {
                                ...next[index],
                                product_url:
                                  value,
                              };

                              setOffers(next);
                            }}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setOffers(
                              (items) =>
                                items.filter(
                                  (_, i) =>
                                    i !== index,
                                ),
                            )
                          }
                          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600"
                        >
                          <Trash2 size={15} />
                          Remove offer
                        </button>
                      </div>
                    ),
                  )}

                  <button
                    type="button"
                    onClick={addOffer}
                    className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    <Plus size={16} />
                    Add offer
                  </button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <SectionTitle
                  title="Review"
                  description="Review the product before saving the draft."
                />

                <div className="mt-6 grid gap-4 rounded-2xl bg-slate-50 p-5 text-sm">
                  <ReviewRow
                    label="Name"
                    value={name || "—"}
                  />

                  <ReviewRow
                    label="Brand"
                    value={brand || "—"}
                  />

                  <ReviewRow
                    label="Category"
                    value={category || "—"}
                  />

                  <ReviewRow
                    label="Slug"
                    value={slug || "—"}
                  />

                  <ReviewRow
                    label="Specifications"
                    value={String(
                      specifications.filter(
                        (item) =>
                          item.name &&
                          item.value,
                      ).length,
                    )}
                  />

                  <ReviewRow
                    label="Offers"
                    value={String(
                      offers.filter(
                        (offer) =>
                          offer.merchant &&
                          offer.product_url,
                      ).length,
                    )}
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    void saveDraft()
                  }
                  disabled={
                    isSaving ||
                    !canContinue
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isSaving ? (
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={17} />
                  )}

                  Create draft
                </button>
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-8 flex justify-between border-t border-slate-200 pt-6">
              <button
                type="button"
                disabled={step === 0}
                onClick={() =>
                  setStep(
                    (current) =>
                      Math.max(
                        0,
                        current - 1,
                      ),
                  )
                }
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 disabled:opacity-40"
              >
                Previous
              </button>

              {step < steps.length - 1 && (
                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={() =>
                    setStep(
                      (current) =>
                        current + 1,
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
                >
                  Continue
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
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
        className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
      />
    </label>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-950">
        {title}
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}
