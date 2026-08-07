import { BrowserRouter, Route, Routes } from "react-router-dom";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import ComparisonBar from "@/features/comparison/ComparisonBar";
import ComparisonPage from "@/features/comparison/ComparisonPage";
import ComparisonProvider from "@/features/comparison/ComparisonProvider";
import HomePage from "@/features/home/HomePage";
import ProductCatalogPage from "@/features/product/ProductCatalogPage";
import ProductPage from "@/features/product/ProductPage";

export default function App() {
  return (
    <ComparisonProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />

          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/products"
                element={<ProductCatalogPage />}
              />
              <Route
                path="/products/:slug"
                element={<ProductPage />}
              />
              <Route path="/compare" element={<ComparisonPage />} />
            </Routes>
          </div>

          <SiteFooter />
        </div>

        <ComparisonBar />
      </BrowserRouter>
    </ComparisonProvider>
  );
}
