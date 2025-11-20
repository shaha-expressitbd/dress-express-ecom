// components/shop-all-products/mobile-header.tsx
"use client";
import React from "react";
import { FiFilter } from "react-icons/fi";

interface ShopMobileHeaderProps {
    isMobileFiltersOpen: boolean;
    setIsMobileFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
    sortBy: "name" | "price-low" | "price-high" | "newest";
    setSortBy: React.Dispatch<
        React.SetStateAction<"name" | "price-low" | "price-high" | "newest">
    >;
    selectedCats: string[];
    selectedSizes: string[];
    searchQuery: string;
}

export default function ShopMobileHeader({
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    sortBy,
    setSortBy,
    selectedCats,
    selectedSizes,
    searchQuery,
}: ShopMobileHeaderProps) {
    return (
        <div className="md:hidden sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-1">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors shadow-md"
                >
                    <FiFilter className="mr-2 w-4 h-4" />
                    Filters
                    {(selectedCats.length > 0 || selectedSizes.length > 0 || searchQuery) && (
                        <span className="ml-2 px-2 py-1 bg-red-900 text-xs rounded-full">
                            {selectedCats.length + selectedSizes.length + (searchQuery ? 1 : 0)}
                        </span>
                    )}
                </button>

                <div className="flex items-center space-x-2">
                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(
                                e.target.value as "name" | "price-low" | "price-high" | "newest"
                            )
                        }
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-gray-200"
                    >
                        <option value="newest">Newest</option>
                        <option value="name">Name A-Z</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>
            </div>
        </div>
    );
}