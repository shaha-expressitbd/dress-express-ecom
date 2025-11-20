// components/ConditionTabBar.tsx
"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";

interface ConditionTabBarProps {
  options: { value: string; label: string }[];
  selected: string;
  onTabChange: (tab: string) => void;
}

const ConditionTabBar: React.FC<ConditionTabBarProps> = ({
  options,
  selected,
  onTabChange,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // সিলেক্টেড ট্যাবকে মাঝে আনা (SSR-সেফ)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const selectedTab = tabRefs.current[selected];
    if (selectedTab && scrollRef.current) {
      selectedTab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selected]);

  // অ্যারো দেখানো/লুকানো চেক (SSR + Resize + Scroll)
  const updateArrows = useCallback(() => {
    if (!scrollRef.current || typeof window === "undefined") return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const threshold = 5;

    setShowLeftArrow(scrollLeft > threshold);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - threshold);
  }, []);

  useEffect(() => {
    updateArrows(); // Initial check

    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => updateArrows();
    const handleResize = () => updateArrows();

    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Initial check after mount
    const raf = requestAnimationFrame(() => updateArrows());

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(raf);
    };
  }, [options.length, updateArrows]);

  // ম্যানুয়াল স্ক্রল (SSR-সেফ)
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current || typeof window === "undefined") return;

    const scrollAmount = 220;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col items-center my-2 md:mt-0 mt-20">
      {/* Full Slider Container */}
      <div className="relative w-full max-w-7xl mx-auto">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 ${showLeftArrow
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
            }`}
          aria-label="Scroll left"
        >
          <BiLeftArrow className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>

        {/* Scrollable Tabs */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto px-[56px] py-2 scrollbar-hide scroll-smooth"
          style={{
            scrollSnapType: "x mandatory",
            scrollPadding: "0 1rem",
          }}
        >
          {options
            .filter((o) => o.value)
            .map((opt) => (
              <button
                key={opt.value}
                ref={(el) => { tabRefs.current[opt.value] = el; }}
                onClick={() => onTabChange(opt.value)}
                className={`
                  px-5 py-2.5 rounded-full text-sm font-medium capitalize whitespace-nowrap
                  transition-all duration-300 transform hover:scale-105
                  flex-shrink-0 min-w-fit
                  scroll-snap-align-center
                  ${selected === opt.value
                    ? "bg-primary text-white shadow-lg ring-2 ring-primary/30"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }
                `}
              >
                {opt.label}
              </button>
            ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 ${showRightArrow
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
            }`}
          aria-label="Scroll right"
        >
          <BiRightArrow className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
      </div>
    </div>
  );
};

export default ConditionTabBar;