import {
  Archive,
  Boxes,
  ExternalLink,
  FileEdit,
  ImageOff,
  LayoutDashboard,
  LogOut,
  Menu,
  PackagePlus,
  Search,
  Settings,
  ShoppingCart,
  Tag,
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

import {
  clearAdminToken,
  getAdminDashboard,
  getAdminToken,
  getCurrentAdmin,
  type AdminDashboard,
  type AdminUser,
} from "@/services/adminApi";

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [admin, setAdmin] =
    useState<AdminUser | null>(null);

  const [dashboard, setDashboard] =
    useState<AdminDashboard | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [adminData, dashboardData] =
          await Promise.all([
            getCurrentAdmin(),
            getAdminDashboard(),
          ]);

        if (!cancelled) {
          setAdmin(adminData);
          setDashboard(dashboardData);
        }
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        if (
          requestError instanceof Error &&
          requestError.message === "UNAUTHORIZED"
        ) {
          clearAdminToken();
          navigate("/admin/login", {
            replace: true,
          });
          return;
        }

        setError(
          "Unable to load the administration dashboard.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (!getAdminToken()) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  function logout() {
    clearAdminToken();

    navigate(
      "/admin/login",
      { replace: true },
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col bg-slate-950 p-5 text-white lg:flex">
          <Link
            to="/admin"
            className="flex items-center gap-3 px-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-slate-950">
              A
            </div>

            <div>
              <p className="font-bold">
                Atlasexa
              </p>

              <p className="text-xs text-slate-500">
                Administration
              </p>
            </div>
          </Link>

          <nav className="mt-10 grid gap-1">
            <Link
              to="/admin"
              className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3 text-sm font-semibold"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              to="/admin/products"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <Boxes size={18} />
              Products
            </Link>

            <span className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500">
              <ShoppingCart size={18} />
              Offers
            </span>

            <span className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500">
              <Search size={18} />
              SEO
            </span>

            <span className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500">
              <Settings size={18} />
              Settings
            </span>
          </nav>

          <div className="mt-auto">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <ExternalLink size={17} />
              View Atlasexa
            </a>

            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={17} />
              Sign out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="border-b border-slate-200 bg-white">
            <div className="flex min-h-16 items-center justify-between px-5 sm:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 lg:hidden"
                  aria-label="Open navigation"
                >
                  <Menu size={19} />
                </button>

                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    Dashboard
                  </p>

                  <p className="hidden text-xs text-slate-400 sm:block">
                    Atlasexa administration
                  </p>
                </div>
              </div>

              {admin && (
                <div className="flex items-center gap-3">
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold text-slate-800">
                      {admin.name}
                    </p>

                    <p className="text-xs capitalize text-slate-400">
                      {admin.role}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                    {admin.name
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </header>

          <div className="p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Overview
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  Catalog dashboard
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Monitor and manage the Atlasexa
                  product catalog.
                </p>
              </div>

              <Link
                to="/admin/products/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <PackagePlus size={17} />
                Add product
              </Link>
            </div>

            {isLoading && (
              <div className="mt-8 rounded-2xl bg-white p-8 text-sm text-slate-500">
                Loading dashboard...
              </div>
            )}

            {error && (
              <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                {error}
              </div>
            )}

            {dashboard && (
              <>
                <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <MetricCard
                    icon={<Boxes size={20} />}
                    label="Total products"
                    value={dashboard.total_products}
                  />

                  <MetricCard
                    icon={<Tag size={20} />}
                    label="Published"
                    value={dashboard.published_products}
                  />

                  <MetricCard
                    icon={<FileEdit size={20} />}
                    label="Drafts"
                    value={dashboard.draft_products}
                  />

                  <MetricCard
                    icon={<Archive size={20} />}
                    label="Archived"
                    value={dashboard.archived_products}
                  />

                  <MetricCard
                    icon={<ImageOff size={20} />}
                    label="Missing images"
                    value={dashboard.missing_images}
                    attention={
                      dashboard.missing_images > 0
                    }
                  />

                  <MetricCard
                    icon={<ShoppingCart size={20} />}
                    label="Missing offers"
                    value={dashboard.missing_offers}
                    attention={
                      dashboard.missing_offers > 0
                    }
                  />
                </section>

                <section className="mt-8 grid gap-5 lg:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
                      Quick actions
                    </p>

                    <h2 className="mt-2 text-xl font-bold text-slate-950">
                      Manage your catalog
                    </h2>

                    <div className="mt-5 grid gap-3">
                      <Link
                        to="/admin/products/new"
                        className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <PackagePlus
                            size={18}
                            className="text-blue-600"
                          />

                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              Add a product
                            </p>

                            <p className="text-xs text-slate-500">
                              Create a new product draft.
                            </p>
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/admin/products"
                        className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <Boxes
                            size={18}
                            className="text-blue-600"
                          />

                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              Manage products
                            </p>

                            <p className="text-xs text-slate-500">
                              Edit existing catalog entries.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Catalog health
                    </p>

                    <h2 className="mt-2 text-xl font-bold">
                      Products needing attention
                    </h2>

                    <div className="mt-6 grid gap-3">
                      <HealthRow
                        label="Missing product images"
                        value={dashboard.missing_images}
                      />

                      <HealthRow
                        label="Missing merchant offers"
                        value={dashboard.missing_offers}
                      />

                      <HealthRow
                        label="Products in draft"
                        value={dashboard.draft_products}
                      />
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  attention = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  attention?: boolean;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={[
            "flex h-10 w-10 items-center justify-center rounded-xl",
            attention
              ? "bg-amber-50 text-amber-700"
              : "bg-slate-100 text-slate-600",
          ].join(" ")}
        >
          {icon}
        </div>
      </div>

      <p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {label}
      </p>
    </article>
  );
}

function HealthRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4">
      <span className="text-sm text-slate-300">
        {label}
      </span>

      <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold">
        {value}
      </span>
    </div>
  );
}
