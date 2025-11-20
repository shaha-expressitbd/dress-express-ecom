"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types/product";
import ProductCard from "./ui/organisms/product-card";
import { motion, AnimatePresence } from "framer-motion";

// Utility function to shuffle an array with proper TypeScript typing
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

interface AllProductsProps {
    initialProducts: Product[];
}

interface Tab {
    id: string;
    label: string;
    count: number;
}

export default function AllProducts({ initialProducts }: AllProductsProps) {
    const searchParams = useSearchParams();
    const urlCondition = searchParams.get("condition")?.toLowerCase() || null;

    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState<string>(() =>
        urlCondition && tabs.some((t) => t.id === urlCondition) ? urlCondition : "all"
    );
    const [windowWidth, setWindowWidth] = useState<number | null>(null);

    // Handle window resize for dynamic grid updates
    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize(); // Set initial width
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Handle initial loading state
    useEffect(() => {
        if (initialProducts && initialProducts.length > 0) {
            setIsLoading(false);
            return;
        }

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [initialProducts]);

    // Group products by condition
    const grouped = useMemo(() => {
        const map: Record<string, Product[]> = {};
        initialProducts.forEach((p) => {
            const conds = p.variantsId
                ?.map((v) => v.condition?.toLowerCase())
                .filter((c): c is string => !!c) ?? [];
            new Set(conds).forEach((c) => {
                map[c] = map[c] || [];
                map[c].push(p);
            });
        });
        return map;
    }, [initialProducts]);

    // Create tabs array with counts
    const tabs = useMemo<Tab[]>(() => {
        const baseTabs: Tab[] = [
            { id: "all", label: "All Products", count: initialProducts.length },
        ];

        Object.entries(grouped)
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([condition, products]) => {
                baseTabs.push({
                    id: condition,
                    label: condition.charAt(0).toUpperCase() + condition.slice(1),
                    count: products.length,
                });
            });

        return baseTabs;
    }, [initialProducts, grouped]);

    // Sync with URL changes
    useEffect(() => {
        if (urlCondition && tabs.some((t) => t.id === urlCondition)) {
            setSelected(urlCondition);
        }
    }, [urlCondition, tabs]);

    // Filter products based on selected tab
    const filtered = useMemo(
        () => (selected === "all" ? initialProducts : grouped[selected] || []),
        [selected, initialProducts, grouped]
    );

    // Randomly shuffle and limit products based on Tailwind breakpoints
    const displayedProducts = useMemo(() => {
        const shuffled = shuffleArray(filtered);

        // Use Tailwind breakpoint values
        const isLargeDevice = windowWidth !== null && windowWidth >= 1024; // lg: 1024px
        const isMediumDevice = windowWidth !== null && windowWidth >= 768 && windowWidth < 1024; // md: 768px to 1023px
        const isMobileDevice = windowWidth !== null && windowWidth < 768; // below 768px

        if (isLargeDevice) {
            return shuffled.slice(0, 15); // 5x3 grid (5 columns, 3 rows)
        } else if (isMediumDevice) {
            return shuffled.slice(0, 12); // 4x3 grid (4 columns, 3 rows)
        } else if (isMobileDevice) {
            return shuffled.slice(0, 8); // 2x4 grid (2 columns, 4 rows)
        }
        return shuffled.slice(0, 8); // Fallback for SSR or undefined width
    }, [filtered, selected, windowWidth]);

    // Handle tab selection
    const handleTabClick = (tabId: string) => {
        setSelected(tabId);
    };

    return (
        <div className="lg:container mx-auto lg:px-0 px-1 pt-0 pb-4 md:px-4 md:pt-0 md:pb-6 bg-white dark:bg-gray-800 md:mb-10 mb-4">
            {/* Header */}
            <div className="relative mb-6 md:mb-8 text-center">
                <div className="inline-flex gap-2 items-center mb-3 mt-8">
                    <p className="text-gray-500 text-3xl dark:text-white">
                        Most <span className="text-gray-700 font-medium dark:text-white">viewing products</span>
                    </p>
                    <p className="w-8 sm:w-12 h-0.5 bg-gray-700 hidden md:block"></p>
                </div>
            </div>

            {/* Products Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selected}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                    {isLoading ? (
                        <div className="px-1 md:px-0 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4 w-full">
                            {/* Skeleton placeholders can be added here if needed */}
                        </div>
                    ) : displayedProducts.length > 0 ? (
                        <div className="px-1 md:px-0 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4 w-full">
                            {displayedProducts.map((product, index) => (
                                <motion.div
                                    key={`${product._id}-${selected}-${index}`}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: Math.min(index * 0.03, 0.5),
                                        ease: "easeOut",
                                    }}
                                    whileHover={{ y: -2 }}
                                    className="w-full"
                                >
                                    <ProductCard product={product} isAboveFold={index < 3} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            className="text-center py-12 md:py-16"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex flex-col items-center gap-4 md:gap-6 max-w-md mx-auto px-4">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 md:h-10 md:w-10 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                        />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                        No products found
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        No products available in the {tabs.find((t) => t.id === selected)?.label} category.
                                    </p>
                                </div>
                                <motion.button
                                    onClick={() => handleTabClick("all")}
                                    className="px-4 md:px-6 py-2 md:py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Browse All Products
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}