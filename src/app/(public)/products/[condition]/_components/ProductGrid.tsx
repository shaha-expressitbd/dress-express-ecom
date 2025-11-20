"use client";
import React from "react";
import { Product } from "@/types/product";
import ProductCard from "@/components/ui/organisms/product-card";
import ProductGridSkeleton from "@/components/skeleton/ProductGridSkeleton";


interface ProductGridProps {
  products: Product[];
  isLoadingMore?: boolean;
  observerRef?: React.RefObject<HTMLDivElement | null>;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoadingMore = false,
  observerRef,
}) => {
  return (
    <div className="relative">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-3 lg:gap-3 xl:gap-4 gap-2">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Loading more skeleton */}
      {isLoadingMore && (
        <div className="mt-8">
          <ProductGridSkeleton count={10} />
        </div>
      )}

      {/* Intersection Observer Target */}
      <div ref={observerRef} className="h-10" />
    </div>
  );
};

export default ProductGrid;