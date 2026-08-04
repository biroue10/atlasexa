import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "@/features/home/HomePage";
import ProductPage from "@/features/product/ProductPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:slug" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}
