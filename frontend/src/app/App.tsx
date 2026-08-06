import { BrowserRouter, Route, Routes } from "react-router-dom";

import ComparisonProvider from "@/features/comparison/ComparisonProvider";
import HomePage from "@/features/home/HomePage";
import ProductPage from "@/features/product/ProductPage";
import ProductCatalogPage from "@/features/product/ProductCatalogPage";
import ComparisonBar from "@/features/comparison/ComparisonBar";
import ComparisonPage from "@/features/comparison/ComparisonPage";
export default function App() {
  return (
    <ComparisonProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductCatalogPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
        </Routes>
        <ComparisonBar />
      </BrowserRouter>
    </ComparisonProvider>
  );
}
