/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
    Navigation,
    Autoplay,
    FreeMode,
    Pagination,
    EffectCoverflow,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import { motion, AnimatePresence } from 'framer-motion';

import { Product } from '@/types/product';
import ProductCard from '@/components/ui/organisms/product-card';
import { CountdownTimer } from '../../product/_component/CountdownTimer';

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */
const getCategoryName = (p: Product) =>
    p.sub_category?.[0]?.name ?? 'Uncategorised';

const toNumber = (v: string | number | undefined | null) =>
    v === undefined || v === null ? 0 : Number(v);

interface FlashDealsProps {
    initialDeals: Product[];
}

export default function FlashDeals({ initialDeals }: FlashDealsProps) {
    /* ───────── State ───────── */
    const [swiper, setSwiper] = useState<any>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
    const [sortBy, setSortBy] = useState<'discount' | 'time' | 'price'>('discount');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [showExpired, setShowExpired] = useState(false);
    const [dealStats, setDealStats] = useState({
        total: 0,
        active: 0,
        expiring: 0,
    });
    const [isMobile, setIsMobile] = useState(false);

    const prevRef = useRef<HTMLDivElement>(null);
    const nextRef = useRef<HTMLDivElement>(null);
    const [showNav, setShowNav] = useState({ prev: false, next: false });

    /* ───────── Responsive Handling ───────── */
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkMobile();

        // Add event listener
        window.addEventListener('resize', checkMobile);

        // Clean up
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    /* ───────── Derived Data ───────── */
    const { deals, categories } = useMemo(() => {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        /* ---------- Active / expired filtering ---------- */
        let filteredDeals = initialDeals.filter((p) => {
            const v = p.variantsId?.[0];
            const end = v?.discount_end_date;
            const start = v?.discount_start_date;

            if (!end) return false;

            const endTime = new Date(end).getTime();
            const startTime = start ? new Date(start).getTime() : 0;

            const isActive = now >= startTime && now <= endTime;
            const isExpired = now > endTime;

            return showExpired ? isActive || isExpired : isActive;
        });

        /* ---------- Category filter ---------- */
        if (filterCategory !== 'all') {
            filteredDeals = filteredDeals.filter(
                (p) => getCategoryName(p).toLowerCase() === filterCategory.toLowerCase(),
            );
        }

        /* ---------- Sorting ---------- */
        filteredDeals.sort((a, b) => {
            const va = a.variantsId?.[0];
            const vb = b.variantsId?.[0];

            switch (sortBy) {
                case 'discount': {
                    const da = toNumber(va?.discount_percent);
                    const db = toNumber(vb?.discount_percent);
                    return db - da;
                }
                case 'time': {
                    const ea = new Date(va?.discount_end_date ?? 0).getTime();
                    const eb = new Date(vb?.discount_end_date ?? 0).getTime();
                    return ea - eb;
                }
                case 'price': {
                    const pa = toNumber(va?.offer_price) || toNumber(va?.selling_price) || 0;
                    const pb = toNumber(vb?.offer_price) || toNumber(vb?.selling_price) || 0;
                    return pa - pb;
                }
                default:
                    return 0;
            }
        });

        /* ---------- Unique categories ---------- */
        const uniqueCategories = [...new Set(initialDeals.map(getCategoryName))];

        return { deals: filteredDeals, categories: uniqueCategories };
    }, [initialDeals, filterCategory, sortBy, showExpired]);

    /* ───────── Deal stats ---------- */
    useEffect(() => {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        const stats = initialDeals.reduce(
            (acc, p) => {
                const v = p.variantsId?.[0];
                if (!v?.discount_end_date) return acc;

                const end = new Date(v.discount_end_date).getTime();
                const start = v.discount_start_date
                    ? new Date(v.discount_start_date).getTime()
                    : 0;

                acc.total += 1;
                if (now >= start && now <= end) {
                    acc.active += 1;
                    if (end - now <= oneHour) acc.expiring += 1;
                }
                return acc;
            },
            { total: 0, active: 0, expiring: 0 },
        );

        setDealStats(stats);
    }, [initialDeals]);

    /* ───────── Swiper nav visibility ---------- */
    const updateNav = () => {
        if (!swiper) return;
        setShowNav({ prev: !swiper.isBeginning, next: !swiper.isEnd });
    };
    useEffect(updateNav, [swiper, deals]);

    /* ───────── Hover pause ---------- */
    const handleMouseEnter = () => {
        setIsAutoplayPaused(true);
        swiper?.autoplay?.stop();
    };
    const handleMouseLeave = () => {
        setIsAutoplayPaused(false);
        swiper?.autoplay?.start();
    };

    /* ───────── Discount progress ---------- */
    const getDiscountProgress = (p: Product) => {
        const v = p.variantsId?.[0];
        if (!v?.discount_start_date || !v?.discount_end_date) return 0;

        const now = Date.now();
        const start = new Date(v.discount_start_date).getTime();
        const end = new Date(v.discount_end_date).getTime();
        const total = end - start;
        return Math.max(0, Math.min(100, ((now - start) / total) * 100));
    };

    /* ───────── JSX ───────── */
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-12 mt-2">
            {/* ───────── Header + Stats ───────── */}
            <div className="text-center mb-2 md:mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    <h1 className="text-3xl md:text-6xl font-black tracking-tight relative">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-pink-500 to-red-600 animate-pulse">
                            ⚡ Flash Deals
                        </span>
                        <motion.div
                            className="absolute -top-2 -right- bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            LIVE
                        </motion.div>
                    </h1>

                    {/* Stats Bar */}
                    <div className="flex justify-center items-center gap-6 md:mt-4 mt-1 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-gray-600 dark:text-gray-400">
                                {dealStats.active} Active Deals
                            </span>
                        </div>
                        {dealStats.expiring > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-red-600 dark:text-red-400">
                                    {dealStats.expiring} Expiring Soon!
                                </span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ───────── Controls ───────── */}
                <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
                    {/* View Mode Toggle - Only show on desktop */}
                    {!isMobile && (
                        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('carousel')}
                                className={`px-3 py-1 rounded-md text-sm transition-all ${viewMode === 'carousel'
                                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                🎠 Carousel
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1 rounded-md text-sm transition-all ${viewMode === 'grid'
                                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                ⊞ Grid
                            </button>
                        </div>
                    )}

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="md:px-3 md:py-2 px-2  text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                    >
                        <option value="discount">🔥 Best Discount</option>
                        <option value="time">⏰ Ending Soon</option>
                        <option value="price">💰 Lowest Price</option>
                    </select>

                    {/* Category Filter */}
                    {categories.length > 0 && (
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="md:px-3 md:py-2 px-2  text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                        >
                            <option value="all">📂 All Categories</option>
                            {categories.map((cat, i) => (
                                <option key={`${cat}-${i}`} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Show Expired Toggle */}
                    <label className="flex items-center gap-2 text-sm ">
                        <input
                            type="checkbox"
                            checked={showExpired}
                            onChange={(e) => setShowExpired(e.target.checked)}
                            className="rounded focus:ring-red-500"
                        />
                        <span className="text-gray-600 dark:text-gray-400">
                            Show Expired
                        </span>
                    </label>
                </div>

                <div className="h-1.5 bg-gradient-to-r from-transparent via-red-500 to-transparent mt-6 w-full max-w-md mx-auto rounded-full opacity-60" />
            </div>

            {/* ───────── Content ───────── */}
            {/* Mobile - Always show carousel */}
            {isMobile ? (
                <MobileCarouselView
                    deals={deals}
                    prevRef={prevRef}
                    nextRef={nextRef}
                    showNav={showNav}
                    activeIndex={activeIndex}
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                    setSwiper={setSwiper}
                    updateNav={updateNav}
                    setActiveIndex={setActiveIndex}
                    isAutoplayPaused={isAutoplayPaused}
                    getDiscountProgress={getDiscountProgress}
                />
            ) : (
                /* Desktop - Show either grid or carousel based on viewMode */
                viewMode === 'grid' ? (
                    <DesktopGridView deals={deals} />
                ) : (
                    <DesktopCarouselView
                        deals={deals}
                        prevRef={prevRef}
                        nextRef={nextRef}
                        showNav={showNav}
                        activeIndex={activeIndex}
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        setSwiper={setSwiper}
                        updateNav={updateNav}
                        setActiveIndex={setActiveIndex}
                        isAutoplayPaused={isAutoplayPaused}
                        getDiscountProgress={getDiscountProgress}
                    />
                )
            )}

            {/* ───────── Empty State ───────── */}
            {deals.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 text-center"
                >
                    <div className="md:text-6xl text-2xl mb-4">😔</div>
                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2 ">
                        No {showExpired ? '' : 'active'} flash deals available
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500 mb-6">
                        {filterCategory !== 'all'
                            ? `No deals found in "${filterCategory}" category.`
                            : "Don't worry, amazing deals are coming soon!"}
                    </p>
                    <div className="flex justify-center gap-3">
                        {filterCategory !== 'all' && (
                            <button
                                onClick={() => setFilterCategory('all')}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                View All Categories
                            </button>
                        )}
                        {!showExpired && (
                            <button
                                onClick={() => setShowExpired(true)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Show Expired Deals
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

/* ───────── Component Sub-sections ───────── */

const MobileCarouselView = ({
    deals,
    prevRef,
    nextRef,
    showNav,
    activeIndex,
    handleMouseEnter,
    handleMouseLeave,
    setSwiper,
    updateNav,
    setActiveIndex,
    isAutoplayPaused,
    getDiscountProgress
}: {
    deals: Product[];
    prevRef: React.RefObject<HTMLDivElement>;
    nextRef: React.RefObject<HTMLDivElement>;
    showNav: { prev: boolean; next: boolean };
    activeIndex: number;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    setSwiper: (swiper: any) => void;
    updateNav: () => void;
    setActiveIndex: (index: number) => void;
    isAutoplayPaused: boolean;
    getDiscountProgress: (p: Product) => number;
}) => (
    <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
        {/* Progress Bar */}
        <div className="mb-4 bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${((activeIndex + 1) / deals.length) * 100}%` }}
                transition={{ duration: 0.3 }}
            />
        </div>

        <Swiper
            modules={[
                Navigation,
                Autoplay,
                FreeMode,
                Pagination,
                EffectCoverflow,
            ]}
            centeredSlides
            effect="coverflow"
            coverflowEffect={{
                rotate: 15,
                stretch: 0,
                depth: 300,
                modifier: 1,
                slideShadows: true,
            }}
            autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
            }}
            onSwiper={(s) => {
                setSwiper(s);
                setTimeout(updateNav, 50);
            }}
            onSlideChange={(s) => {
                updateNav();
                setActiveIndex(s.activeIndex);
            }}
            breakpoints={{
                0: { slidesPerView: 1.15, spaceBetween: 12 },
                375: { slidesPerView: 1.35, spaceBetween: 14 },
                480: { slidesPerView: 1.6, spaceBetween: 16 },
                640: { slidesPerView: 2.2, spaceBetween: 18 },
            }}
            className="pb-12"
        >
            <AnimatePresence mode="popLayout">
                {deals.map((deal, idx) => {
                    const v = deal.variantsId?.[0];
                    const endDate =
                        v?.discount_end_date ?? new Date().toISOString();
                    const expiring =
                        v?.discount_end_date &&
                        new Date(v.discount_end_date).getTime() - Date.now() <=
                        60 * 60 * 1000;
                    const progress = getDiscountProgress(deal);

                    const getUniqueKey = (deal: Product, idx: number) => {
                        if (deal._id && String(deal._id).trim()) return String(deal._id);
                        return `deal-${idx}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
                    };
                    return (
                        <SwiperSlide
                            key={getUniqueKey(deal, idx)}
                            className="!w-auto pt-10"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -30, scale: 0.8 }}
                                whileHover={{
                                    scale: 1.05,
                                    rotateY: 5,
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                }}
                                transition={{ duration: 0.4 }}
                                className={`relative w-[250px] sm:w-[280px] ${expiring ? 'animate-pulse' : ''
                                    }`}
                            >
                                {/* Deal badge */}
                                <div className="absolute -top-2 right-20 z-20">
                                    <motion.div
                                        className={`px-2 py-1 rounded-full text-xs font-bold ${expiring
                                            ? 'bg-red-500 text-white'
                                            : 'bg-green-500 text-white'
                                            }`}
                                        animate={{
                                            rotate: expiring ? [0, -5, 5, 0] : 0,
                                        }}
                                        transition={{
                                            repeat: expiring ? Infinity : 0,
                                            duration: 0.5,
                                        }}
                                    >
                                        {expiring ? '🔥 ENDING SOON!' : '⚡ HOT DEAL!'}
                                    </motion.div>
                                </div>
                                {/* Progress Ring */}
                                <div className="absolute top-2 left-2 z-20">
                                    <svg
                                        className="w-8 h-8 transform -rotate-90"
                                        viewBox="0 0 36 36"
                                    >
                                        <path
                                            className="text-gray-300"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className="text-red-500"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeDasharray={`${progress}, 100`}
                                            strokeLinecap="round"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                </div>

                                <ProductCard product={deal} isAboveFold={false} />

                                <div className="mt-3 space-y-2">
                                    <CountdownTimer endDate={endDate} />
                                    {v?.discount_percent && (
                                        <div className="text-center">
                                            <span className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                {v.discount_percent}% OFF
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    );
                })}
            </AnimatePresence>
        </Swiper>

        {/* ─── Navigation Buttons ─── */}
        <AnimatePresence>
            {showNav.prev && (
                <motion.div
                    ref={prevRef}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl hover:shadow-2xl flex items-center justify-center cursor-pointer select-none border border-gray-200 dark:border-gray-700"
                >
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </motion.div>
            )}
            {showNav.next && (
                <motion.div
                    ref={nextRef}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl hover:shadow-2xl flex items-center justify-center cursor-pointer select-none border border-gray-200 dark:border-gray-700"
                >
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </motion.div>
            )}
        </AnimatePresence>


    </div>
);

const DesktopGridView = ({ deals }: { deals: Product[] }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
    >
        <AnimatePresence>
            {deals.map((deal, idx) => {
                const v = deal.variantsId?.[0];
                const endDate =
                    v?.discount_end_date ?? new Date().toISOString();
                const expiring =
                    v?.discount_end_date &&
                    new Date(v.discount_end_date).getTime() - Date.now() <=
                    60 * 60 * 1000;

                const getUniqueKey = (deal: Product, idx: number) => {
                    if (deal._id && String(deal._id).trim()) return String(deal._id);
                    return `grid-${idx}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
                };
                return (
                    <motion.div
                        key={getUniqueKey(deal, idx)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                        className={`relative ${expiring ? 'animate-pulse' : ''}`}
                    >
                        {expiring && (
                            <div className="absolute -top-2 -right-2 z-20 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-bounce">
                                🔥 ENDING SOON!
                            </div>
                        )}
                        <ProductCard product={deal} isAboveFold={false} />
                        <div className="mt-2">
                            <CountdownTimer endDate={endDate} />
                            {v?.discount_percent && (
                                <div className="text-center mt-2">
                                    <span className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        {v.discount_percent}% OFF
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </AnimatePresence>
    </motion.div>
);

const DesktopCarouselView = ({
    deals,
    prevRef,
    nextRef,
    showNav,
    activeIndex,
    handleMouseEnter,
    handleMouseLeave,
    setSwiper,
    updateNav,
    setActiveIndex,
    isAutoplayPaused,
    getDiscountProgress
}: {
    deals: Product[];
    prevRef: React.RefObject<HTMLDivElement>;
    nextRef: React.RefObject<HTMLDivElement>;
    showNav: { prev: boolean; next: boolean };
    activeIndex: number;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    setSwiper: (swiper: any) => void;
    updateNav: () => void;
    setActiveIndex: (index: number) => void;
    isAutoplayPaused: boolean;
    getDiscountProgress: (p: Product) => number;
}) => (
    <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
        {/* Progress Bar */}
        <div className="mb-4 bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${((activeIndex + 1) / deals.length) * 100}%` }}
                transition={{ duration: 0.3 }}
            />
        </div>

        <Swiper
            modules={[
                Navigation,
                Autoplay,
                FreeMode,
                Pagination,
                EffectCoverflow,
            ]}
            centeredSlides
            effect="coverflow"
            coverflowEffect={{
                rotate: 15,
                stretch: 0,
                depth: 300,
                modifier: 1,
                slideShadows: true,
            }}
            autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
            }}
            onSwiper={(s) => {
                setSwiper(s);
                setTimeout(updateNav, 50);
            }}
            onSlideChange={(s) => {
                updateNav();
                setActiveIndex(s.activeIndex);
            }}
            breakpoints={{
                0: { slidesPerView: 1.15, spaceBetween: 12 },
                375: { slidesPerView: 1.35, spaceBetween: 14 },
                480: { slidesPerView: 1.6, spaceBetween: 16 },
                640: { slidesPerView: 2.2, spaceBetween: 18 },
                768: { slidesPerView: 2.5, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
                1280: { slidesPerView: 4, spaceBetween: 28 },
            }}
            className="pb-12"
        >
            <AnimatePresence mode="popLayout">
                {deals.map((deal, idx) => {
                    const v = deal.variantsId?.[0];
                    const endDate =
                        v?.discount_end_date ?? new Date().toISOString();
                    const expiring =
                        v?.discount_end_date &&
                        new Date(v.discount_end_date).getTime() - Date.now() <=
                        60 * 60 * 1000;
                    const progress = getDiscountProgress(deal);

                    const getUniqueKey = (deal: Product, idx: number) => {
                        if (deal._id && String(deal._id).trim()) return String(deal._id);
                        return `deal-${idx}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
                    };
                    return (
                        <SwiperSlide
                            key={getUniqueKey(deal, idx)}
                            className="!w-auto pt-10"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -30, scale: 0.8 }}
                                whileHover={{
                                    scale: 1.05,
                                    rotateY: 5,
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                }}
                                transition={{ duration: 0.4 }}
                                className={`relative w-[250px] sm:w-[280px] ${expiring ? 'animate-pulse' : ''
                                    }`}
                            >
                                {/* Deal badge */}
                                <div className="absolute -top-2 right-20 z-20">
                                    <motion.div
                                        className={`px-2 py-1 rounded-full text-xs font-bold ${expiring
                                            ? 'bg-red-500 text-white'
                                            : 'bg-green-500 text-white'
                                            }`}
                                        animate={{
                                            rotate: expiring ? [0, -5, 5, 0] : 0,
                                        }}
                                        transition={{
                                            repeat: expiring ? Infinity : 0,
                                            duration: 0.5,
                                        }}
                                    >
                                        {expiring ? '🔥 ENDING SOON!' : '⚡ HOT DEAL!'}
                                    </motion.div>
                                </div>
                                {/* Progress Ring */}
                                <div className="absolute top-2 left-2 z-20">
                                    <svg
                                        className="w-8 h-8 transform -rotate-90"
                                        viewBox="0 0 36 36"
                                    >
                                        <path
                                            className="text-gray-300"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className="text-red-500"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeDasharray={`${progress}, 100`}
                                            strokeLinecap="round"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                </div>

                                <ProductCard product={deal} isAboveFold={false} />

                                <div className="mt-3 space-y-2">
                                    <CountdownTimer endDate={endDate} />
                                    {v?.discount_percent && (
                                        <div className="text-center">
                                            <span className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                {v.discount_percent}% OFF
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    );
                })}
            </AnimatePresence>
        </Swiper>

        {/* ─── Navigation Buttons ─── */}
        <AnimatePresence>
            {showNav.prev && (
                <motion.div
                    ref={prevRef}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl hover:shadow-2xl flex items-center justify-center cursor-pointer select-none border border-gray-200 dark:border-gray-700"
                >
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </motion.div>
            )}
            {showNav.next && (
                <motion.div
                    ref={nextRef}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl hover:shadow-2xl flex items-center justify-center cursor-pointer select-none border border-gray-200 dark:border-gray-700"
                >
                    <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Autoplay Status Indicator */}
        <div className="fixed bottom-4 right-4 z-50">
            <motion.div
                className={`px-3 py-2 rounded-full text-xs font-medium ${isAutoplayPaused ? 'bg-yellow-500' : 'bg-green-500'
                    } text-white`}
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                {isAutoplayPaused ? '⏸️ Paused' : '▶️ Auto‑playing'}
            </motion.div>
        </div>
    </div>
);