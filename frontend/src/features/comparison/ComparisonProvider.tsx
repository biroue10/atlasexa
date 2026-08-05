import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  ComparisonContext,
  type ComparisonProduct,
} from "@/features/comparison/comparison-context";

const STORAGE_KEY = "atlasexa-comparison-products";
const MAX_PRODUCTS = 4;

function loadStoredProducts(): ComparisonProduct[] {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.slice(0, MAX_PRODUCTS) as ComparisonProduct[];
  } catch {
    return [];
  }
}

export default function ComparisonProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] =
    useState<ComparisonProduct[]>(loadStoredProducts);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = useCallback((product: ComparisonProduct) => {
    setProducts((current) => {
      if (
        current.some((item) => item.slug === product.slug) ||
        current.length >= MAX_PRODUCTS
      ) {
        return current;
      }

      return [...current, product];
    });
  }, []);

  const removeProduct = useCallback((slug: string) => {
    setProducts((current) =>
      current.filter((product) => product.slug !== slug),
    );
  }, []);

  const clearProducts = useCallback(() => {
    setProducts([]);
  }, []);

  const isSelected = useCallback(
    (slug: string) =>
      products.some((product) => product.slug === slug),
    [products],
  );

  const value = useMemo(
    () => ({
      products,
      addProduct,
      removeProduct,
      isSelected,
      clearProducts,
    }),
    [
      products,
      addProduct,
      removeProduct,
      isSelected,
      clearProducts,
    ],
  );

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
}
