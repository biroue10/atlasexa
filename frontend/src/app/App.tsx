import { BrowserRouter, Route, Routes } from "react-router-dom";

import ComparisonProvider from "@/features/comparison/ComparisonProvider";
import HomePage from "@/features/home/HomePage";
import ProductPage from "@/features/product/ProductPage";

export default function App() {
  return (
    <ComparisonProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
        </Routes>
      </BrowserRouter>
    </ComparisonProvider>
  );
}
