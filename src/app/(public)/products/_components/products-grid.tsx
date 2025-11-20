// components/shop-all-products/products-grid.tsx
"use client";
import React, { useMemo } from "react";
import { Product } from "@/types/product";
import { FiSearch } from "react-icons/fi";
import ProductCard from "@/components/ui/organisms/product-card";
import Image from "next/image";

interface ShopProductsGridProps {
    productsContainerRef: React.RefObject<HTMLDivElement>;
    filteredAndSorted: Product[];
    initialProducts: Product[];
    clearAllFilters: () => void;
    containerWidth?: number;
    isLoading?: boolean;
}

export default function ShopProductsGrid({
    productsContainerRef,
    filteredAndSorted,
    clearAllFilters,
    containerWidth,
    isLoading = false,
}: ShopProductsGridProps) {
    const columns = useMemo(() => {
        if (!containerWidth) return 2;
        if (containerWidth < 600) return 2;
        if (containerWidth < 900) return 2;
        if (containerWidth < 1200) return 3;
        return 4;
    }, [containerWidth]);

    return (
        <div
            ref={productsContainerRef}
            className="md:p-4 p-1 overflow-y-auto"
            style={{
                height: "calc(100vh - 4rem)",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
            }}
        >
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {filteredAndSorted.length > 0 ? (
                <div
                    className={`w-full grid gap-2 md:gap-5 px-1 lg:px-4 mt-2 md:mt-0 grid-cols-${columns}`}
                >
                    {filteredAndSorted.map((product, i) => (
                        <div key={product._id} className="w-full">
                            <ProductCard product={product} isAboveFold={i < 8} isLoading={isLoading} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-full flex items-center justify-center">
                    <div className="max-w-md mx-auto text-center">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <FiSearch className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Try adjusting your filters or search terms to find what you are looking for.
                        </p>
                        <button
                            onClick={clearAllFilters}
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors shadow-md font-medium"
                        >
                            Clear All Filters
                        </button>
                    </div>
                </div>
            )}

            <div className="md:hidden block">
                <div className="fixed bottom-0 left-0 w-full bg-black text-center py-1 flex items-center justify-center gap-1 z-50">
                    <p className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm sm:text-base">
                        <span className="text-gray-400 text-sm dark:text-gray-300 flex items-end">Powered by:</span>
                        <a
                            href="https://calquick.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80 transition-opacity"
                        >
                            <Image
                                height={100}
                                width={100}
                                src={"https://calquick.app/images/logo/logo-white.png"}
                                className="h-6 w-auto object-contain "
                                alt="calquick-logo"
                                priority
                            />
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}