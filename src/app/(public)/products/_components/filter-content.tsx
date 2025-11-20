"use client";
import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { Category } from "@/types/business";
import { Product } from "@/types/product";
import { FiSearch, FiX } from "react-icons/fi";
import CategoryTree from "./category-tree";
import RangePriceFilter from "./rangeSlider";

interface FilterContentProps {
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
    isMobile?: boolean;
}

const scrollbarHiddenStyle: React.CSSProperties = {
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    overflow: "-moz-scrollbars-none",
    WebkitOverflowScrolling: "touch",
};

export default function FilterContent({
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
    isMobile = false,
}: FilterContentProps) {
    const [localSearch, setLocalSearch] = useState(searchQuery);
    const searchRef = useRef<HTMLDivElement>(null); // Ref for the search input container

    // Sync local input with parent search state
    useEffect(() => {
        setSearchQuery(localSearch);
    }, [localSearch, setSearchQuery]);

    // Handle clicks outside the search input to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setLocalSearch(""); // Close search input if clicked outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggle = useCallback(
        (
            list: string[],
            setList: React.Dispatch<React.SetStateAction<string[]>>,
            value: string
        ) => {
            setList((prev) =>
                prev.includes(value)
                    ? prev.filter((x) => x !== value)
                    : [...prev, value]
            );
        },
        []
    );

    const allSizes = useMemo(() => {
        const sizes = new Set<string>();
        initialProducts.forEach((p) => {
            p.variantsId?.forEach((v) => {
                v.variants_values?.forEach((size) => {
                    if (size && size.trim()) sizes.add(size.trim());
                });
            });
        });
        return Array.from(sizes).sort((a, b) => {
            const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
            const aIndex = sizeOrder.indexOf(a.toUpperCase());
            const bIndex = sizeOrder.indexOf(b.toUpperCase());
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [initialProducts]);

    return (
        <div className={`space-y-2  px-2 ${isMobile ? "pb-0" : ""}`}>
            {/* Search */}
            <div className="border-b border-gray-200 dark:border-gray-700 py-1 hidden md:block" ref={searchRef}>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    />
                    <FiSearch className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    {localSearch && (
                        <button
                            onClick={() => setLocalSearch("")}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Categories */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-1 sticky top-0 bg-white dark:bg-gray-800 py-1 z-10">
                    Categories
                </h3>
                <div className="max-h-80 overflow-y-auto" style={scrollbarHiddenStyle}>
                    <label className="flex items-center py-1 px-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors mb-2 border-b border-gray-100 dark:border-gray-700">
                        <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-blue-600 rounded"
                            checked={selectedCats.length === 0}
                            onChange={() => setSelectedCats([])}
                        />
                        <span className="ml-3 text-gray-700 dark:text-gray-300 text-sm font-semibold">
                            All Categories
                        </span>
                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                            ({initialProducts.length})
                        </span>
                    </label>
                    <CategoryTree
                        categories={categories}
                        selectedCats={selectedCats}
                        setSelectedCats={setSelectedCats}
                        initialProducts={initialProducts}
                    />
                </div>
            </div>

            {/* Price Range */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">Price Range</h3>
                <RangePriceFilter
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                />
            </div>

            {/* Size */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">Size</h3>
                <div className="space-y-3">
                    <label className="flex items-center py-2 px-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700">
                        <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-blue-600 rounded"
                            checked={selectedSizes.length === 0}
                            onChange={() => setSelectedSizes([])}
                        />
                        <span className="ml-3 text-gray-700 dark:text-gray-300 text-sm font-semibold">
                            All Sizes
                        </span>
                    </label>
                    <div
                        className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto"
                        style={scrollbarHiddenStyle}
                    >
                        {allSizes.map((size) => (
                            <label
                                key={size}
                                className={`flex items-center justify-center py-3 px-2 rounded-lg cursor-pointer transition-all duration-200 border-2 text-black dark:text-white ${selectedSizes.includes(size)
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-white shadow-md transform scale-105"
                                    : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={selectedSizes.includes(size)}
                                    onChange={() => toggle(selectedSizes, setSelectedSizes, size)}
                                />
                                <span className="text-sm font-medium">{size}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}