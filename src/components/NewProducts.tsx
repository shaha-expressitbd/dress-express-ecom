// src/components/NewProducts.tsx
'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, Autoplay } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';
import ProductCard from './ui/organisms/product-card';
import { Product } from '@/types/product';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/autoplay';
import Link from 'next/link';

interface NewProductsSlideProps {
    initialProducts: Product[];
    className?: string;
    autoplay?: boolean | { delay: number };
}

const isDev = process.env.NODE_ENV === 'development';

const ChevronLeftIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

export default function NewProductsSlide({
    initialProducts,
    className = '',
    autoplay = { delay: 3000 },
}: NewProductsSlideProps) {
    const componentId = useMemo(
        () => `new-products-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        []
    );
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
    const [showNavButtons, setShowNavButtons] = useState({ prev: false, next: false });
    const [isHovered, setIsHovered] = useState(false);
    const [isAutoplay, setIsAutoplay] = useState(!!autoplay);

    const newProducts = useMemo(() => {
        const filtered = initialProducts.filter((product) =>
            product.variantsId?.some((variant) => variant.condition?.toLowerCase() === 'new')
        );
        if (isDev) console.log('Filtered new products:', filtered);
        return filtered;
    }, [initialProducts]);

    // ✅ ফিক্স: debounce কে useMemo এ রাখো, useCallback নয়
    const checkNavButtons = useMemo(() => {
        const updateButtons = () => {
            if (swiperInstance) {
                setShowNavButtons({
                    prev: !swiperInstance.isBeginning,
                    next: !swiperInstance.isEnd,
                });
            }
        };
        return debounce(updateButtons, 200);
    }, [swiperInstance]);

    const handlePrevClick = useCallback(() => {
        swiperInstance?.slidePrev();
    }, [swiperInstance]);

    const handleNextClick = useCallback(() => {
        swiperInstance?.slideNext();
    }, [swiperInstance]);

    // ✅ ফিক্স: cleanup যোগ করা হয়েছে
    useEffect(() => {
        return () => {
            checkNavButtons.cancel();
        };
    }, [checkNavButtons]);

    // ✅ ফিক্স: autoplay এবং nav update
    useEffect(() => {
        if (swiperInstance && autoplay && !isAutoplay) {
            swiperInstance.autoplay.start();
            setIsAutoplay(true);
        }
        checkNavButtons();
    }, [swiperInstance, autoplay, isAutoplay, checkNavButtons]);

    useEffect(() => {
        if (swiperInstance) {
            swiperInstance.update();
            checkNavButtons();
        }
    }, [newProducts, swiperInstance, checkNavButtons]);

    useEffect(() => {
        const handleResize = () => {
            if (swiperInstance) {
                swiperInstance.update();
                checkNavButtons();
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [swiperInstance, checkNavButtons]);

    return (
        <motion.section
            className={`relative overflow-hidden ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-green-50/30 via-transparent to-green-50/20 dark:from-green-900/10 dark:via-transparent dark:to-green-900/5 pointer-events-none" />
            <div className="relative px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10 lg:px-8 lg:py-12 max-w-8xl mx-auto">
                <motion.div
                    className="relative mb-8 md:mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="flex flex-row items-center justify-between">
                        <div className="relative text-left">

                            <motion.h1
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight mb-2"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <span className="bg-clip-text text-transparent bg-secondary">New Arrivals</span>
                            </motion.h1>
                            <motion.p
                                className="text-sm text-black dark:text-gray-300 mb-4 max-w-2xl hidden md:block"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                Discover our latest collection of premium products
                            </motion.p>
                            <motion.div
                                className="relative"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                            >
                                <div className="h-1 bg-gradient-to-r from-primary to-transparent w-32 sm:w-48 md:w-64 lg:w-80 rounded-full" />
                                <div className="h-0.5 bg-gradient-to-r from-primary to-transparent w-24 sm:w-36 md:w-48 lg:w-60 rounded-full -mt-0.5" />
                            </motion.div>
                        </div>
                        <motion.div
                            className=""
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <Link
                                href="/products/new"
                                className="md:px-6 px-2 md:py-3 py-1 bg-transparent border-2 border-secondary text-secondary dark:text-secondary font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-100 transition-colors"
                            >
                                See More
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
                <div className="relative group">
                    {newProducts.length > 0 ? (
                        <>
                            <Swiper
                                modules={[Navigation, FreeMode, Autoplay]}
                                spaceBetween={16}
                                slidesPerView={1}
                                freeMode={{
                                    enabled: true,
                                    sticky: false,
                                    momentumRatio: 0.25,
                                }}
                                autoplay={
                                    autoplay
                                        ? {
                                            delay: typeof autoplay === 'object' ? autoplay.delay : 3000,
                                            disableOnInteraction: false,
                                            pauseOnMouseEnter: true,
                                        }
                                        : false
                                }
                                navigation={{
                                    nextEl: `#${componentId}-next`,
                                    prevEl: `#${componentId}-prev`,
                                }}
                                onSwiper={(swiper: SwiperType) => {
                                    if (isDev) console.log('Swiper initialized');
                                    setSwiperInstance(swiper);
                                    setTimeout(() => checkNavButtons(), 100);
                                }}
                                onSlideChange={checkNavButtons}
                                breakpoints={{
                                    0: { slidesPerView: 1.2, spaceBetween: 8, centeredSlides: false },
                                    320: { slidesPerView: 1.5, spaceBetween: 10, centeredSlides: false },
                                    480: { slidesPerView: 2, spaceBetween: 12, centeredSlides: false },
                                    640: { slidesPerView: 2.5, spaceBetween: 14, centeredSlides: false },
                                    768: { slidesPerView: 3, spaceBetween: 16, centeredSlides: false },
                                    1024: { slidesPerView: 4, spaceBetween: 18, centeredSlides: false },
                                    1280: { slidesPerView: 5, spaceBetween: 20, centeredSlides: false },
                                    1536: { slidesPerView: 6, spaceBetween: 24, centeredSlides: false },
                                }}
                                className={`${componentId}-swiper pb-4`}
                            >
                                <AnimatePresence mode="popLayout">
                                    {newProducts.map((product, index) => (
                                        <SwiperSlide key={`${componentId}-product-${product._id}-${index}`}>
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, scale: 0.8, y: 30, rotateY: -15 }}
                                                animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
                                                exit={{ opacity: 0, scale: 0.8, y: -30, rotateY: 15 }}
                                                whileHover={{
                                                    y: -8,
                                                    scale: 1.02,
                                                    rotateY: 2,
                                                    transition: { duration: 0.2 },
                                                }}
                                                transition={{
                                                    duration: 0.4,
                                                    delay: Math.min(index * 0.05, 0.8),
                                                    ease: [0.25, 0.46, 0.45, 0.94],
                                                }}
                                                className="w-full h-full"
                                            >
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-green-400/20 to-teal-400/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                                                    <ProductCard product={product} isAboveFold={index < 6} />
                                                </div>
                                            </motion.div>
                                        </SwiperSlide>
                                    ))}
                                </AnimatePresence>
                            </Swiper>
                            <AnimatePresence>
                                {showNavButtons.prev && (
                                    <motion.div
                                        id={`${componentId}-prev`}
                                        onClick={handlePrevClick}
                                        className="absolute left-0 sm:-left-2 md:-left-4 top-1/2 -translate-y-1/2 z-30 group/nav cursor-pointer select-none"
                                        initial={{ opacity: 0, x: -20, scale: 0.8 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -20, scale: 0.8 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full blur-md opacity-0 group-hover/nav:opacity-40 transition-opacity duration-300" />
                                            <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white dark:hover:bg-gray-800">
                                                <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700 dark:text-gray-200 group-hover/nav:text-emerald-600 dark:group-hover/nav:text-emerald-400 transition-colors duration-200" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <AnimatePresence>
                                {showNavButtons.next && (
                                    <motion.div
                                        id={`${componentId}-next`}
                                        onClick={handleNextClick}
                                        className="absolute right-0 sm:-right-2 md:-right-4 top-1/2 -translate-y-1/2 z-30 group/nav cursor-pointer select-none"
                                        initial={{ opacity: 0, x: 20, scale: 0.8 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: 20, scale: 0.8 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full blur-md opacity-0 group-hover/nav:opacity-40 transition-opacity duration-300" />
                                            <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white dark:hover:bg-gray-800">
                                                <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700 dark:text-gray-200 group-hover/nav:text-emerald-600 dark:group-hover/nav:text-emerald-400 transition-colors duration-200" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    ) : (
                        <motion.div
                            className="text-center py-16 md:py-24"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex flex-col items-center gap-6 md:gap-8 max-w-lg mx-auto px-4">
                                <motion.div
                                    className="relative"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full blur-xl opacity-20" />
                                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center border border-gray-200/50 dark:border-gray-600/50">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-10 w-10 md:h-12 md:w-12 text-gray-400 dark:text-gray-500"
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
                                </motion.div>
                                <motion.div
                                    className="text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                                        No New Products Yet
                                    </h3>
                                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                        We're working on bringing you the latest products.
                                        <br className="hidden sm:block" />
                                        Check back soon for exciting new arrivals!
                                    </p>
                                    <motion.button
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span>Explore All Products</span>
                                        <ChevronRightIcon className="w-4 h-4" />
                                    </motion.button>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.section>
    );
}