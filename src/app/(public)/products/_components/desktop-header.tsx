// components/shop-all-products/desktop-header.tsx
"use client";
import React from "react";
import { Product } from "@/types/product";

interface ShopDesktopHeaderProps {
    filteredAndSorted: Product[];
    initialProducts: Product[];
    sortBy: "name" | "price-low" | "price-high" | "newest";
    setSortBy: React.Dispatch<
        React.SetStateAction<"name" | "price-low" | "price-high" | "newest">
    >;
    totalFilteredCount?: number;
}

export default function ShopDesktopHeader({
    filteredAndSorted,
    initialProducts,
    sortBy,
    setSortBy,
    totalFilteredCount,
}: ShopDesktopHeaderProps) {
    return (
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 md:px-2 z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="hidden md:block">
                    <h1 className=" font-bold dark:text-white text-xl">All Products</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {(totalFilteredCount ?? filteredAndSorted.length)} of {initialProducts.length} products
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(
                                e.target.value as "name" | "price-low" | "price-high" | "newest"
                            )
                        }
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hidden md:block"
                    >
                        <option value="newest">Newest First</option>
                        <option value="name">Name A-Z</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>
            </div>
        </div>
    );
}