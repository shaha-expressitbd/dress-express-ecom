// lib/api/serverApi.ts
import { ApiResponse } from "@/types/apiResponse";
import { Business } from "@/types/business";
import { Product } from "@/types/product";

const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const OWNER_ID = process.env.NEXT_PUBLIC_OWNER_ID!;
const BUSINESS_ID = process.env.NEXT_PUBLIC_BUSINESS_ID!;
const CACHE_DURATION = 900; // 15 minutes in seconds

if (!PUBLIC_API_URL || !OWNER_ID || !BUSINESS_ID) {
  throw new Error("Missing required environment variables");
}

// Normalize base URL
const normalizedBase = PUBLIC_API_URL.endsWith("/")
  ? PUBLIC_API_URL.slice(0, -1)
  : PUBLIC_API_URL;

console.log("Server API Config:", {
  PUBLIC_API_URL,
  OWNER_ID,
  BUSINESS_ID,
  normalizedBase,
  API_URL: `${normalizedBase}/public/${OWNER_ID}/${BUSINESS_ID}`,
});

const API_URL = `${normalizedBase}/public/${OWNER_ID}/${BUSINESS_ID}`;

// SearchParams interface for type safety
interface SearchParams {
  search?: string;
  sort?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
  page?: number;
  limit?: number;
  category?: string; // Added for category filtering
}

// Optimized fetch with 15-min cache
async function fetchFromApi<T>(
  endpoint: string,
  options?: RequestInit & { revalidate?: number | false }
): Promise<T> {
  const startTime = performance.now();
  const finalUrl = API_URL + endpoint;

  try {
    const res = await fetch(finalUrl, {
      next: {
        revalidate: options?.revalidate ?? CACHE_DURATION, // Default 15 min
      },
      headers: {
        "Cache-Control": "public, max-age=900, stale-while-revalidate=1800",
        ...options?.headers,
      },
    });

    const networkTime = performance.now() - startTime;

    if (!res.ok) {
      throw new Error(
        `Failed to fetch from ${endpoint}: ${res.status} - ${res.statusText}`
      );
    }

    const response: ApiResponse<T> = await res.json();
    const totalTime = performance.now() - startTime;

    if (process.env.NODE_ENV === "development") {
      console.log(`✅ ${endpoint}`);
      console.log(`   Network: ${networkTime.toFixed(2)}ms`);
      console.log(`   Total: ${totalTime.toFixed(2)}ms`);
      console.log(`   Cache: ${res.headers.get("x-vercel-cache") || "N/A"}`);
    }

    return response.data;
  } catch (error) {
    const errorTime = performance.now() - startTime;
    console.error(`❌ Fetch failed after ${errorTime.toFixed(2)}ms:`, error);
    throw error;
  }
}

// BUSINESS API - 15 min cache
export async function getBusinessServer(): Promise<Business> {
  const businesses = await fetchFromApi<Business[]>("", {
    revalidate: CACHE_DURATION, // 15 minutes
  });

  if (!businesses || businesses.length === 0) {
    throw new Error("Business data not found.");
  }

  return businesses[0];
}

// PRODUCTS API - 15 min cache with filters
export async function getProductsServer({
  search,
  sort,
  brand,
  minPrice,
  maxPrice,
  condition,
  page = 1,
  limit = 20,
  category,
}: SearchParams = {}): Promise<Product[]> {
  if (process.env.NODE_ENV === "development") {
    console.log("🔄 Starting product fetch...");
    console.log("📋 Search Parameters:", {
      search,
      sort,
      brand,
      minPrice,
      maxPrice,
      condition,
      page,
      limit,
      category,
    });
  }

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  // Add optional params only if they exist
  if (search) queryParams.append("search", decodeURIComponent(search));
  if (sort) queryParams.append("sort", sort);
  if (brand) queryParams.append("brand", brand);
  if (minPrice) queryParams.append("minPrice", minPrice);
  if (maxPrice) queryParams.append("maxPrice", maxPrice);
  if (condition) queryParams.append("condition", condition);

  const endpoint = `/products?${queryParams.toString()}`;

  if (process.env.NODE_ENV === "development") {
    console.log(`📡 Fetching products: ${API_URL}${endpoint}`);
  }

  try {
    const products = await fetchFromApi<Product[]>(endpoint, {
      revalidate: CACHE_DURATION, // 15 minutes
    });

    if (process.env.NODE_ENV === "development") {
      console.log(`✅ Fetched ${products.length} products`);
      if (products.length === 0) {
        console.log("🛑 No products found.");
      }
    }

    // Client-side filtering if category is provided
    if (category) {
      // First try to match by category ID (if it's an ID)
      const categoryId = decodeURIComponent(category);
      if (categoryId.match(/^[0-9a-fA-F]{24}$/)) {
        // MongoDB ObjectId pattern
        const filteredById = products.filter(
          (p) =>
            p.sub_category?.some((c) => c._id === categoryId) ||
            p.main_category?.some((c) => c._id === categoryId) ||
            p.category_group?.some((c) => c._id === categoryId)
        );

        if (filteredById.length > 0) {
          if (process.env.NODE_ENV === "development") {
            console.log(
              `🔍 Filtered products for category ID "${categoryId}": ${filteredById.length} matches`
            );
          }
          return filteredById;
        }
      }

      // Fallback to name matching
      const decodedCategory = decodeURIComponent(category).toLowerCase();
      const filtered = products.filter((p) => {
        // Check sub_category
        const subCatMatch = p.sub_category?.some(
          (c) => c.name.toLowerCase() === decodedCategory
        );

        // Check main_category
        const mainCatMatch = p.main_category?.some(
          (c) => c.name.toLowerCase() === decodedCategory
        );

        // Check category_group
        const catGroupMatch = p.category_group?.some(
          (c) => c.name.toLowerCase() === decodedCategory
        );

        // Check tags
        const tagMatch = p.tags?.some(
          (tag) => tag.toLowerCase() === decodedCategory
        );

        // Check search_keywords
        const keywordMatch = p.search_keywords?.some(
          (keyword) => keyword.toLowerCase() === decodedCategory
        );

        return (
          subCatMatch ||
          mainCatMatch ||
          catGroupMatch ||
          tagMatch ||
          keywordMatch
        );
      });

      if (process.env.NODE_ENV === "development") {
        console.log(
          `🔍 Filtered products for category name "${decodedCategory}": ${filtered.length} matches`
        );
        console.log(`   Total products before filtering: ${products.length}`);
      }

      return filtered;
    }

    return products;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return []; // Return empty array on error
  }
}

// SINGLE PRODUCT API - 15 min cache
export async function getProductServer(id: string): Promise<Product | null> {
  const endpoint = `/products?_id=${id}`;

  try {
    const products = await fetchFromApi<Product[]>(endpoint, {
      revalidate: CACHE_DURATION, // 15 minutes
    });

    if (products && products.length > 0) {
      return products[0];
    }

    return null;
  } catch (error) {
    console.error(`❌ Error fetching product with id ${id}:`, error);
    return null;
  }
}
