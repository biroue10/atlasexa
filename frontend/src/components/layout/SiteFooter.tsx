import {
  ArrowRight,
  GitCompareArrows,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3"
              aria-label="Atlasexa home"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-slate-950">
                A
              </div>

              <span className="text-2xl font-bold tracking-tight">
                Atlasexa
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              Product discovery and comparison built to help you understand
              what to buy, why it fits your needs and where to find it.
            </p>

            <div className="mt-6 inline-flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <ShieldCheck
                className="mt-0.5 shrink-0 text-emerald-400"
                size={18}
              />

              <p className="max-w-md text-xs leading-5 text-slate-400">
                Atlasexa may earn commissions from qualifying purchases.
                As an Amazon Associate I earn from qualifying purchases.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Explore
            </p>

            <div className="mt-5 grid gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
              >
                <Search size={15} />
                Browse products
              </Link>

              <Link
                to="/compare"
                className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
              >
                <GitCompareArrows size={15} />
                Compare products
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Categories
            </p>

            <div className="mt-5 grid gap-3 text-sm">
              <Link
                to="/products?category=Laptops&page=1"
                className="text-slate-300 transition hover:text-white"
              >
                Laptops
              </Link>

              <Link
                to="/products?category=Smartphones&page=1"
                className="text-slate-300 transition hover:text-white"
              >
                Smartphones
              </Link>

              <Link
                to="/products?category=Headphones&page=1"
                className="text-slate-300 transition hover:text-white"
              >
                Headphones
              </Link>

              <Link
                to="/products?page=1"
                className="inline-flex items-center gap-1.5 font-semibold text-white"
              >
                View all
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Atlasexa. All rights reserved.
          </p>

          <p>
            Prices and availability may change after leaving Atlasexa.
          </p>
        </div>
      </div>
    </footer>
  );
}
