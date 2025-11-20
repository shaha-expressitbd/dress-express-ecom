'use client';
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useBusiness } from '@/hooks/useBusiness';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HeroSection() {
  const { businessData } = useBusiness();
  const router = useRouter();
  const CATEGORIES = businessData?.categories.slice(0, 5) ?? [];
  const progressCircle = useRef<SVGSVGElement | null>(null);
  const progressContent = useRef<HTMLSpanElement | null>(null);

  const DEFAULT_IMAGE = '/assets/placeholder.webp';

  // Function to get a fallback image from subcategories if the main category lacks an image
  const getCategoryImage = (category: any) => {
    if (category.image?.optimizeUrl) {
      return category.image.optimizeUrl;
    }
    const subCategoryWithImage = category.children?.find((child: any) => child.image?.optimizeUrl);
    return subCategoryWithImage?.image?.optimizeUrl || DEFAULT_IMAGE;
  };

  const onAutoplayTimeLeft = (_: import('swiper').Swiper, time: number, progress: number) => {
    if (progressCircle.current && progressContent.current) {
      progressCircle.current.style.setProperty('--progress', String(1 - progress));
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };


  return (
    <div className="">
      <div className="relative w-full overflow-hidden h-[260px] md:h-[600px] lg:h-[600px] ">
        <section className="w-full h-full">
          <Swiper
            spaceBetween={0}
            centeredSlides={true}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            onAutoplayTimeLeft={onAutoplayTimeLeft}
            className="mySwiper w-full h-full"
          >
            {[
              { src: '/assets/banner/1.webp', alt: 'Hero Necklace' },
              { src: '/assets/banner/2.webp', alt: 'Bracelet' },
              { src: '/assets/banner/3.webp', alt: 'Earrings' },

            ].map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full flex flex-col md:flex-row items-center">
                  <div className="w-full h-full">
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority={index === 0} // Priority for the first slide only
                      quality={80} // Slightly reduced quality for faster loading
                      loading={index === 0 ? 'eager' : 'lazy'} // Lazy load non-critical slides
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </div>
    </div>
  );
}