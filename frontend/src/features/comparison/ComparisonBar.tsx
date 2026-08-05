import { GitCompareArrows, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";

import { useComparison } from "@/features/comparison/useComparison";

export default function ComparisonBar() {
  const {
    products,
    removeProduct,
    clearProducts,
  } = useComparison();

  if (products.length === 0) {
    return null;
  }

  return (
    <aside className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-2xl backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 font-medium text-slate-900">
            <GitCompareArrows size={20} />
            Compare products
          </div>

          {products.map((product) => (
            <div
              key={product.slug}
              className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700"
            >
              <span>{product.name}</span>

              <button
                type="button"
                onClick={() => removeProduct(product.slug)}
                aria-label={`Remove ${product.name} from comparison`}
                className="rounded-full p-1 hover:bg-slate-200"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          <span className="text-sm text-slate-500">
            {products.length}/4 selected
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={clearProducts}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            <Trash2 size={16} />
            Clear
          </button>

          <Link
            to="/compare"
            aria-disabled={products.length < 2}
            className={`rounded-xl px-5 py-3 text-sm font-medium text-white ${
              products.length >= 2
                ? "bg-slate-900 hover:bg-slate-800"
                : "pointer-events-none bg-slate-400"
            }`}
          >
            Compare now
          </Link>
        </div>
      </div>
    </aside>
  );
}
