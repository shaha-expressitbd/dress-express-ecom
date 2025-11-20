// SearchModal Component
"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import { FaSearch, FaChevronRight } from "react-icons/fa";
import type { Category } from "@/types/business";

const DEFAULT_IMAGE = "/assets/placeholder-category.jpg";

interface SearchResultItem {
    type: "product" | "category";
    id: string;
    name: string;
    url: string;
    image?: string;
}

// Search Input Component
interface SearchInputProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    inputRef: React.RefObject<HTMLInputElement>;
    isMobile?: boolean;
    onClear: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
    searchTerm,
    setSearchTerm,
    inputRef,
    isMobile = false,
    onClear,
}) => {
    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <FaSearch
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 ${isMobile ? "w-5 h-5" : "w-4 h-4"}`}
            />
            <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for styles, collections & more..."
                className={`w-full ${isMobile ? "pl-12 pr-12 py-4 rounded-2xl text-base" : "pl-11 pr-4 py-3 rounded-xl"} border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 focus:border-primary focus:bg-white dark:focus:bg-gray-700 focus:outline-none transition-all duration-200`}
                onClick={(e) => e.stopPropagation()}
            />
            {searchTerm && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClear();
                    }}
                    className={`absolute right-${isMobile ? "4" : "3"} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1`}
                    aria-label="Clear search"
                >
                    <FiX className={isMobile ? "w-5 h-5" : "w-4 h-4"} />
                </button>
            )}
        </div>
    );
};

// Search Results Component
const SearchResults: React.FC<{
    suggestions: SearchResultItem[];
    onItemClick: () => void;
    searchTerm: string;
}> = ({ suggestions, onItemClick, searchTerm }) => {
    if (!searchTerm.trim()) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FaSearch className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Start typing to search for products and categories</p>
            </div>
        );
    }

    if (suggestions.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FaSearch className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No results found for "{searchTerm}"</p>
                <p className="text-sm mt-1">Try different keywords or browse categories</p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 px-3 pb-2">
                {suggestions.length} result{suggestions.length > 1 ? "s" : ""} found
            </p>
            {suggestions.map((item, index) => (
                <Link
                    key={`${item.type}-${item.id}-${index}`}
                    href={item.url}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group border border-transparent hover:border-primary/20"
                    onClick={onItemClick}
                >
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-600">
                        <Image
                            src={item.image || DEFAULT_IMAGE}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = DEFAULT_IMAGE;
                            }}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 dark:text-white truncate group-hover:text-primary transition-colors">
                            {item.name}
                        </h4>
                        <p className="text-sm text-primary font-medium capitalize">{item.type}</p>
                    </div>
                    <FaChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                </Link>
            ))}
        </div>
    );
};

// Search Modal Component
const SearchModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Disable body scroll and touch actions when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
        } else {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        };
    }, [isOpen]);

    // Prevent touch scrolling
    useEffect(() => {
        const handleTouchMove = (e: TouchEvent) => {
            if (isOpen) {
                e.preventDefault();
            }
        };

        document.addEventListener("touchmove", handleTouchMove, { passive: false });
        return () => document.removeEventListener("touchmove", handleTouchMove);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
                onClick={onClose}
            />
            <div
                ref={modalRef}
                className="fixed inset-0 bg-white dark:bg-gray-900 rounded-none shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in duration-300 min-h-screen h-[100vh] h-[-webkit-fill-available]"
            >
                {children}
            </div>
        </>
    );
};

// Universal Search Component
interface UniversalSearchProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    suggestions: SearchResultItem[];
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isMobile?: boolean;
}

export const UniversalSearch: React.FC<UniversalSearchProps> = ({
    searchTerm,
    setSearchTerm,
    suggestions,
    isOpen,
    setIsOpen,
    isMobile = false,
}) => {
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, setIsOpen, setSearchTerm]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setSearchTerm("");
    }, [setIsOpen, setSearchTerm]);

    const handleItemClick = useCallback(() => {
        setIsOpen(false);
        setSearchTerm("");
    }, [setIsOpen, setSearchTerm]);

    if (isMobile) {
        return (
            <div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    aria-label="Search"
                >
                    <FaSearch className="text-primary w-5 h-5" />
                </button>
                <SearchModal onClose={handleClose} isOpen={isOpen}>
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                                Search Products
                            </h2>
                            <button
                                onClick={handleClose}
                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                                aria-label="Close search"
                            >
                                <FiX className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <SearchInput
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                inputRef={inputRef}
                                isMobile={true}
                                onClear={() => setSearchTerm("")}
                            />
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            <SearchResults
                                suggestions={suggestions}
                                onItemClick={handleItemClick}
                                searchTerm={searchTerm}
                            />
                        </div>
                    </div>
                </SearchModal>
            </div>
        );
    }

    return (
        <div ref={searchRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Search"
            >
                <FaSearch className="text-primary w-5 h-5" />
            </button>
            {isOpen && (
                <div
                    className="absolute top-full right-0 mt-3 w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
                >
                    <div className="absolute top-0 right-0 z-10">
                        <button
                            onClick={handleClose}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                            aria-label="Close search"
                        >
                            <FiX className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <SearchInput
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            inputRef={inputRef}
                            onClear={() => setSearchTerm("")}
                        />
                    </div>
                    <div className="max-h-80 overflow-auto p-3">
                        <SearchResults
                            suggestions={suggestions}
                            onItemClick={handleItemClick}
                            searchTerm={searchTerm}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

// useSearch Hook and Utilities
export const useSearch = (products: any[], categories: Category[]) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const suggestions = useMemo<SearchResultItem[]>(() => {
        if (!searchTerm.trim()) return [];

        const term = searchTerm.trim().toLowerCase();

        const categoryMatches: SearchResultItem[] = categories
            .filter((cat) => cat.name.toLowerCase().includes(term))
            .slice(0, 5)
            .map((cat) => ({
                type: "category",
                id: cat._id,
                name: cat.name,
                url: `/products?category=${cat._id}&name=${encodeURIComponent(cat.name.toLowerCase())}`,
                image: getCategoryImage(cat),
            }));

        const productMatches: SearchResultItem[] = products
            .filter(
                (product) =>
                    product.name?.toLowerCase().includes(term) ||
                    product.short_description?.toLowerCase().includes(term)
            )
            .slice(0, 5)
            .map((product) => ({
                type: "product",
                id: product._id,
                name: product.name || "Unnamed Product",
                url: `/product/${generateSlug(product.name)}?id=${product._id}`,
                image: product.images?.[0]?.alterImage?.secure_url
                    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${product.images[0].alterImage.secure_url}`
                    : product.images?.[0]?.image?.secure_url || DEFAULT_IMAGE,
            }));

        return [...categoryMatches, ...productMatches].slice(0, 8);
    }, [searchTerm, categories, products]);

    const clearSearch = useCallback(() => {
        setSearchTerm("");
        setIsSearchOpen(false);
    }, []);

    return {
        searchTerm,
        setSearchTerm,
        isSearchOpen,
        setIsSearchOpen,
        suggestions,
        clearSearch,
    };
};

