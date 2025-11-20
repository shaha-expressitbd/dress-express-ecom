"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import {
    BiChevronLeft,
    BiChevronRight,
    BiZoomIn,
    BiPlay,
    BiChevronDown,
    BiChevronUp,
} from "react-icons/bi";
import { FiEye } from "react-icons/fi";
import { LiveViews } from "./Liveviews";

export interface MediaItem {
    type: "image" | "video";
    url: string;
    public_id?: string;
    _id: string;
}

interface MediaGalleryProps {
    media: MediaItem[];
    productName: string;
    stock: number;
    selectedMediaUrl?: string;
    isPreOrder?: boolean;
}

export default function MediaGallery({
    media,
    productName,
    stock,
    selectedMediaUrl,
    isPreOrder,
}: MediaGalleryProps) {
    /* ------------------------------------------------------------------ */
    /*  State & refs                                                      */
    /* ------------------------------------------------------------------ */
    const posterUrl = media.find((m) => m.type === "image")?.url ?? media[0].url;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [mainMedia, setMainMedia] = useState<MediaItem>(media[0]);

    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

    const [imageLoading, setImageLoading] = useState(media[0].type === "image");
    const [videoLoaded, setVideoLoaded] = useState(
        media[0].type === "video" ? false : true
    );
    const [isPlayingVideo, setIsPlayingVideo] = useState(
        media[0].type === "video"
    );

    const [isMobile, setIsMobile] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const lastSlideChange = useRef<number>(0);
    /* ------------------------------------------------------------------ */
    /*  Helpers                                                           */
    /* ------------------------------------------------------------------ */
    const isSameSrc = useCallback(
        (item: MediaItem) => item.url === mainMedia.url,
        [mainMedia.url]
    );

    /** শুধু index বদলালেও হাইলাইট বদলাবো, কিন্তু URL একই থাকলে heavy state আপডেট করব না */
    const changeSlide = useCallback(
        (idx: number) => {
            if (idx === currentIndex) return; // একই index → কিছু করার দরকার নেই

            setCurrentIndex(idx);

            // নতুন URL হলে পুরো স্টেট আপডেট
            if (!isSameSrc(media[idx])) {
                setMainMedia(media[idx]);
                setVideoLoaded(media[idx].type === "video" ? false : true);
                setIsPlayingVideo(media[idx].type === "video");
                setImageLoading(media[idx].type === "image");
            }
        },
        [currentIndex, media, isSameSrc]
    );

    const goToSlide = (dir: "next" | "prev") => {
        console.log("goToSlide called with direction:", dir); // Debugging
        const now = Date.now();
        if (now - lastSlideChange.current < 300) return; // Ignore if called within 300ms
        lastSlideChange.current = now;

        const newIdx =
            dir === "next"
                ? (currentIndex + 1) % media.length
                : (currentIndex - 1 + media.length) % media.length;
        changeSlide(newIdx);
    };

    /* ------------------------------------------------------------------ */
    /*  Effects                                                           */
    /* ------------------------------------------------------------------ */
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!isSameSrc(media[0])) {
            setMainMedia(media[0]);
            setCurrentIndex(0);
            setVideoLoaded(media[0].type === "video" ? false : true);
            setIsPlayingVideo(media[0].type === "video");
            setImageLoading(media[0].type === "image");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [media]);

    useEffect(() => {
        if (!selectedMediaUrl || selectedMediaUrl === mainMedia.url) return;
        const idx = media.findIndex((m) => m.url === selectedMediaUrl);
        if (idx > -1) changeSlide(idx);
    }, [selectedMediaUrl, media, mainMedia.url, changeSlide]);

    useEffect(() => {
        if (mainMedia.type === "video" && videoRef.current) {
            videoRef.current
                .play()
                .then(() => setIsPlayingVideo(true))
                .catch(() => setIsPlayingVideo(false));
        }
    }, [mainMedia]);

    /* Zoom (desktop) */
    const handleImageZoom = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!isZoomed || mainMedia.type !== "image" || isMobile) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setZoomPosition({ x, y });
        },
        [isZoomed, mainMedia.type, isMobile]
    );

    /* Touch swipe (mobile) */
    const onTouchStart = (e: React.TouchEvent) =>
        (touchStartX.current = e.touches[0].clientX);
    const onTouchMove = (e: React.TouchEvent) =>
        (touchEndX.current = e.touches[0].clientX);
    const onTouchEnd = () => {
        const dist = touchStartX.current - touchEndX.current;
        if (dist > 50 && media.length > 1) goToSlide("next");
        if (dist < -50 && media.length > 1) goToSlide("prev");
    };

    /* ------------------------------------------------------------------ */
    /*  Render                                                            */
    /* ------------------------------------------------------------------ */
    return (
        <div
            className={`flex ${isMobile ? "flex-col" : "flex-row"
                } gap-10 w-full ${isMobile ? "h-screen" : ""}`}
        >
            {/* ---------- Thumbnails (desktop) ---------- */}
            {!isMobile && media.length > 1 && (
                <aside className="flex flex-col w-20 md:w-24">
                    {/* Heading */}
                    <div className="flex flex-col items-center mb-2">
                        <h3 className="font-semibold text-sm text-gray-800 dark:text-white flex items-center mb-1">
                            <FiEye className="w-4 h-4 mr-2 text-primary" /> Gallery
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-white">
                            ({media.length})
                        </span>
                    </div>

                    {/* Scroll buttons */}
                    <div className="flex flex-col justify-center items-center space-y-2 mb-2">
                        <button
                            onClick={() =>
                                galleryRef.current?.scrollBy({ top: -100, behavior: "smooth" })
                            }
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                            <BiChevronUp className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() =>
                                galleryRef.current?.scrollBy({ top: 100, behavior: "smooth" })
                            }
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                            <BiChevronDown className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Thumbs list */}
                    <div
                        ref={galleryRef}
                        className="flex flex-col gap-2 overflow-y-auto scrollbar-hide snap-y snap-mandatory h-[500px]"
                    >
                        {media.map((item, idx) => {
                            const isActive = idx === currentIndex;
                            return (
                                <button
                                    key={item._id}
                                    onClick={() => changeSlide(idx)}
                                    className={`relative aspect-square rounded-lg border-2 overflow-hidden shrink-0 ${isActive
                                        ? "border-primary ring-2 ring-primary/30"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    {item.type === "image" ? (
                                        <Image
                                            src={item.url}
                                            alt={`${productName} view ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            onLoad={() => setImageLoading(false)}
                                        />
                                    ) : (
                                        <div className="relative w-full h-full flex items-center justify-center bg-black/5">
                                            <video
                                                src={item.url}
                                                className="absolute inset-0 w-full h-full object-cover"
                                                muted
                                                loop
                                                playsInline
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-6 h-6 bg-primary/90 rounded-full flex items-center justify-center">
                                                    <BiPlay className="w-3 h-3 text-white ml-px" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Active overlay */}
                                    {isActive && (
                                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                            <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                                <FiEye className="w-2 h-2 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </aside>
            )}

            {/* ---------- Main viewer ---------- */}
            <section className={`${isMobile ? "flex-1 w-full" : "flex-1"} relative`}>
                {/* desktop er jonno */}
                {isPreOrder && (
                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 z-20 ${isMobile ? "hidden" : "block"}`}>
                        <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                            Pre-Order
                        </span>
                    </div>
                )}
                <div className={`${isMobile ? "flex-col h-full" : "flex-row"} flex`}>
                    <div
                        className={`relative bg-gray-50 overflow-hidden shadow-lg border border-gray-200 group ${isMobile ? "flex-1 w-full h-full" : "w-full max-w-lg h-[600px]"
                            }`}
                        onMouseEnter={() =>
                            !isMobile && mainMedia.type === "image" && setIsZoomed(true)
                        }
                        onMouseLeave={() =>
                            !isMobile && mainMedia.type === "image" && setIsZoomed(false)
                        }
                        onMouseMove={
                            !isMobile && mainMedia.type === "image"
                                ? handleImageZoom
                                : undefined
                        }
                        onTouchStart={isMobile ? onTouchStart : undefined}
                        onTouchMove={isMobile ? onTouchMove : undefined}
                        onTouchEnd={isMobile ? onTouchEnd : undefined}
                    >
                        {/* ---- Pre-order badge ---- */}
                        {/* mobile er jonon */}
                        {isPreOrder && (
                            <div className={`absolute z-20 ${isMobile ? "top-0 left-1/2 -translate-x-1/2" : "-top-4 left-1/2 -translate-x-1/2"}`}>
                                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                                    Pre-Order
                                </span>
                            </div>
                        )}

                        {/* ---- Image viewer ---- */}
                        {mainMedia.type === "image" && (
                            <>
                                <Image
                                    src={mainMedia.url}
                                    alt={productName}
                                    fill
                                    priority
                                    onLoad={() => setImageLoading(false)}
                                    className={`object-cover duration-300 pointer-events-none ${!isMobile && isZoomed
                                        ? "scale-150"
                                        : !isMobile
                                            ? "scale-105"
                                            : ""
                                        }`}
                                    style={{
                                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                    }}
                                />
                                {imageLoading && (
                                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800/30 animate-pulse" />
                                )}
                                {!isMobile && isZoomed && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg ring-2 ring-white/50">
                                            <BiZoomIn className="w-5 h-5 mr-2 text-primary" />
                                            Zoomed
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* ---- Video viewer ---- */}
                        {mainMedia.type === "video" && (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* মোবাইলে পোস্টার দেখাবো ভিডিও লোড হওয়া পর্যন্ত */}
                                {isMobile && !videoLoaded && (
                                    <Image
                                        src={posterUrl}
                                        alt={`${productName} preview`}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                )}

                                <video
                                    ref={videoRef}
                                    src={mainMedia.url}
                                    className={`${isMobile
                                        ? "w-full h-full object-cover"
                                        : "max-w-full max-h-full object-contain"
                                        } ${isMobile && !videoLoaded ? "opacity-0" : "opacity-100"}`}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    onLoadedData={() => {
                                        setVideoLoaded(true);
                                        videoRef.current?.play().catch(() => null);
                                    }}
                                    onClick={() =>
                                        setIsPlayingVideo((playing) => {
                                            const next = !playing;
                                            next
                                                ? videoRef.current?.play()
                                                : videoRef.current?.pause();
                                            return next;
                                        })
                                    }
                                />
                                {!isPlayingVideo && (
                                    <button
                                        onClick={() => {
                                            setIsPlayingVideo(true);
                                            videoRef.current?.play();
                                        }}
                                        className="absolute inset-0 flex items-center justify-center"
                                        aria-label="Play video"
                                    />
                                )}
                            </div>
                        )}

                        {/* ---- Stock badge ---- */}
                        <div className={`absolute top-2 left-2 z-20 ${isPreOrder ? "top-10" : ""}`}>
                            <span
                                className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full ${stock > 10
                                    ? "bg-green-600"
                                    : stock > 0
                                        ? "bg-amber-500"
                                        : "bg-red-600"
                                    } text-white`}
                            >
                                {stock > 10
                                    ? `${stock} Available`
                                    : stock > 0
                                        ? `Only ${stock} Left!`
                                        : "Out of Stock"}
                            </span>
                        </div>

                        {/* ---- Live views (mobile only) ---- */}
                        <div className={`absolute top-2 right-2 z-20 md:hidden block ${isPreOrder ? "top-10" : ""}`}>
                            <LiveViews initialCount={10} />
                        </div>

                        {/* ---- Mobile nav arrows & dots ---- */}
                        {isMobile && media.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        console.log("Previous button clicked");
                                        goToSlide("prev");
                                    }}
                                    onTouchEnd={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        console.log("Previous button touch ended");
                                        goToSlide("prev");
                                    }}
                                    aria-label="Previous media"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full text-white z-50 flex items-center justify-center pointer-events-auto"
                                >
                                    <BiChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        console.log("Next button clicked");
                                        goToSlide("next");
                                    }}
                                    onTouchEnd={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        console.log("Next button touch ended");
                                        goToSlide("next");
                                    }}
                                    aria-label="Next media"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full text-white z-50 flex items-center justify-center pointer-events-auto"
                                >
                                    <BiChevronRight className="w-4 h-4" />
                                </button>

                                {/* dots */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                                    {media.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-2 h-2 rounded-full ${idx === currentIndex ? "bg-white" : "bg-white/50"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}