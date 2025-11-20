"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Product } from "@/types/product";
import { useParams, useRouter } from "next/navigation";
import ConditionTabBar from "./ConditionTabBar";
import ProductGrid from "./ProductGrid";
import { useGetProductsQuery } from "@/lib/api/publicApi";
import ProductGridSkeleton from "@/components/skeleton/ProductGridSkeleton";

const productConditionOptions = [
  { value: "best", label: "Best" },
  { value: "best selling", label: "Best Selling" },
  { value: "exclusive", label: "Exclusive" },
  { value: "featured", label: "Featured" },
  { value: "hot", label: "Hot" },
  { value: "latest", label: "Latest" },
  { value: "limited", label: "Limited" },
  { value: "luxury", label: "Luxury" },
  { value: "new", label: "New" },
  { value: "new arrival", label: "New Arrival" },
  { value: "popular", label: "Popular" },
  { value: "pre order", label: "Pre Order" },
  { value: "sale", label: "Sale" },
  { value: "top", label: "Top" },
  { value: "trending", label: "Trending" },
  { value: "upcoming", label: "Upcoming" },
];

export default function ConditionProducts() {
  const router = useRouter();
  const params = useParams();
  const initialSearch = (params?.condition as string) || "all";
  const [selected, setSelected] = useState<string>(initialSearch);

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const observerRef = useRef<HTMLDivElement>(null);

  // Page 1: Initial load
  const {
    data: currentProducts,
    isLoading: isInitialLoading,
    error: initialError,
  } = useGetProductsQuery({
    search: selected,
    page: 1,
    limit: 10,
  });

  // Page n+1: Infinite scroll
  const {
    data: moreProducts,
    isFetching: isFetchingMore,
    error: moreError,
  } = useGetProductsQuery(
    {
      search: selected,
      page: page + 1,
      limit: 10,
    },
    {
      skip: !hasMore || isLoadingMore || page === 0,
    }
  );

  // Set initial products (page 1)
  useEffect(() => {
    if (currentProducts) {
      setProducts(currentProducts);
      setPage(1);
      setHasMore(currentProducts.length === 10);
    }
  }, [currentProducts, selected]);

  // Append more products
  useEffect(() => {
    if (moreProducts && isLoadingMore) {
      setProducts((prev) => [...prev, ...moreProducts]);
      setPage((prev) => prev + 1);
      setHasMore(moreProducts.length === 10);
      setIsLoadingMore(false);
    }
  }, [moreProducts, isLoadingMore]);

  // Handle errors
  useEffect(() => {
    if (moreError) {
      setIsLoadingMore(false);
    }
  }, [moreError]);

  // Load more when observer triggers
  const loadMoreProducts = useCallback(() => {
    if (isLoadingMore || !hasMore || isFetchingMore) return;
    setIsLoadingMore(true);
  }, [isLoadingMore, hasMore, isFetchingMore]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreProducts();
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, isLoadingMore, loadMoreProducts]);

  // Tab change handler
  const handleTabChange = (tab: string) => {
    setSelected(tab);
    setProducts([]);
    setPage(1);
    setHasMore(true);
    router.replace(`/products/${tab}`, { scroll: false });
  };

  // Sync URL param with selected tab
  useEffect(() => {
    const currentParam = params?.condition as string;
    if (currentParam && currentParam !== selected) {
      setSelected(currentParam);
      setProducts([]);
      setPage(1);
      setHasMore(true);
    }
  }, [params?.condition]);

  return (
    <div className="md:px-4 px-1">
      <ConditionTabBar
        options={productConditionOptions}
        selected={selected}
        onTabChange={handleTabChange}
      />

      {/* Initial Loading */}
      {isInitialLoading && <ProductGridSkeleton count={10} />}

      {/* Product Grid */}
      {!isInitialLoading && (
        <ProductGrid
          products={products}
          isLoadingMore={isLoadingMore}
          observerRef={observerRef}
        />
      )}

      {/* Error */}
      {(initialError || moreError) && (
        <div className="text-center text-red-500 py-4">
          Failed to load products. Please try again.
        </div>
      )}

      {/* No more products */}
      {!hasMore && products.length > 0 && !isInitialLoading && (
        <div className="text-center text-gray-500 py-8">
          <p>You've reached the end of the products.</p>
        </div>
      )}

      {/* Empty state */}
      {products.length === 0 && !isInitialLoading && !initialError && (
        <div className="text-center text-gray-500 py-16">
          <p>No products found for "{selected}".</p>
        </div>
      )}
    </div>
  );
}