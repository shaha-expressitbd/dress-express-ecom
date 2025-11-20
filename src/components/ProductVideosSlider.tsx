"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
    FaPlay,
    FaPause,
    FaVolumeUp,
    FaVolumeMute,
    FaChevronLeft,
    FaChevronRight,
    FaShoppingCart,
    FaExpand
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { MdHd } from "react-icons/md";
import { IoPlayCircle } from "react-icons/io5";

interface Video {
    _id: string;
    video?: {
        secure_url: string;
        public_id: string;
    };
    alterVideo?: {
        secure_url: string;
        public_id: string;
    };
}

interface Image {
    _id: string;
    image: {
        secure_url: string;
        public_id: string;
        optimizeUrl?: string;
    };
    alterImage: {
        secure_url: string;
        public_id: string;
        optimizeUrl?: string;
    };
}

interface Product {
    _id: string;
    name: string;
    category: string;
    price?: string;
    selling_price?: number;
    total_stock?: number;
    isPublish?: boolean;
    hasVariants?: boolean;
    isPreOrder?: boolean;
    video?: Video[];
    images?: Image[];
    variantsId?: Array<{
        _id: string;
        image: Image;
        variants_stock: number;
        selling_price: number;
        offer_price: number;
        discount_start_date?: string;
        discount_end_date?: string;
        condition?: string;
        isPreOrder?: boolean;
    }>;
}

interface ProductVideosSliderProps {
    products: Product[];
}

