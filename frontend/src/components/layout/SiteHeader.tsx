import {
  ArrowRight,
  GitCompareArrows,
  Menu,
  Search,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function navClass({ isActive }: { isActive: boolean }) {
  return [
    "rounded-xl px-3 py-2 text-sm font-semibold transition",
    isActive
      ? "bg-slate-100 text-slate-950"
      : "text-slate-500 hover:bg-slate-50 hover:text-slate-950",
  ].join(" ");
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="flex items-center gap-2.5"
          aria-label="Atlasexa home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 font-bold text-white shadow-sm">
            A
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-950">
            Atlasexa
          </span>
        </NavLink>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={navClass}>
            Products
          </NavLink>

          <NavLink to="/compare" className={navClass}>
            Compare
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <NavLink
            to="/products"
            className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 sm:inline-flex"
          >
            <Search size={16} />
            Find products
          </NavLink>

          <NavLink
            to="/compare"
            className="hidden items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 lg:inline-flex"
          >
            Compare
            <ArrowRight size={16} />
          </NavLink>

          <NavLink
            to="/products"
            aria-label="Browse products"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 md:hidden"
          >
            <Menu size={20} />
          </NavLink>
        </div>
      </div>

      <div className="border-t border-slate-100 md:hidden">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-center gap-1 px-4 py-2"
          aria-label="Mobile navigation"
        >
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={navClass}>
            Products
          </NavLink>

          <NavLink
            to="/compare"
            className={({ isActive }) =>
              `${navClass({ isActive })} inline-flex items-center gap-1.5`
            }
          >
            <GitCompareArrows size={15} />
            Compare
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
