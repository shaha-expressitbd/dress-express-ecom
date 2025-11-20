"use client";
import React from "react";
import { Category } from "@/types/business";
import { FiRefreshCcw, FiX } from "react-icons/fi";
import FilterContent from "./filter-content";
import { Product } from "@/types/product";

interface ShopFiltersProps {
    categories: Category[];
    selectedCats: string[];
    setSelectedCats: React.Dispatch<React.SetStateAction<string[]>>;
    selectedSizes: string[];
    setSelectedSizes: React.Dispatch<React.SetStateAction<string[]>>;
    priceRange: [number, number];
    setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    minPrice: number;
    maxPrice: number;
    initialProducts: Product[];
    filteredProductsCount: number;
    clearAllFilters: () => void;
    isMobileFiltersOpen: boolean;
    setIsMobileFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
    sidebarRef?: React.RefObject<HTMLDivElement>;
}

const scrollbarHiddenStyle = {
    scrollbarWidth: "none" as const,
    msOverflowStyle: "none" as const,
    "&::WebkitScrollbar": { display: "none" },
};

export default function ShopFilters({
    categories,
    selectedCats,
    setSelectedCats,
    selectedSizes,
    setSelectedSizes,
    priceRange,
    setPriceRange,
    searchQuery,
    setSearchQuery,
    minPrice,
    maxPrice,
    initialProducts,
    filteredProductsCount,
    clearAllFilters,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    sidebarRef,
}: ShopFiltersProps) {
    return (
        <>
            {/* Mobile filter drawer */}
            <div
                className={`fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden transition-opacity duration-300 ${isMobileFiltersOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            >
                <div
                    className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileFiltersOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <div className="flex flex-col h-full">
                        <div className="sticky top-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Filters</h2>
                                <button
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <FiX className="text-gray-600 dark:text-gray-300 text-xl" />
                                </button>
                            </div>
                            {(selectedCats.length > 0 || selectedSizes.length > 0 || searchQuery) && (
                                <button
                                    onClick={clearAllFilters}
                                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                                >
                                    <FiRefreshCcw className="mr-1 w-3 h-3" />
                                    Clear All
                                </button>
                            )}
                        </div>
                        <div className="flex-1 overflow-y-auto" style={scrollbarHiddenStyle}>
                            <FilterContent
                                categories={categories}
                                selectedCats={selectedCats}
                                setSelectedCats={setSelectedCats}
                                selectedSizes={selectedSizes}
                                setSelectedSizes={setSelectedSizes}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                initialProducts={initialProducts}
                                isMobile
                            />
                        </div>
                        <div className="sticky p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pb-10">
                            <button
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="w-full py-3 bg-primary text-white rounded-lg transition-colors shadow-md font-medium"
                            >
                                Show {filteredProductsCount} Products
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <aside
                ref={sidebarRef}
                className="hidden md:block w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 sticky top-0 h-screen"
            >
                <div className="flex flex-col h-full">
                    <div className="sticky top-0 p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Filters</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {filteredProductsCount} Products
                                </span>
                                {(selectedCats.length > 0 || selectedSizes.length > 0 || searchQuery) && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition-colors"
                                    >
                                        <FiRefreshCcw className="mr-1 w-3 h-3" />
                                        Clear All
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto md:px-2" style={scrollbarHiddenStyle}>
                        <FilterContent
                            categories={categories}
                            selectedCats={selectedCats}
                            setSelectedCats={setSelectedCats}
                            selectedSizes={selectedSizes}
                            setSelectedSizes={setSelectedSizes}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            initialProducts={initialProducts}
                        />
                    </div>
                </div>
            </aside>
        </>
    );
}