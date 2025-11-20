"use client";

import React, { useMemo, useEffect } from "react";
import type { Product, Variant } from "@/types/product";
import ProductCard from "./ui/organisms/product-card";
import { useGetProductsQuery } from "@/lib/api/publicApi";
import {
  buildGtmItem,
  trackViewRelatedItemList,
} from "@/utils/gtm";
import { LoadingSpinner } from "./ui/atoms/loading-spinner";


interface RelatedProductsProps {
  currentProductId: string;
  subCategoryId: string;
}

export default function RelatedProducts({
  currentProductId,
  subCategoryId,
}: RelatedProductsProps) {
  const {
    data: allProducts = [],
    isLoading,
    isError,
  } = useGetProductsQuery({ limit: 50 });

  const related = useMemo(
    () =>
      allProducts.filter(
        (p: Product) =>
          p._id !== currentProductId &&
          p.sub_category.some((sc) => sc._id === subCategoryId)
      ),
    [allProducts, currentProductId, subCategoryId]
  );

  useEffect(() => {
    if (related.length === 0) return;

    const productsForTracking = related.slice(0, 4).map((p: Product, idx) => {
      const firstVariant = p.variantsId?.[0];
      return buildGtmItem(
        p,
        firstVariant,
        1,
        "Related Products",
        subCategoryId,
        idx + 1
      );
    });

    trackViewRelatedItemList(productsForTracking, subCategoryId);
  }, [related, subCategoryId]);

  /* 🌀 Loading spinner */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[160px]">
        <LoadingSpinner size="lg" color="red" />
      </div>
    );
  }

  if (isError) return null;
  if (related.length === 0) return null;

  return (
    <section>
      <div className="relative mb-4 md:mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Related Products
          </span>
        </h1>
        <div className="h-1.5 bg-gradient-to-r from-red-50/5 via-primary to-red-50/5 mt-2 w-52 md:w-80 mx-auto rounded-full" />
      </div>

      {/* product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-10">
        {related.map((product: Product, idx: number) => {
          if (idx >= 4) return null;
          const visibility = idx <= 3 ? "" : "hidden lg:block";
          return (
            <div key={product._id} className={visibility}>
              <ProductCard product={product} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