export default function ProductVideosSlider({ products }: ProductVideosSliderProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [playingVideos, setPlayingVideos] = useState<string[]>([]);
    const [mutedVideos, setMutedVideos] = useState<{ [key: string]: boolean }>({});
    const [videoProgress, setVideoProgress] = useState<{ [key: string]: number }>({});
    const [videoDurations, setVideoDurations] = useState<{ [key: string]: number }>({});
    const [windowWidth, setWindowWidth] = useState(0);

    const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";

    // Filter products with videos
    const videoProducts = useMemo(() =>
        products.filter(
            (p: Product) => p.video?.[0]?.alterVideo?.secure_url || p.video?.[0]?.video?.secure_url
        ),
        [products]
    );

    // Responsive grid config
    const getGridConfig = useCallback(() => {
        if (windowWidth >= 1024) return { itemsPerPage: 5, columns: 5 };
        if (windowWidth >= 768) return { itemsPerPage: 4, columns: 2 };
        return { itemsPerPage: 2, columns: 2 };
    }, [windowWidth]);

    const { itemsPerPage, columns } = getGridConfig();
    const totalPages = Math.ceil(videoProducts.length / itemsPerPage);

    // Resize handler
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Initialize muted state
    useEffect(() => {
        const muted: { [key: string]: boolean } = {};
        videoProducts.forEach(product => {
            muted[product._id] = true;
        });
        setMutedVideos(muted);
    }, [videoProducts]);

    // Get current page products
    const getCurrentPageProducts = useCallback(() => {
        const startIndex = currentPage * itemsPerPage;
        return videoProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage, videoProducts, itemsPerPage]);

    // Video handlers
    const handleVideoLoad = useCallback((productId: string) => {
        const video = videoRefs.current[productId];
        if (video) {
            setVideoDurations(prev => ({
                ...prev,
                [productId]: video.duration
            }));
        }
    }, []);

    const handleTimeUpdate = useCallback((productId: string) => {
        const video = videoRefs.current[productId];
        if (video && video.duration) {
            const progress = (video.currentTime / video.duration) * 100;
            setVideoProgress(prev => ({
                ...prev,
                [productId]: progress
            }));
        }
    }, []);

    const handleVideoEnd = useCallback((productId: string) => {
        setPlayingVideos(prev => prev.filter(id => id !== productId));
        setVideoProgress(prev => ({
            ...prev,
            [productId]: 0
        }));
    }, []);

    const togglePlay = useCallback((productId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const video = videoRefs.current[productId];
        if (!video) return;

        if (playingVideos.includes(productId)) {
            video.pause();
            setPlayingVideos(prev => prev.filter(id => id !== productId));
        } else {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setPlayingVideos(prev => {
                            if (!prev.includes(productId)) {
                                return [...prev, productId];
                            }
                            return prev;
                        });
                    })
                    .catch(error => {
                        if (error.name !== 'AbortError') {
                            console.warn(`Playback failed for ${productId}:`, error);
                        }
                    });
            }
        }
    }, [playingVideos]);

    const toggleMute = useCallback((productId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const video = videoRefs.current[productId];
        if (video) {
            const newMutedState = !mutedVideos[productId];
            video.muted = newMutedState;
            setMutedVideos(prev => ({
                ...prev,
                [productId]: newMutedState
            }));
        }
    }, [mutedVideos]);

    const toggleFullscreen = useCallback((productId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const video = videoRefs.current[productId];
        if (video) {
            if (!document.fullscreenElement) {
                video.requestFullscreen().catch(err => {
                    console.error('Fullscreen failed:', err);
                });
            } else {
                document.exitFullscreen();
            }
        }
    }, []);

    const handleProductClick = useCallback((product: Product) => {
        const slugify = (name: string) =>
            name
                .toLowerCase()
                .replace(/[অ-হ]/g, (c) => {
                    const map: Record<string, string> = {
                        অ: "o", আ: "a", ই: "i", ঈ: "i", উ: "u", ঊ: "u", ঋ: "ri", এ: "e", ঐ: "oi", ও: "o", ঔ: "ou",
                        ক: "k", খ: "kh", গ: "g", ঘ: "gh", চ: "c", ছ: "ch", জ: "j", ঝ: "jh", ট: "t", ঠ: "th",
                        ড: "d", ঢ: "dh", ণ: "n", ত: "t", থ: "th", দ: "d", ধ: "dh", ন: "n", প: "p", ফ: "ph",
                        ব: "b", ভ: "bh", ম: "m", য: "j", র: "r", ল: "l", শ: "s", ষ: "sh", স: "s", হ: "h"
                    };
                    return map[c] || c;
                })
                .replace(/\s+/g, "-")
                .replace(/[^\w-]+/g, "")
                .replace(/--+/g, "-")
                .replace(/^-+|-+$/g, "");

        const productLink = `/product/${slugify(product.name)}?id=${product._id}`;
        window.location.href = productLink;
    }, []);

    const nextPage = useCallback(() => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
            setPlayingVideos([]);
            Object.values(videoRefs.current).forEach(video => video?.pause());
        }
    }, [currentPage, totalPages]);

    const prevPage = useCallback(() => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
            setPlayingVideos([]);
            Object.values(videoRefs.current).forEach(video => video?.pause());
        }
    }, [currentPage]);

    // ✅ Fixed: observerCallback is memoized and safe
    const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const currentProducts = getCurrentPageProducts();
                currentProducts.forEach((product) => {
                    const productId = product._id;
                    const video = videoRefs.current[productId];

                    if (video && !playingVideos.includes(productId)) {
                        const playPromise = video.play();
                        if (playPromise !== undefined) {
                            playPromise
                                .then(() => {
                                    setPlayingVideos(prev => {
                                        if (!prev.includes(productId)) {
                                            return [...prev, productId];
                                        }
                                        return prev;
                                    });
                                })
                                .catch(error => {
                                    if (error.name !== 'AbortError') {
                                        console.warn(`Auto-play blocked for ${productId}:`, error);
                                    }
                                });
                        }
                    }
                });
            } else {
                // Only pause videos that are actually playing
                Object.entries(videoRefs.current).forEach(([id, video]) => {
                    if (video && playingVideos.includes(id)) {
                        video.pause();
                    }
                });
                setPlayingVideos([]);
            }
        });
    }, [getCurrentPageProducts, playingVideos]);

    // ✅ Fixed: useEffect with proper dependencies
    useEffect(() => {
        const observer = new IntersectionObserver(observerCallback, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [observerCallback]); // Only depends on memoized callback

    if (videoProducts.length === 0) {
        return null;
    }

    const currentProducts = getCurrentPageProducts();

    return (
        <div
            ref={containerRef}
            className="bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 relative overflow-hidden py-8"
        >
            {/* Animated Background */}
            {/* <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div> */}

            {/* Header */}
            <div className="relative z-10 px-4 lg:px-8 ">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="md:p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                            <IoPlayCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Video Collection
                            </h1>
                            <p className="text-gray-300 text-sm lg:text-base md:block hidden">Discover amazing products through videos</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-lg rounded-xl px-4 py-2 border border-white/10">
                        <HiSparkles className="w-5 h-5 text-yellow-400" />
                        <span className="text-white font-semibold">{videoProducts.length} Videos</span>
                    </div>
                </div>

                {/* Page Navigation */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center mb-8 space-x-4">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 0}
                            className={`p-3 rounded-full border transition-all duration-300 ${currentPage === 0
                                ? 'bg-gray-800/50 border-gray-600 text-gray-500 cursor-not-allowed'
                                : 'bg-black/30 backdrop-blur-lg border-white/20 text-white hover:bg-black/50 hover:scale-110'
                                }`}
                        >
                            <FaChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-lg rounded-full px-6 py-3 border border-white/10">
                            <span className="text-white font-semibold">{currentPage + 1}</span>
                            <span className="text-gray-400">of</span>
                            <span className="text-white font-semibold">{totalPages}</span>
                        </div>

                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages - 1}
                            className={`p-3 rounded-full border transition-all duration-300 ${currentPage === totalPages - 1
                                ? 'bg-gray-800/50 border-gray-600 text-gray-500 cursor-not-allowed'
                                : 'bg-black/30 backdrop-blur-lg border-white/20 text-white hover:bg-black/50 hover:scale-110'
                                }`}
                        >
                            <FaChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Video Grid */}
            <div className="relative z-10 px-4 lg:px-8 mt-2 md:mt-0">
                <div className={`grid gap-4 lg:gap-6 max-w-7xl mx-auto ${columns === 5 ? 'grid-cols-5' : 'grid-cols-2'}`}>
                    {currentProducts.map((product) => {
                        const videoUrl = product?.video?.[0]?.alterVideo?.secure_url
                            ? `${imageUrl}${product.video[0].alterVideo.secure_url}`
                            : product?.video?.[0]?.video?.secure_url ?? "";

                        const firstImage = product?.variantsId?.[0]?.image?.alterImage?.secure_url
                            ? `${imageUrl}${product.variantsId[0].image.alterImage.secure_url}`
                            : product?.images?.[0]?.alterImage?.secure_url
                                ? `${imageUrl}${product.images[0].alterImage.secure_url}`
                                : "";

                        const isPlaying = playingVideos.includes(product._id);
                        const progress = videoProgress[product._id] || 0;
                        const duration = videoDurations[product._id] || 0;
                        const isMuted = mutedVideos[product._id] ?? true;

                        return (
                            <div
                                key={product._id}
                                className="group relative bg-black/20 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
                                onClick={() => handleProductClick(product)}
                            >
                                {/* Video Container */}
                                <div className="relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden">
                                    {/* Background Image */}
                                    {firstImage && (
                                        <img
                                            src={firstImage}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            alt={product.name}
                                            loading="lazy"
                                        />
                                    )}

                                    {/* Video Element */}
                                    {videoUrl && (
                                        <video
                                            ref={(el) => { videoRefs.current[product._id] = el; }}
                                            src={videoUrl}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            muted={isMuted}
                                            onLoadedData={() => handleVideoLoad(product._id)}
                                            onTimeUpdate={() => handleTimeUpdate(product._id)}
                                            onEnded={() => handleVideoEnd(product._id)}
                                            preload="auto"
                                            playsInline
                                            loop={false}
                                        />
                                    )}

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>

                                    {/* HD Badge */}
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                                            <MdHd className="w-4 h-4 text-white" />
                                        </div>
                                    </div>

                                    {/* Center Play Button */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <button
                                            onClick={(e) => togglePlay(product._id, e)}
                                            className={`transition-all duration-300 ${isPlaying
                                                ? 'opacity-0 group-hover:opacity-100'
                                                : 'opacity-100'
                                                }`}
                                        >
                                            <div className="relative">
                                                {isPlaying ? (
                                                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 hover:scale-110 transition-all duration-300">
                                                        <FaPause className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/30">
                                                        <FaPlay className="w-6 h-6 lg:w-8 lg:h-8 text-white ml-1" />
                                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    </div>

                                    {/* Bottom Controls */}
                                    <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4">
                                        {/* Progress Bar */}
                                        {isPlaying && progress > 0 && (
                                            <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-1 mb-3">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            {/* Left Controls */}
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={(e) => toggleMute(product._id, e)}
                                                    className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-all duration-300 hover:scale-110"
                                                >
                                                    {isMuted ? (
                                                        <FaVolumeMute className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                                                    ) : (
                                                        <FaVolumeUp className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                                                    )}
                                                </button>

                                                {duration > 0 && (
                                                    <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                                                        <span className="text-white text-xs">
                                                            {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right Controls */}
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={(e) => toggleFullscreen(product._id, e)}
                                                    className="p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 hover:scale-110 transition-all duration-300"
                                                >
                                                    <FaExpand className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-2 lg:p-5 bg-black/30 backdrop-blur-lg">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 pr-3">
                                            <h3 className="text-sm lg:text-lg font-bold text-white line-clamp-2 mb-1 ">
                                                {product.name ? product.name.slice(0, 16) + "..." : "No name available"}
                                            </h3>
                                            <p className="text-xs lg:text-sm text-gray-400 mb-2">{product.category}</p>
                                        </div>

                                        {product.price && (
                                            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1.5 rounded-lg">
                                                <span className="text-white font-bold text-xs lg:text-sm">{product.price}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex justify-center pt-3 border-t border-white/10">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleProductClick(product);
                                            }}
                                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 md:px-4 px-1 lg:px-6 py-2 lg:py-3 rounded-full text-white font-semibold text-sm lg:text-base transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn w-full justify-center"
                                        >
                                            <FaShoppingCart className="w-4 h-4 group-hover/btn:scale-110 hidden md:block" />
                                            <span>View Product</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Page Dots Indicator */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8 space-x-3">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentPage(index);
                                    setPlayingVideos([]);
                                    Object.values(videoRefs.current).forEach(video => video?.pause());
                                }}
                                className={`transition-all duration-300 ${index === currentPage
                                    ? 'w-10 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full'
                                    : 'w-4 h-4 bg-white/30 hover:bg-white/50 rounded-full hover:scale-125'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Bottom Info */}
                <div className="text-center mt-8 text-gray-400">
                    <p className="text-sm">
                        Showing {currentProducts.length} of {videoProducts.length} videos
                        {windowWidth >= 1024 && " • Click to view product details"}
                        {windowWidth < 1024 && " • Tap to explore"}
                    </p>
                </div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute top-1/4 right-10 w-2 h-2 bg-blue-400/60 rounded-full animate-ping hidden lg:block"></div>
            <div className="absolute bottom-1/3 left-10 w-3 h-3 bg-purple-400/60 rounded-full animate-ping hidden lg:block" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-pink-400/60 rounded-full animate-ping hidden lg:block" style={{ animationDelay: '3s' }}></div>


        </div>
    );
}