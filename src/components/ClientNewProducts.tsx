// src/components/ClientAllProducts.tsx
"use client";

import React, { Suspense } from "react";
import { Product } from "@/types/product";
import { LoadingSpinner } from "./ui/atoms/loading-spinner";
import NewProductsSlide from "./NewProducts";

export default function ClientNewProducts({
    initialProducts,
}: {
    initialProducts: Product[];
}) {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center min-h-[200px]">
                    <LoadingSpinner size="lg" color="red" />
                </div>
            }
        >
            <NewProductsSlide initialProducts={initialProducts} />
        </Suspense>
    );
}