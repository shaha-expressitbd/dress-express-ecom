"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import type { Swiper as SwiperClass } from "swiper/types";
import Link from "next/link";

const HeroCarousel = ({ slides = [], autoplayDelay = 4000, showNavigation = true, effect = "slide" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const swiperRef = useRef<SwiperClass | null>(null);

  // Default slides data if no props provided
  const defaultSlides = [
    {
      id: 1,
      discount: "৫০%",
      title: "ঐতিহ্যবাহী বাংলা শাড়ি",
      description: "খাঁটি কটন এবং সিল্কের তৈরি প্রিমিয়াম শাড়ির বিশাল কালেকশন। বিশেষ উৎসবের জন্য পারফেক্ট পছন্দ।",
      buttonText: "কালেকশন দেখুন",
      image: "/assets/banner/3.webp",
      bgColor: "bg-gradient-to-r from-pink-100 to-pink-200 dark:from-gray-700 dark:to-gray-800",
      textColor: "text-gray-600 dark:text-white",
      accentColor: "text-blue-600",
      link: "/products/sarees",
      badge: "বিশেষ ছাড়"
    },
    {
      id: 2,
      discount: "৩০%",
      title: "পুরুষদের ফ্যাশন কালেকশন",
      description: "আধুনিক এবং ঐতিহ্যবাহী পুরুষদের পোশাকের অসাধারণ সংগ্রহ। আরামদায়ক এবং স্টাইলিশ ডিজাইন।",
      buttonText: "কালেকশন দেখুন",
      image: "/assets/banner/7.png",
      bgColor: "bg-gradient-to-r from-purple-100 to-purple-200 dark:from-gray-700 dark:to-gray-800",
      textColor: "text-gray-600 dark:text-white",
      accentColor: "text-green-600",
      link: "/products/mens",
      badge: "নতুন কালেকশন"
    },
    {
      id: 3,
      discount: "৪০%",
      title: "ডিজাইনার কুর্তা সেট",
      description: "হ্যান্ডব্লক প্রিন্ট এবং এমব্রয়ডারি কাজের সুন্দর কুর্তা। দৈনন্দিন এবং বিশেষ অনুষ্ঠানের জন্য আদর্শ।",
      buttonText: "অর্ডার করুন",
      image: "/assets/banner/4.webp",
      bgColor: "bg-gradient-to-r from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-800",
      textColor: "text-gray-600 dark:text-white",
      accentColor: "text-purple-600",
      link: "/products/kurtas",
      badge: "ট্রেন্ডিং"
    }
  ];

  const slidesData = slides.length > 0 ? slides : defaultSlides;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  interface SlideData {
    id?: number | string;
    discount: string;
    title: string;
    description: string;
    buttonText: string;
    image: string;
    bgColor: string;
    textColor: string;
    accentColor: string;
    link?: string;
    badge?: string;
  }

  interface HeroCarouselProps {
    slides?: SlideData[];
    autoplayDelay?: number;
    showNavigation?: boolean;
    effect?: "slide" | "fade" | "cube" | "coverflow" | "flip";
  }

  const handleSlideChange = (swiper: SwiperClass) => {
    setCurrentSlide(swiper.realIndex ?? swiper.activeIndex);
  };

  const toggleAutoplay = () => {
    setIsPlaying(!isPlaying);
    if (swiperRef.current) {
      if (isPlaying) {
        swiperRef.current.autoplay.stop();
      } else {
        swiperRef.current.autoplay.start();
      }
    }
  };

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="bg-white dark:bg-gray-800 font-medium">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 h-1 bg-white dark:bg-gray-800">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-linear"
          style={{
            width: `${((currentSlide + 1) / slidesData.length) * 100}%`
          }}
        />
      </div>

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
        {currentSlide + 1} / {slidesData.length}
      </div>

      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={isPlaying ? {
          delay: autoplayDelay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        } : false}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-blue-600',
          bulletClass: 'swiper-pagination-bullet !bg-white/50 !w-3 !h-3 !mx-2',
        }}
        navigation={false} // Disable default navigation as we're using custom buttons
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect={effect}
        fadeEffect={{
          crossFade: true
        }}
        className="hero-carousel h-full"
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        loop={true}
        speed={800}
      >
        {slidesData.map((slide, index) => (
          <SwiperSlide key={slide.id || index} className={slide.bgColor}>
            <div className="grid grid-cols-12 md:gap-4 gap-2 items-center h-full min-h-[400px] lg:min-h-[550px] relative overflow-hidden p-4 sm:p-6 lg:p-8 ">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full transform translate-x-48 -translate-y-48"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full transform -translate-x-32 translate-y-32"></div>
              </div>

              {/* Content Section */}
              <div className="col-span-12 sm:col-span-7 relative z-10">
                {/* Badge */}
                {slide.badge && (
                  <div className="inline-block bg-yellow-400 text-gray-600 dark:text-white px-3 py-1 rounded-full text-sm font-bold mb-4 animate-pulse">
                    {slide.badge}
                  </div>
                )}

                {/* Discount Section */}
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
                  <span className={`block font-black text-3xl sm:text-4xl lg:text-5xl xl:text-6xl ${slide.accentColor} drop-shadow-lg`}>
                    {slide.discount}
                  </span>
                  <span className={`block ${slide.textColor} text-gray-600 dark:text-white sm:text-lg lg:text-xl font-semibold leading-tight`}>
                    পর♀ন্ত
                    <br />
                    ছাড়
                  </span>
                </div>

                {/* Title */}
                <h1 className={`font-black ${slide.textColor} text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-3 sm:mb-4 leading-tight`}>
                  <a
                    href={slide.link || "#"}
                    className={`hover:${slide.accentColor} transition-all duration-300 hover:scale-105 inline-block`}
                  >
                    {slide.title}
                  </a>
                </h1>

                {/* Description */}
                <p className={`${slide.textColor} opacity-90 mb-4 sm:mb-6 text-sm text-black dark:text-white lg:text-lg leading-relaxed max-w-lg`}>
                  {slide.description}
                </p>

                {/* CTA Button */}
                <Link
                  href="/products"
                  className={`inline-flex items-center gap-2 font-bold text-white text-sm lg:text-lg rounded-lg bg-gray-900 hover:bg-blue-600 py-2 px-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group text-nowrap`}
                >
                  {slide.buttonText}
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* Image Section */}
              <div className="col-span-12 sm:col-span-5 flex items-center justify-center relative">
                <div className="relative w-full h-full max-w-[280px] sm:max-w-[350px] max-h-[420px] group">
                  <div className="absolute inset-0 rounded-xl"></div>
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    width={400}
                    height={500}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-all duration-500"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />

                  {/* Image Overlay Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      {showNavigation && (
        <>
          <button
            onClick={handlePrev}
            className="swiper-button-prev-custom absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 text-gray-900 p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="swiper-button-next-custom absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 text-gray-900 p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <style jsx global>{`
        .hero-carousel .swiper-pagination {
          bottom: 20px !important;
        }
        .hero-carousel .swiper-pagination-bullet {
          transition: all 0.3s ease !important;
        }
        .hero-carousel .swiper-pagination-bullet:hover {
          transform: scale(1.2) !important;
        }
        .hero-carousel .swiper-button-next,
        .hero-carousel .swiper-button-prev {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;