"use client";

import { Product } from "@/types/product";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useGetProductsQuery } from "@/lib/api/publicApi";
import ProductCard from "./ui/organisms/product-card";

const SubCategorySections = () => {
    const { data: products = [], isLoading, error } = useGetProductsQuery({
        page: 1,
        limit: 100,
    });

    const [isMobile, setIsMobile] = useState(false);
    const [isMedium, setIsMedium] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 640);
            setIsMedium(window.innerWidth >= 768 && window.innerWidth < 1024);
        };
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const categorizedProducts = useMemo(() => {
        if (!products.length) return [];

        const map = new Map<string, { category: string; products: Product[]; totalCount: number }>();

        products.forEach((product) => {
            if (!product.category_group?.length) return;

            const lastCategory = product.category_group[product.category_group.length - 1];
            const categoryName = lastCategory?.name?.trim();

            if (!categoryName) return;

            if (!map.has(categoryName)) {
                map.set(categoryName, {
                    category: categoryName,
                    products: [],
                    totalCount: 0,
                });
            }

            const categoryData = map.get(categoryName)!;
            categoryData.products.push(product);
            categoryData.totalCount = categoryData.products.length;
        });

        return Array.from(map.values()).filter((group) => group.products.length > 0);
    }, [products]);

    if (isLoading) {
        return (
            <div className="md:py-16 px-4 bg-slate-50 dark:bg-gray-900">
                <div className="">
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-6 w-48 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                            <p className="text-gray-600 dark:text-gray-300 text-lg">প্রোডাক্ট লোড হচ্ছে...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-16 px-4 bg-slate-50 dark:bg-gray-900">
                <div className="">
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">প্রোডাক্ট লোড করতে ত্রুটি</h3>
                            <p className="text-gray-600 dark:text-gray-300">দয়া করে পরে আবার চেষ্টা করুন।</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (categorizedProducts.length === 0) {
        return (
            <div className="min-h-screen py-16 px-4 bg-slate-50 dark:bg-gray-900">
                <div className="">
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">কোনো প্রোডাক্ট পাওয়া যায়নি</h3>
                            <p className="text-gray-600 dark:text-gray-300">দয়া করে পরে আবার চেষ্টা করুন অথবা অন্য ক্যাটাগরি দেখুন।</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="md:py-16 py-8 md:px-4 px-1 bg-slate-50 dark:bg-gray-900">
            <div className="space-y-16">
                {categorizedProducts.map(({ category, products: catProducts, totalCount }, sectionIndex) => {
                    // Updated maxProducts: 4 products for mobile, 4 for medium, 5 for larger screens
                    const maxProducts = isMobile ? 4 : isMedium ? 4 : 5;
                    const finalProducts = catProducts.slice(0, maxProducts);

                    return (
                        <section
                            key={category}
                            className="space-y-8 animate-fade-in-up"
                            style={{ animationDelay: `${sectionIndex * 150}ms` }}
                        >
                            {/* Category Header */}
                            <div className="relative">
                                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800 to-transparent"></div>
                                <div className="relative bg-white dark:bg-gray-800 md:px-8 px-2 md:py-6 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
                                    <div className="flex items-center md:justify-between justify-center flex-wrap gap-2">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1">
                                                <h2 className="md:text-3xl text-2xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
                                                    {category}
                                                    <p className="w-full h-0.5 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></p>
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="hidden md:block">
                                            <Link
                                                href={`/category/${encodeURIComponent(category)}`}
                                                className="group inline-flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-tertiary dark:bg-secondary dark:hover:bg-tertiary text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                            >
                                                See All Products
                                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="md:flex hidden items-center gap-3 mt-4 pl-4">
                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-semibold border border-blue-200 dark:border-blue-700">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                            {totalCount} টি প্রিমিয়াম প্রোডাক্ট
                                        </span>
                                        {totalCount > maxProducts && (
                                            <span className="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-sm font-semibold border border-amber-200 dark:border-amber-700">
                                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                                +{totalCount - maxProducts} আরও পণ্য
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Updated Products Grid: 2 columns for mobile */}
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-2">
                                {finalProducts.length > 0 ? (
                                    finalProducts.map((product, index) => (
                                        <div
                                            key={product._id}
                                            className="group relative animate-fade-in-up"
                                            style={{
                                                animationDelay: `${(sectionIndex * 150) + (index * 100)}ms`,
                                                animationFillMode: "forwards",
                                            }}
                                        >
                                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
                                            <div className="relative bg-white dark:bg-gray-800 rounded-xl md:shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 transform group-hover:scale-[1.02] group-hover:-translate-y-1 overflow-hidden">
                                                <div className="h-1 md:block hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                                <div className="lg:p-4 md:p-3 p-1">
                                                    <ProductCard product={product} isAboveFold={false} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-12">
                                        <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 font-medium">
                                            এই ক্যাটাগরিতে কোনো প্রোডাক্ট নেই।
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Mobile View All Button */}
                            <div className="flex justify-center md:hidden">
                                <Link
                                    href={`/category/${encodeURIComponent(category)}`}
                                    className="group items-center gap-2 px-6 py-3 bg-secondary hover:bg-tertiary dark:bg-secondary dark:hover:bg-tertiary text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    See More
                                </Link>
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
};

export default SubCategorySections;