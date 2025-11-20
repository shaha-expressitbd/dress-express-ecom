// src/app/(public)/page.tsx
import React from "react";
import { publicApi } from "@/lib/api/publicApi";
import { makeStore } from "@/lib/store";
import type { Product } from "@/types/product";
import type { Category } from "@/types/business";
// import HeroSection from "@/components/HeroSection";
import ClientNewProducts from "@/components/ClientNewProducts";
import ClientAllProducts from "@/components/ClientAllProducts";
import ProductVideosSlider from "@/components/ProductVideosSlider";
import SubCategorySections from "@/components/subCategorySection";

type SearchParams = {
  search?: string;
  sort?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
};

export async function generateMetadata() {
  return {
    title: "Dress Expressbd - Best Online Shopping Platform",
    description: "Discover amazing deals and shop for your favorite products on Grilgirlbd.",
    openGraph: {
      title: "Dress Expressbd - Best Online Shopping Platform",
      description: "Discover amazing deals and shop for your favorite products on Grilgirlbd.",
      url: "/",
      type: "website",
    },
  } as const;
}

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const {
    search = "",
    sort,
    brand,
    minPrice,
    maxPrice,
  } = await searchParams ?? {};

  const store = makeStore();
  const allProducts: Product[] = [];

  let page = 1;
  const limit = 10;
  const maxPages = 2;

  // Fetch products with condition="new"
  try {
    while (page <= maxPages) {
      const res = await store.dispatch(
        publicApi.endpoints.getProducts.initiate({
          page,
          limit,
          condition: "new",
          ...(search && { search }),
          ...(sort && { sort }),
          ...(brand && { brand }),
          ...(minPrice && { minPrice }),
          ...(maxPrice && { maxPrice }),
        })
      );

      if (res.error) {
        console.error("Error fetching products:", res.error);
        break;
      }

      const products: Product[] = res.data ?? [];
      if (products.length === 0) break;

      allProducts.push(...products);
      page += 1;
    }
  } catch (error) {
    console.error("Unexpected error fetching products:", error);
  }

  // Filter unique products by _id
  const uniqueProductsMap = new Map<string, Product>();
  allProducts.forEach((product) => {
    if (product._id) {
      uniqueProductsMap.set(product._id, product);
    }
  });
  const uniqueProducts = Array.from(uniqueProductsMap.values());

  // Fetch categories
  let categories: Category[] = [];
  try {
    const categoriesRes = await store.dispatch(
      publicApi.endpoints.getCategories.initiate()
    );
    if (categoriesRes.error) {
      // console.error("Failed to fetch categories:", categoriesRes.error);
      categories = [];
    } else {
      categories = categoriesRes.data ?? [];
    }
  } catch (error) {
    console.error("Unexpected error fetching categories:", error);
  }

  // Remove proxies / RTK-serializable values
  const initialProducts = JSON.parse(JSON.stringify(uniqueProducts));
  const initialCategories = JSON.parse(JSON.stringify(categories));

  // Debug: Log the fetched products
  console.log("LandingPage fetched unique products:", initialProducts);

  return (
    <div>
      {/* <HeroSection /> */}
      <ClientNewProducts initialProducts={initialProducts} />
      <ClientAllProducts initialProducts={initialProducts} />
      <ProductVideosSlider products={initialProducts} />
      <SubCategorySections />

    </div>
  );
}
