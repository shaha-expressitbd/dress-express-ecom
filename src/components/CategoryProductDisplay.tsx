"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { Category } from "@/types/business";
import ProductCard from "./ui/organisms/product-card";

interface CategoryProductDisplayProps {
    products: Product[];
    categories: Category[];
}

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export default function CategoryProductDisplay({
    products,
    categories,
}: CategoryProductDisplayProps) {
    // Use categories directly as top-level since no 'parent' field
    const topLevelCategories = categories;

    // Group products by the first category_group name (assumed to be the parent/main category)
    const productsByCategory = products.reduce((acc, product) => {
        const categoryName = product.category_group?.[0]?.name || "Other";
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(product);
        return acc;
    }, {} as Record<string, Product[]>);

    // Shuffle products for "women's" category randomly on each load
    if (productsByCategory["women's"]) {
        productsByCategory["women's"] = shuffleArray(productsByCategory["women's"]);
    }

    // Sort categories based on the provided categories array order, excluding "Customer Reviews"
    const sortedCategoryNames = topLevelCategories
        .map((cat) => cat.name)
        .filter((name) => name !== "Customer Reviews" && productsByCategory[name]);

    // Fallback UI if no categories or products
    if (!sortedCategoryNames.length) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No Products Available
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            We're working on adding new categories and products. Check back soon!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden">
            <div className="relative mx-auto px-1 md:px-4 py-2 md:py-8">
                <div className="space-y-4 sm:space-y-4 md:space-y-8">
                    {sortedCategoryNames.map((categoryName, categoryIndex) => {
                        const isMensSneakers = categoryName === "women's";
                        const categoryProducts = productsByCategory[categoryName];

                        // Determine number of products to show based on category
                        const mobileLimit = isMensSneakers ? 10 : 4;
                        const desktopLimit = isMensSneakers ? (window.innerWidth >= 1024 ? 15 : 12) : 5;
                        // Note: For md (768px+ but <1024px), use 12; for lg (1024px+), 15. But since it's SSR, we can't use window here directly. For simplicity, we'll handle in grid slices, but adjust classes accordingly.

                        return (
                            <div
                                key={categoryName}
                                className="group relative"
                                style={{
                                    animationDelay: `${categoryIndex * 100}ms`,
                                    animation: 'fadeInUp 0.6s ease-out forwards'
                                }}
                            >
                                {/* Category Header */}
                                <div className="flex flex-col xs:flex-row xs:justify-between xs:items-end gap-2 mb-2 md:mb-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                                            <h2 className="text-lg md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent capitalize break-all">
                                                {categoryName}
                                            </h2>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 pl-2">
                                            <span>{categoryProducts.length} Products</span>
                                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                            <span>Curated Selection</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/category/${encodeURIComponent(categoryName)}`}
                                        className="group/link inline-flex items-center gap-2 px-1 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-primary to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-medium sm:font-semibold text-xs sm:text-sm rounded-lg sm:rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-out"
                                    >
                                        <span className="hidden xs:inline text-nowrap">Explore All</span>
                                        <span className="xs:hidden">All</span>
                                        <div className="relative overflow-hidden">
                                            <svg
                                                className="w-3 h-3 sm:w-4 md:w-5 sm:h-4 md:h-5 transform group-hover/link:translate-x-1 transition-transform duration-300"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                />
                                            </svg>
                                        </div>
                                    </Link>
                                </div>

                                {/* Products Grid */}
                                <div className="relative">
                                    {/* Grid Background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-3xl blur-sm"></div>

                                    <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-xl sm:rounded-2xl p-1 md:p-4 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-xl transition-all duration-300">
                                        {/* Mobile Grid */}
                                        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:hidden">
                                            {categoryProducts.slice(0, mobileLimit).map((product, index) => (
                                                <div
                                                    key={`mobile-${product._id}`}
                                                    className="group/card transform transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01]"
                                                    style={{
                                                        animationDelay: `${(categoryIndex * mobileLimit + index) * 80}ms`,
                                                        animation: 'fadeInUp 0.5s ease-out forwards',
                                                    }}
                                                >
                                                    <div className="relative">
                                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-xl blur opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                                                        <div className="relative">
                                                            <ProductCard product={product} isAboveFold={index < 2} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Desktop Grid */}
                                        <div className={`hidden md:grid gap-4 md:gap-6 ${isMensSneakers ? 'grid-cols-4 lg:grid-cols-5' : 'grid-cols-3 lg:grid-cols-5'}`}>
                                            {categoryProducts.slice(0, isMensSneakers ? (window.innerWidth >= 1024 ? 15 : 12) : 5).map((product, index) => (
                                                <div
                                                    key={`desktop-${product._id}`}
                                                    className="group/card transform transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01]"
                                                    style={{
                                                        animationDelay: `${(categoryIndex * 5 + index) * 80}ms`, // Keep animation delay based on original for simplicity
                                                        animation: 'fadeInUp 0.5s ease-out forwards',
                                                    }}
                                                >
                                                    <div className="relative">
                                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-xl blur opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                                                        <div className="relative">
                                                            <ProductCard product={product} isAboveFold={index < 2} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Category Separator */}
                                {categoryIndex < sortedCategoryNames.length - 1 && (
                                    <div className="flex items-center justify-center mt-8 sm:mt-12 md:mt-16">
                                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                                            <div className="w-8 sm:w-12 md:w-16 h-px bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></div>
                                            <div className="w-1 sm:w-1.5 md:w-2 h-1 sm:h-1.5 md:h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                                            <div className="w-8 sm:w-12 md:w-16 h-px bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}