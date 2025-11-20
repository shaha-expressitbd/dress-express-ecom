"use client";
import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Product } from "@/types/product";
import { useBusiness } from "@/hooks/useBusiness";
import { Category } from "@/types/business";
import ShopMobileHeader from "./mobile-header";
import ShopDesktopHeader from "./desktop-header";
import ShopProductsGrid from "./products-grid";
import ShopFilters from "./filters";
import { Pagination } from "@/components/ui/molecules/pagination";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface ShopAllProductsProps {
  initialProducts: Product[];
  minPrice?: number;
  maxPrice?: number;
}

function getAllDescendantIds(cat: Category): string[] {
  let ids: string[] = [cat._id];
  if (cat.children && cat.children.length > 0) {
    for (const child of cat.children) {
      ids = ids.concat(getAllDescendantIds(child));
    }
  }
  return ids;
}

export default function ShopAllProducts({
  initialProducts,
  minPrice: initialMinPrice,
  maxPrice: initialMaxPrice,
}: ShopAllProductsProps) {
  const { businessData } = useBusiness();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categories: Category[] = businessData?.categories || [];
  const productsContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const initialCategoryId = searchParams.get("category");
  const initialSelectedCats = useMemo(() => {
    if (!initialCategoryId) return [];
    const category = categories.find((cat) => cat._id === initialCategoryId);
    return category ? getAllDescendantIds(category) : [];
  }, [initialCategoryId, categories]);

  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high" | "newest">("newest");
  const [selectedCats, setSelectedCats] = useState<string[]>(initialSelectedCats);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 20;

  // Reset to page 1 when filters change
  const handleSortChange = (newSortBy: "name" | "price-low" | "price-high" | "newest" | React.SetStateAction<"name" | "price-low" | "price-high" | "newest">) => {
    if (typeof newSortBy === "function") {
      setSortBy(prev => {
        const result = newSortBy(prev);
        setCurrentPage(1);
        return result;
      });
    } else {
      setSortBy(newSortBy);
      setCurrentPage(1);
    }
  };

  const handleSearchChange = (newSearchQuery: string | React.SetStateAction<string>) => {
    if (typeof newSearchQuery === "function") {
      setSearchQuery(prev => {
        const result = newSearchQuery(prev);
        setCurrentPage(1);
        return result;
      });
    } else {
      setSearchQuery(newSearchQuery);
      setCurrentPage(1);
    }
  };

  const handleCategoryChange = (newSelectedCats: string[] | React.SetStateAction<string[]>) => {
    if (typeof newSelectedCats === "function") {
      setSelectedCats(prev => {
        const result = newSelectedCats(prev);
        setCurrentPage(1);
        return result;
      });
    } else {
      setSelectedCats(newSelectedCats);
      setCurrentPage(1);
    }
  };

  const handleSizeChange = (newSelectedSizes: string[] | React.SetStateAction<string[]>) => {
    if (typeof newSelectedSizes === "function") {
      setSelectedSizes(prev => {
        const result = newSelectedSizes(prev);
        setCurrentPage(1);
        return result;
      });
    } else {
      setSelectedSizes(newSelectedSizes);
      setCurrentPage(1);
    }
  };

  const handlePriceRangeChange = (newPriceRange: [number, number] | React.SetStateAction<[number, number]>) => {
    if (typeof newPriceRange === "function") {
      setPriceRange(prev => {
        const result = newPriceRange(prev);
        setCurrentPage(1);
        return result;
      });
    } else {
      setPriceRange(newPriceRange);
      setCurrentPage(1);
    }
  };

  const { minPrice, maxPrice } = useMemo(() => {
    if (initialMinPrice !== undefined && initialMaxPrice !== undefined)
      return { minPrice: initialMinPrice, maxPrice: initialMaxPrice };
    if (initialProducts.length === 0) return { minPrice: 0, maxPrice: 10000 };
    const prices = initialProducts
      .map((p) => {
        const v =
          p.variantsId?.find((x) => Number(x.variants_stock) > 0) ??
          p.variantsId?.[0];
        if (!v) return 0;
        const sell = Number(v.selling_price || 0);
        const offer = Number(v.offer_price || sell);
        const start = v.discount_start_date
          ? new Date(v.discount_start_date).getTime()
          : 0;
        const end = v.discount_end_date
          ? new Date(v.discount_end_date).getTime()
          : 0;
        const now = Date.now();
        const isOffer = offer < sell && now >= start && now <= end;
        return isOffer ? offer : sell;
      })
      .filter((n) => !Number.isNaN(n));
    return {
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 10000,
    };
  }, [initialProducts, initialMinPrice, initialMaxPrice]);

  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    if (
      selectedCats.length !== initialSelectedCats.length ||
      selectedSizes.length > 0 ||
      searchQuery ||
      priceRange[0] !== minPrice ||
      priceRange[1] !== maxPrice
    ) {
      router.push("/products");
    }
  }, [selectedCats, selectedSizes, searchQuery, priceRange, initialSelectedCats, minPrice, maxPrice, router]);

  useEffect(() => {
    const updateWidth = () => {
      if (sidebarRef.current) {
        setSidebarWidth(sidebarRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const { filteredAndSorted, paginatedProducts, totalPages } = useMemo(() => {
    const filtered = initialProducts
      .filter((product) => {
        const price = (() => {
          const v =
            product.variantsId?.find((x) => Number(x.variants_stock) > 0) ??
            product.variantsId?.[0];
          if (!v) return 0;
          const sell = Number(v.selling_price || 0);
          const offer = Number(v.offer_price || sell);
          const start = v.discount_start_date
            ? new Date(v.discount_start_date).getTime()
            : 0;
          const end = v.discount_end_date
            ? new Date(v.discount_end_date).getTime()
            : 0;
          const now = Date.now();
          const isOffer = offer < sell && now >= start && now <= end;
          return isOffer ? offer : sell;
        })();
        if (price < priceRange[0] || price > priceRange[1]) return false;

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const searchIn = [
            product.name?.toLowerCase() || "",
            ...(product.category_group?.map((cat) => cat.name?.toLowerCase()) ||
              []),
            ...(product.variantsId?.map((v) => v.condition?.toLowerCase()) ||
              []),
          ].join(" ");
          if (!searchIn.includes(query)) return false;
        }

        if (selectedCats.length > 0) {
          const prodCatIds = (product.category_group || []).map((cat) => cat._id);
          if (!prodCatIds.some((id) => selectedCats.includes(id))) return false;
        }

        if (selectedSizes.length > 0) {
          const prodSizes =
            product.variantsId?.flatMap((v) => v.variants_values || []) ?? [];
          if (!prodSizes.some((sz) => selectedSizes.includes(sz))) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const getPrice = (p: Product) => {
          const v =
            p.variantsId?.find((x) => Number(x.variants_stock) > 0) ??
            p.variantsId?.[0];
          if (!v) return 0;
          const sell = Number(v.selling_price || 0);
          const offer = Number(v.offer_price || sell);
          const start = v.discount_start_date
            ? new Date(v.discount_start_date).getTime()
            : 0;
          const end = v.discount_end_date
            ? new Date(v.discount_end_date).getTime()
            : 0;
          const now = Date.now();
          const isOffer = offer < sell && now >= start && now <= end;
          return isOffer ? offer : sell;
        };
        switch (sortBy) {
          case "name":
            return (a.name || "").localeCompare(b.name || "");
          case "price-low":
            return getPrice(a) - getPrice(b);
          case "price-high":
            return getPrice(b) - getPrice(a);
          case "newest":
          default:
            return (b._id || "").localeCompare(a._id || "");
        }
      });

    // Calculate pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filtered.slice(startIndex, endIndex);

    return {
      filteredAndSorted: filtered,
      paginatedProducts,
      totalPages
    };
  }, [initialProducts, selectedCats, selectedSizes, priceRange, searchQuery, sortBy, currentPage, itemsPerPage]);

  const clearAllFilters = useCallback(() => {
    setSelectedCats([]);
    setSelectedSizes([]);
    setPriceRange([minPrice, maxPrice]);
    setSearchQuery("");
    setCurrentPage(1);
    router.push("/products");
  }, [minPrice, maxPrice, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ShopMobileHeader
        isMobileFiltersOpen={isMobileFiltersOpen}
        setIsMobileFiltersOpen={setIsMobileFiltersOpen}
        sortBy={sortBy}
        setSortBy={handleSortChange}
        selectedCats={selectedCats}
        selectedSizes={selectedSizes}
        searchQuery={searchQuery}
      />
      <div className="flex flex-col md:flex-row">
        <ShopFilters
          categories={categories}
          selectedCats={selectedCats}
          setSelectedCats={handleCategoryChange}
          selectedSizes={selectedSizes}
          setSelectedSizes={handleSizeChange}
          priceRange={priceRange}
          setPriceRange={handlePriceRangeChange}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          initialProducts={initialProducts}
          filteredProductsCount={filteredAndSorted.length}
          clearAllFilters={clearAllFilters}
          isMobileFiltersOpen={isMobileFiltersOpen}
          setIsMobileFiltersOpen={setIsMobileFiltersOpen}
          sidebarRef={sidebarRef}
        />
        <main className="flex-1">
          <ShopDesktopHeader
            filteredAndSorted={filteredAndSorted}
            initialProducts={initialProducts}
            sortBy={sortBy}
            setSortBy={handleSortChange}
            totalFilteredCount={filteredAndSorted.length}
          />
          <div className="md:pb-16 lg:px-4">
            <ShopProductsGrid
              productsContainerRef={productsContainerRef}
              filteredAndSorted={paginatedProducts}
              initialProducts={initialProducts}
              clearAllFilters={clearAllFilters}
              containerWidth={typeof window !== "undefined" ? window.innerWidth - sidebarWidth : undefined}
              isLoading={isLoading}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 mb-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredAndSorted.length}
                />
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <div className="md:fixed bottom-0 left-0 w-full bg-black py-2 text-center flex items-center justify-center gap-1 z-50">
              <p className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm sm:text-base">
                <span className="text-gray-400 text-sm dark:text-gray-300">Powered by:</span>
                <a
                  href="https://calquick.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <Image
                    height={100}
                    width={100}
                    src={"https://calquick.app/images/logo/logo-white.png"}
                    className="h-5 sm:h-6 w-auto object-contain"
                    alt="calquick-logo"
                    priority
                  />
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}