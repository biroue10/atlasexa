import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  ComparisonContext,
  type ComparisonProduct,
} from "@/features/comparison/comparison-context";

export default function ComparisonProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] = useState<ComparisonProduct[]>([]);

  const addProduct = useCallback((product: ComparisonProduct) => {
    setProducts((current) => {
      if (
        current.some((item) => item.slug === product.slug) ||
        current.length >= 4
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
