import { createContext } from "react";

export interface ComparisonProduct {
  name: string;
  slug: string;
  price: number;
  currency: string;
  score: number;
  reason: string;
}

export interface ComparisonContextValue {
  products: ComparisonProduct[];
  addProduct: (product: ComparisonProduct) => void;
  removeProduct: (slug: string) => void;
  isSelected: (slug: string) => boolean;
  clearProducts: () => void;
}

export const ComparisonContext =
  createContext<ComparisonContextValue | null>(null);
