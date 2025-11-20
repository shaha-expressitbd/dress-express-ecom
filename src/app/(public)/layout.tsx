// app/layouts/PublicLayout.tsx
"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/hooks/useSidebar";
import { sidebarRef } from "@/lib/refs";
import { easeInOut, motion } from "framer-motion";
import Header from "@/components/Header";
import Sidebar from "@/components/ui/organisms/sidebar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { TbBrandMessenger } from "react-icons/tb";
interface PublicLayoutProps {
  children: React.ReactNode;
  hideHeaderOnMobile?: boolean;
  hideFooter?: boolean;
}

export default function PublicLayout({
  children,
  hideHeaderOnMobile = false,
  hideFooter = false,
}: PublicLayoutProps) {
  const pathname = usePathname();
  const { isSidebarOpen, isDesktop } = useSidebar();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fallback for SSR
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const transitionConfig = {
    ease: easeInOut,
    duration: 0.3,
  };

  // Check for specific pages
  const isProductDetailPage = pathname?.startsWith("/product/");
  const isCheckOutPage = pathname?.startsWith("/checkout");
  const isAuthPage = pathname?.startsWith("/auth");
  const isShopPage = pathname?.startsWith("/products")


  // Determine if header should be hidden
  const shouldHideHeader = (hideHeaderOnMobile || isProductDetailPage || isCheckOutPage) && isMobile;

  // Determine if footer should be hidden
  const shouldHideFooter = (hideFooter || isCheckOutPage || isAuthPage || isShopPage || isProductDetailPage);

  if (!mounted) return null;

  return (
    <div className="relative min-h-dvh bg-gradient-to-r from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Mobile sidebar */}
      {isMobile && (
        <motion.div
          ref={sidebarRef}
          initial={{ x: "-100%" }}
          animate={{ x: isSidebarOpen ? 0 : "-100%" }}
          transition={transitionConfig}
          className="fixed inset-0 left-0 z-[60] bg-transparent"
        >
          <Sidebar />
        </motion.div>
      )}

      {/* Header - will show on desktop (lg and up) for all pages */}
      {!shouldHideHeader && (
        <header className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </header>
      )}

      {/* Content container with responsive padding */}
      <div className={`flex-grow ${!shouldHideHeader ? "pt-16 lg:pt-16" : ""}`}>
        {children}
      </div>

      {/* Footer - hidden on specific pages */}
      {!shouldHideFooter && <Footer />}
      {/* Sticky Social Icons */}
      <div className="hidden lg:block" >
        <div className=" fixed md:right-4 right-1 md:bottom-16 transform -translate-y-1/2 flex flex-col gap-2 z-50">
          <Link
            href="https://wa.me/+8801886088529
"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-green-500 to-green-700 p-2  rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 ease-in-out"
            aria-label="WhatsApp"
          >
            <FaWhatsapp className="h-8 w-8 text-white" />
          </Link>
          <Link
            href="https://www.facebook.com/messages/t/1002263763137861"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 ease-in-out"
            aria-label="Facebook"
          >
            <TbBrandMessenger className="h-8 w-8 text-white" />
          </Link>
        </div>
      </div>
      <div className="block lg:hidden">
        <div className="fixed md:right-4 right-1 bottom-40 transform -translate-y-1/2 flex flex-col gap-2 z-50">
          <Link
            href="https://wa.me/+8801643039756
"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-green-500 to-green-700 p-1.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 ease-in-out"
            aria-label="WhatsApp"
          >
            <FaWhatsapp className="h-6 w-6 text-white" />
          </Link>
          <Link
            href="https://www.facebook.com/messages/t/319941317859566"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-600 to-blue-800 p-1.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 ease-in-out"
            aria-label="Facebook"
          >
            <TbBrandMessenger className="h-6 w-6 text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
}