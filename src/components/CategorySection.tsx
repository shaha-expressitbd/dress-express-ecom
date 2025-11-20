"use client";
import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { useBusiness } from "@/hooks/useBusiness";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Swiper as SwiperType } from "swiper";

// Define TypeScript interfaces for type safety
interface SubCategory {
    _id: string;
    name: string;
    image?: { optimizeUrl?: string };
}

interface Category {
    _id: string;
    name: string;
    image?: { optimizeUrl?: string };
    children?: SubCategory[];
}

interface BusinessData {
    categories: Category[];
}

export default function CategorySection() {
    const { businessData } = useBusiness() as {
        businessData: BusinessData | null;
    };
    const router = useRouter();

    // Extract all subcategories from categories
    const SUBCATEGORIES: SubCategory[] =
        businessData?.categories
            ?.flatMap((category) => category.children || [])
            ?.filter((subcategory) => subcategory.name !== "Customer Reviews") || [];

    const categorySliderRef = useRef<SwiperType | null>(null);
    const [isDark, setIsDark] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    const DEFAULT_IMAGE = "/assets/placeholder-category.jpg";

    // Check for dark mode
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        checkDarkMode();

        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const getSubCategoryImage = (subcategory: SubCategory): string => {
        if (subcategory.image?.optimizeUrl?.includes("https")) {
            return `${subcategory.image?.optimizeUrl}`;
        }
        return `${process.env.NEXT_PUBLIC_IMAGE_URL}${subcategory.image?.optimizeUrl}`;
    };

    const handleSubCategoryClick = (subCategoryName: string) => {
        router.push(
            `/category/${encodeURIComponent(subCategoryName.toLowerCase())}`
        );
    };

    return (
        <section
            className={`
                relative w-full pt-16 pb-4 md:pb-0 md:py-6 lg:py-8 overflow-hidden transition-all duration-700
                ${isDark
                    ? "bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900"
                    : "bg-gradient-to-r from-pink-50 via-white to-purple-50"
                }
            `}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className={`
                        absolute top-1/2 left-0 w-full h-32 transform -translate-y-1/2 
                        bg-gradient-to-r from-pink-500/8 via-purple-500/8 to-pink-500/8 blur-3xl
                    `}
                ></div>
            </div>

            <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-4">
                {/* Auto-Sliding Subcategories */}
                <Swiper
                    onSwiper={(swiper) => (categorySliderRef.current = swiper)}
                    slidesPerView="auto"
                    spaceBetween={15}
                    centeredSlides={false}
                    loop={SUBCATEGORIES.length > 5}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    speed={800}
                    allowTouchMove={true}
                    grabCursor={true}
                    modules={[Autoplay]}
                    className="w-full"
                    breakpoints={{
                        0: { spaceBetween: 10 },
                        640: { spaceBetween: 12 },
                        1024: { spaceBetween: 15 },
                    }}
                >
                    {SUBCATEGORIES.map((subcategory, index) => (
                        <SwiperSlide
                            key={subcategory._id || index}
                            style={{ width: "auto", maxWidth: "180px" }}
                        >
                            <div
                                className="group cursor-pointer flex flex-col items-center gap-3 py-4 px-3"
                                onClick={() => handleSubCategoryClick(subcategory.name)}
                                onMouseEnter={() => setHoveredCategory(subcategory._id)}
                                onMouseLeave={() => setHoveredCategory(null)}
                            >
                                {/* Subcategory Image */}
                                <div className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden">
                                    <Image
                                        src={getSubCategoryImage(subcategory)}
                                        alt={`${subcategory.name} subcategory`}
                                        fill
                                        className="object-cover rounded-full transition-all duration-700 group-hover:scale-110"
                                        style={{ objectFit: "cover", aspectRatio: "1/1" }}
                                        quality={85}
                                        loading="lazy"
                                    />
                                    {/* Image Overlay */}
                                    <div
                                        className={`
                                            absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                            bg-gradient-to-br from-pink-500/30 via-purple-600/20 to-transparent rounded-full
                                        `}
                                    ></div>
                                </div>

                                {/* Subcategory Name */}
                                <div className="flex flex-col items-center justify-center min-w-0 w-full max-w-[120px] sm:max-w-[140px] md:max-w-[160px] lg:max-w-[180px]">
                                    <h3
                                        className={`
                                            text-xs sm:text-sm font-semibold tracking-wide text-center leading-tight
                                            overflow-hidden text-ellipsis line-clamp-2 uppercase
                                            ${isDark
                                                ? "text-gray-200 group-hover:text-pink-300"
                                                : "text-gray-700 group-hover:text-pink-600"
                                            }
                                        `}
                                        style={{ maxHeight: "2.8rem" }}
                                    >
                                        {subcategory.name}
                                    </h3>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Decorative Elements */}
                <div className="flex justify-center mt-2 gap-1">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`
                                w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-1000
                                ${i === 2
                                    ? "bg-gradient-to-r from-pink-500 to-purple-500 scale-125"
                                    : "bg-pink-300/60 scale-100"
                                }
                            `}
                            style={{
                                animationDelay: `${i * 0.3}s`,
                                animation: "pulse 3s ease-in-out infinite",
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
        </section>
    );
}