const getCategoryImage = (category: Category): string => {
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "https://cloude.calquick.app/v2/api/files";

    if (category.image?.alterImage?.secure_url) {
        return category.image.alterImage.secure_url.includes("https")
            ? category.image.alterImage.secure_url
            : `${baseUrl}${category.image.alterImage.secure_url}`;
    }
    if (category.image?.optimizeUrl) {
        return category.image.optimizeUrl.includes("https")
            ? category.image.optimizeUrl
            : `${baseUrl}${category.image.optimizeUrl}`;
    }
    if (category.image?.secure_url) {
        return category.image.secure_url.includes("https")
            ? category.image.secure_url
            : `${baseUrl}${category.image.secure_url}`;
    }
    if (category.children && category.children.length > 0) {
        for (const child of category.children) {
            const childImage = getCategoryImage(child);
            if (childImage !== DEFAULT_IMAGE) {
                return childImage;
            }
        }
    }
    return DEFAULT_IMAGE;
};

const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[অ-হ]/g, (char) => {
            const banglaToLatin: Record<string, string> = {
                "অ": "o", "আ": "a", "ই": "i", "ঈ": "i", "উ": "u", "ঊ": "u",
                "ঋ": "ri", "এ": "e", "ঐ": "oi", "ও": "o", "ঔ": "ou", "ক": "k",
                "খ": "kh", "গ": "g", "ঘ": "gh", "ঙ": "ng", "চ": "ch", "ছ": "chh",
                "জ": "j", "ঝ": "jh", "ঞ": "ny", "ট": "t", "ঠ": "th", "ড": "d",
                "ঢ": "dh", "ণ": "n", "ত": "t", "থ": "th", "দ": "d", "ধ": "dh",
                "ন": "n", "প": "p", "ফ": "ph", "ব": "b", "ভ": "bh", "ম": "m",
                "য": "j", "র": "r", "ল": "l", "শ": "sh", "ষ": "sh", "স": "s",
                "হ": "h", "ড়": "r", "ঢ়": "rh", "য়": "y", "ৎ": "t", "ং": "ng",
                "ঃ": "h", "ঁ": "",
            };
            return banglaToLatin[char] || char;
        })
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
};

export interface NavSubItem {
    title: string;
    path: string;
    icon?: React.ComponentType<{ className?: string }>;
    element?: React.ElementType;
}

export interface NavGroup {
    title: string;
    path?: string;
    icon?: React.ComponentType<{ className?: string }>;
    element?: React.ElementType;
    submenu?: NavSubItem[];
}

