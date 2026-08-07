import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import {
  type FormEvent,
  useEffect,
  useState,
} from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  getAdminToken,
  loginAdmin,
} from "@/services/adminApi";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] =
    useState(false);

  useEffect(() => {
    document.title = "Admin Login | Atlasexa";
  }, []);

  if (getAdminToken()) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsLoading(true);
    setError("");

    try {
      await loginAdmin(email, password);
      navigate("/admin", { replace: true });
    } catch {
      setError(
        "The email or password you entered is incorrect.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden border-r border-white/10 p-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg font-bold text-slate-950">
                A
              </div>

              <span className="text-2xl font-bold tracking-tight text-white">
                Atlasexa
              </span>
            </div>
          </div>

          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-300">
              <ShieldCheck size={14} />
              Private administration
            </div>

            <h1 className="mt-6 text-5xl font-bold tracking-tight text-white">
              Manage Atlasexa from one place.
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              Products, images, specifications, offers,
              SEO and publishing will all be managed from
              this workspace.
            </p>
          </div>

          <p className="text-xs text-slate-600">
            Authorized access only.
          </p>
        </section>

        <section className="flex items-center justify-center bg-white px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="lg:hidden">
              <div className="inline-flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 font-bold text-white">
                  A
                </div>

                <span className="text-xl font-bold tracking-tight text-slate-950">
                  Atlasexa
                </span>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <LockKeyhole size={21} />
              </div>

              <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to the Atlasexa administration
                workspace.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 grid gap-5"
            >
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Email
                </span>

                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  className="min-h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Password
                </span>

                <div className="relative">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 text-slate-950 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current,
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </label>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-slate-400">
              Atlasexa administration · Secure access
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
