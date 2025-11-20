'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types/product';
import ProductCard from '@/components/ui/organisms/product-card';
import { motion, AnimatePresence } from 'framer-motion';


interface PreOrderProductsProps {
    initialProducts: Product[];
}

export default function PreOrderProducts({ initialProducts }: PreOrderProductsProps) {
    const searchParams = useSearchParams();
    const urlCondition = searchParams.get('condition')?.toLowerCase() || null;
    const [visibleCount, setVisibleCount] = useState(20);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Filter products to ensure only those with isPreOrder=true in variantsId
    const filteredProducts = useMemo(() => initialProducts, [initialProducts]);

    // Products to display (limited by visibleCount)
    const displayedProducts = useMemo(() => (
        filteredProducts.slice(0, visibleCount)
    ), [filteredProducts, visibleCount]);

    // Check if there are more products to load
    const hasMoreProducts = useMemo(() => (
        filteredProducts.length > visibleCount
    ), [filteredProducts, visibleCount]);

    // Load more products
    const loadMoreProducts = () => {
        setIsLoadingMore(true);
        // Simulate loading delay
        setTimeout(() => {
            setVisibleCount(prev => prev + 20);
            setIsLoadingMore(false);
        }, 500);
    };

    // Sync with URL condition changes
    useEffect(() => {
        if (urlCondition) {
            setVisibleCount(20); // Reset visible count when condition changes
        }
    }, [urlCondition]);

    // Debug: Log filtered products
    useEffect(() => {
        console.log('Filtered Pre-Order Products:', filteredProducts);
    }, [filteredProducts]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-accent/10 via-white to-tertiary/20 dark:from-base/90 dark:via-gray-900 dark:to-base relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-float"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/10 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-40 left-20 w-40 h-40 bg-tertiary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
                <div className="absolute bottom-20 right-10 w-28 h-28 bg-foreground/5 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 px-2 md:px-8 lg:px-12">
                {/* Enhanced Header Section */}
                <div className="text-center">


                    {/* Stats Bar */}
                    <motion.div
                        className="flex justify-center mb-4 md:mb-8 "
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="bg-white/80 dark:bg-base/80 backdrop-blur-lg rounded-2xl md:px-6 px-2 py-3 shadow-xl border border-primary/20">
                            <div className="flex items-center gap-6 text-sm md:text-base">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                                    <span className="font-semibold text-primary">{filteredProducts.length}</span>
                                    <span className="text-muted">Products Available</span>
                                </div>
                                <div className="w-px h-6 bg-gradient-to-b from-primary/30 to-secondary/30"></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-foreground to-accent rounded-full"></div>
                                    <span className="font-semibold text-foreground">Pre-Order</span>
                                    <span className="text-muted">Only</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Products Grid Section */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key="preorder-grid"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        {displayedProducts.length > 0 ? (
                            <>
                                {/* Products Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-8 mb-12">
                                    {displayedProducts.map((product, index) => (
                                        <ProductCard product={product} isAboveFold={index < 6} />
                                    ))}
                                </div>

                                {/* Enhanced Load More Button */}
                                {hasMoreProducts && (
                                    <div className="text-center">
                                        <motion.button
                                            onClick={loadMoreProducts}
                                            disabled={isLoadingMore}
                                            className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-primary via-secondary to-tertiary rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:transform-none overflow-hidden"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {/* Button Background Animation */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-secondary via-primary to-foreground opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

                                            {isLoadingMore ? (
                                                <span className="flex items-center gap-3 relative z-10">
                                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Loading More...</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-3 relative z-10">
                                                    <span>Load More Pre-Orders</span>
                                                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                    </svg>
                                                </span>
                                            )}
                                        </motion.button>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Enhanced Empty State */
                            <motion.div
                                className="text-center py-20 md:py-28"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="relative max-w-md mx-auto">
                                    {/* Background decoration */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10 rounded-3xl blur-2xl"></div>

                                    <div className="relative bg-white/90 dark:bg-base/90 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-primary/20 shadow-2xl">
                                        {/* Icon with animation */}
                                        <div className="relative mb-8">
                                            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-lg">
                                                <svg
                                                    className="w-12 h-12 md:w-16 md:h-16 text-white animate-float"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-foreground to-accent rounded-full animate-float opacity-80" style={{ animationDelay: '1s' }}></div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                                No Pre-Orders Available
                                            </h3>
                                            <p className="text-muted dark:text-gray-400 leading-relaxed">
                                                Currently no pre-order products are available. Check back soon for exclusive early access to our latest products!
                                            </p>
                                        </div>

                                        <motion.button
                                            onClick={() => window.location.href = '/'}
                                            className="inline-flex items-center gap-3 px-6 py-3 text-black font-bold bg-gradient-to-r from-sidebar to-accent rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                            </svg>
                                            <span>Browse All Products</span>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}