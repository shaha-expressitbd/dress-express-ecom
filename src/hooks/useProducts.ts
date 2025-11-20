import { useGetProductsQuery } from "@/lib/api/publicApi";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";

export const useProducts = () => {
  // Initialize state with proper types
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  // Fetch products using the query hook
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useGetProductsQuery({
    limit: 1000, // Adjust based on your needs
  });

  useEffect(() => {
    if (!isLoading && data) {
      // Ensure data is an array of Product objects
      setAllProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    }

    if (isError) {
      setError(queryError);
      setLoading(false);
    }
  }, [data, isLoading, isError, queryError]);

  return {
    products: allProducts,
    loading,
    error,
  };
};
