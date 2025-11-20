import { Category } from "@/types/business";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaChevronLeft } from "react-icons/fa";
import { FiGrid, FiX } from "react-icons/fi";
const DEFAULT_IMAGE = "/assets/placeholder-category.jpg";

// Function to create slug from category name
const createSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};
// Category Dropdown Component
export const CategoryDropdown = ({ categories }: { categories: Category[] }) => {
    const [showCategories, setShowCategories] = useState(false);
    const [activeChain, setActiveChain] = useState<Category[]>([]);
    const categoriesRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!showCategories) return;

        const handleOutsideClick = (e: MouseEvent) => {
            const target = e.target as Node;

            // Check if click is outside both button and dropdown
            if (
                categoriesRef.current &&
                buttonRef.current &&
                !categoriesRef.current.contains(target) &&
                !buttonRef.current.contains(target)
            ) {
                setShowCategories(false);
                setActiveChain([]);
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowCategories(false);
                setActiveChain([]);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [showCategories]);

    const handleToggleCategories = () => {
        setShowCategories(!showCategories);
        if (!showCategories) {
            setActiveChain([]);
        }
    };

    const handleCategoryItemClick = () => {
        setShowCategories(false);
        setActiveChain([]);
    };

    // Prevent dropdown content clicks from bubbling up
    const handleDropdownClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    // Function to determine the image source
    const getCategoryImageSrc = (cat: Category): string => {
        const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || 'https://cloudecalquick.app/v2/api/files';
        console.log(`getCategoryImageSrc for ${cat.name}`, cat.image); // Debug log

        // Try alterImage first
        if (cat.image?.alterImage?.secure_url) {
            const url = cat.image.alterImage.secure_url.includes("https")
                ? cat.image.alterImage.secure_url
                : `${baseUrl}${cat.image.alterImage.secure_url}`;
            console.log(`Using alterImage for ${cat.name}: ${url}`); // Debug log
            return url;
        }
        // Fall back to optimizeUrl
        if (cat.image?.optimizeUrl) {
            const url = cat.image.optimizeUrl.includes("https")
                ? cat.image.optimizeUrl
                : `${baseUrl}${cat.image.optimizeUrl}`;
            console.log(`Using optimizeUrl for ${cat.name}: ${url}`); // Debug log
            return url;
        }
        // Fall back to secure_url
        if (cat.image?.secure_url) {
            const url = cat.image.secure_url.includes("https")
                ? cat.image.secure_url
                : `${baseUrl}${cat.image.secure_url}`;
            console.log(`Using secure_url for ${cat.name}: ${url}`); // Debug log
            return url;
        }
        // Recursively check subcategories
        if (cat.children && cat.children.length > 0) {
            for (const child of cat.children) {
                const childImage = getCategoryImageSrc(child); // Recursive call
                if (childImage !== DEFAULT_IMAGE) {
                    console.log(`Using child image for ${cat.name}: ${childImage}`); // Debug log
                    return childImage;
                }
            }
        }
        console.log(`No image found for ${cat.name}, using DEFAULT_IMAGE`); // Debug log
        return DEFAULT_IMAGE;
    };

    const renderCategoryColumn = (cats: Category[], level: number) => (
        <div
            key={level}
            className="w-64 flex-shrink-0 p-3 bg-white dark:bg-gray-900 border-l last:border-l-0 border-gray-200 dark:border-gray-700"
        >
            {cats.map((cat) => {
                // Determine if this is a main category (level 0) or sub-category
                const isMainCategory = level === 0;
                const href = isMainCategory
                    ? `/main-category/${createSlug(cat.name)}`
                    : `/category/${createSlug(cat.name)}`;

                return (
                    <div
                        key={cat._id}
                        className={`rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 ${activeChain[level]?._id === cat._id
                            ? "bg-gray-100 dark:bg-gray-800 ring-2 ring-primary/20"
                            : ""
                            }`}
                        onMouseEnter={() => {
                            setActiveChain([...activeChain.slice(0, level), cat]);
                        }}
                    >
                        <Link
                            href={href}
                            className="flex items-center justify-between px-4 py-3 text-sm text-gray-800 dark:text-white hover:text-primary transition-colors group"
                            onClick={handleCategoryItemClick}
                        >
                            <div className="flex items-center gap-3">
                                {/* Category/Subcategory Image */}
                                <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-600">
                                    {cat.image?.alterImage?.secure_url || cat.image?.optimizeUrl || cat.image?.secure_url ? (
                                        <Image
                                            src={getCategoryImageSrc(cat)}
                                            alt={cat.name}
                                            width={32}
                                            height={32}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.log(`Image failed for ${cat.name}, falling back to DEFAULT_IMAGE`); // Debug log
                                                e.currentTarget.src = DEFAULT_IMAGE;
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                            <FiGrid className="w-4 h-4 text-primary" />
                                        </div>
                                    )}
                                </div>
                                <span className="font-medium">{cat.name}</span>
                            </div>
                            {cat.children && cat.children.length > 0 && (
                                <>

                                    <FaChevronLeft className="text-xs text-gray-400 group-hover:text-primary transition-colors" />
                                </>
                            )}
                        </Link>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={handleToggleCategories}
                className="flex items-center gap-3 px-4 py-2.5 bg-primary text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-expanded={showCategories}
            >
                <FaAngleDown
                    className={`transition-transform duration-200 ${showCategories ? "rotate-180" : ""
                        }`}
                />
                <span className="font-semibold">Categories</span>
            </button>

            {showCategories && (
                <>
                    {/* Close button for categories */}
                    <button
                        onClick={() => {
                            setShowCategories(false);
                            setActiveChain([]);
                        }}
                        className="fixed top-4 right-4 z-[60] p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Close categories"
                    >
                        <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>

                    <div
                        ref={categoriesRef}
                        className="absolute top-full right-0 mt-2 max-w-[90vw] max-h-[75vh] overflow-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 flex flex-row-reverse animate-in fade-in slide-in-from-top-4 duration-300"
                        onClick={handleDropdownClick}
                    >
                        {renderCategoryColumn(categories, 0)}
                        {activeChain.map((category, index) =>
                            category.children && category.children.length > 0 ? (
                                <React.Fragment key={index}>
                                    {renderCategoryColumn(category.children, index + 1)}
                                </React.Fragment>
                            ) : null
                        )}
                    </div>
                </>
            )}
        </div>
    );
};