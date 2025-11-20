"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/hooks/useSidebar";
import { navbarRef } from "@/lib/refs";
import Logo from "../atoms/logo";
import { SidebarToggler } from "../molecules/sidebarToggler";
import ThemeToggler from "../molecules/themeToggler";
import { CartSheet } from "../organisms/cart-sheet";
import { useBusiness } from "@/hooks/useBusiness";
import { WishlistSheet } from "./WishlistSheet";
import { FaHome, FaShoppingBag, FaBullhorn } from "react-icons/fa";
import { CategoryDropdown } from "../atoms/CategoryDropdown";
import { NavGroup } from "@/config/routes.config";
import { useProducts } from "@/hooks/useProducts";
import { UniversalSearch, useSearch } from "../atoms/Search";

// Menu items configuration
export const menuItems: NavGroup[] = [
  { title: "Home", path: "/", icon: FaHome },
  { title: "Shop", path: "/products", icon: FaShoppingBag },
  { title: "Pre-Order", path: "/preorder", icon: FaBullhorn },
];

export interface NavbarProps {
  className?: string;
}

// Navbar Component (Snippet)
export const Navbar = ({ className }: { className?: string }) => {
  const { isDesktop } = useSidebar();
  const [isScrolled, setIsScrolled] = useState(false);
  const { businessData } = useBusiness();
  const { products } = useProducts();
  const pathname = usePathname();
  const categories = businessData?.categories || [];

  const { searchTerm, setSearchTerm, isSearchOpen, setIsSearchOpen, suggestions } = useSearch(products, categories);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActiveMenu = useCallback(
    (item: NavGroup) => {
      if (item.path === "/") return pathname === "/";
      return pathname.startsWith(item.path || "#");
    },
    [pathname]
  );

  return (
    <nav
      ref={navbarRef}
      className={`w-full z-30 sticky top-0 transition-all duration-300 ${isScrolled
        ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700"
        : "bg-white dark:bg-gray-900"
        } ${className || ""}`}
    >
      {/* Mobile Layout */}
      <div className="lg:hidden px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {!isDesktop && <SidebarToggler />}
            <Link href="/" className="transition-transform duration-200 hover:scale-105">
              <Logo />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <UniversalSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              suggestions={suggestions}
              isOpen={isSearchOpen}
              setIsOpen={setIsSearchOpen}
              isMobile={true}
            />
            <CartSheet />
            <WishlistSheet />
            <ThemeToggler />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block px-6 py-2">
        <div className="grid grid-cols-3 items-center gap-8">
          {/* Left - Menu Items */}
          <div className="flex items-center gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.path || "#"}
                className={`flex items-center gap-2 font-semibold text-sm whitespace-nowrap transition-all duration-200 hover:scale-105 ${isActiveMenu(item)
                  ? "text-primary"
                  : "text-gray-700 dark:text-gray-300 hover:text-primary"
                  }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.title.toUpperCase()}
              </Link>
            ))}
          </div>

          {/* Center - Logo */}
          <div className="flex justify-center">
            <Link href="/" className="transition-transform duration-200 hover:scale-110">
              {/* <Logo /> */}
            </Link>
          </div>

          {/* Right - Categories, Search, Actions */}
          <div className="flex items-center justify-end gap-4">
            <CategoryDropdown categories={categories} />
            <UniversalSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              suggestions={suggestions}
              isOpen={isSearchOpen}
              setIsOpen={setIsSearchOpen}
            />
            <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-700">
              <CartSheet />
              <WishlistSheet />
              <ThemeToggler />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};