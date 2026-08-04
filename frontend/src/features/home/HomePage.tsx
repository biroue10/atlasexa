import { Search } from "lucide-react";

const suggestions = [
  "💻 Laptop",
  "🎧 Headphones",
  "⌚ Smartwatch",
  "📱 Smartphone",
  "🖥 Monitor",
  "📷 Camera",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white px-6">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center text-center">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm">
            A
          </div>

          <h1 className="text-6xl font-bold tracking-tight text-slate-900 md:text-7xl">
            Atlasexa
          </h1>
        </div>

        <p className="text-2xl text-slate-700 md:text-3xl">
          Find the best product with AI.
        </p>

        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 md:text-lg">
          Tell Atlasexa what you need. We’ll compare, explain and recommend.
        </p>

        <div className="mt-12 w-full max-w-4xl">
          <div className="relative transition duration-200 focus-within:scale-[1.01]">
            <Search
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              size={22}
            />

            <input
              type="text"
              placeholder="What are you looking for today?"
              className="w-full rounded-2xl border border-slate-300 bg-white py-5 pl-14 pr-5 text-lg text-slate-900 shadow-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <button
            className="mt-8 rounded-xl bg-slate-900 px-10 py-4 text-lg font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Find Products
          </button>
        </div>

        <div className="mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
          {suggestions.map((item) => (
            <button
              key={item}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              {item}
            </button>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-6 text-slate-500">
          Trusted recommendations based on specifications, real reviews and AI
          analysis.
        </p>
      </div>
    </main>
  );
}
