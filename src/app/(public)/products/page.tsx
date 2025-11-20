// app/(public)/products/page.tsx
"use server";
import React from "react";
import { publicApi } from "@/lib/api/publicApi";
import { makeStore } from "@/lib/store";
import type { Product } from "@/types/product";
import ShopAllProducts from "./_components/ShopAllProducts";


type SearchParams = {
  search?: string;
  sort?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
  category?: string;
  name?: string;
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { category, name } = await searchParams;
  const title = name ? `${decodeURIComponent(name)} Products | Glamgirl` : "Shop All Products | Glamgirl";
  const description = name
    ? `Browse our collection of ${decodeURIComponent(name).toLowerCase()} products on Glamgirl.`
    : "Browse all products available on Glamgirl and find the best offers.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "/products",
      type: "website",
    },
  } as const;
}

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const {
    search = "",
    sort,
    brand,
    minPrice,
    maxPrice,
    condition,
    category,
  } = await searchParams ?? {};

  const store = makeStore();
  const allProducts: Product[] = [];

  let page = 1;
  const limit = 500;
  const maxPages = 10;

  while (page <= maxPages) {
    const res = await store.dispatch(
      publicApi.endpoints.getProducts.initiate({
        page,
        limit,
        ...(search && { search }),
        ...(sort && { sort }),
        ...(brand && { brand }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(condition && { condition }),
        ...(category && { category_group: category }),
      })
    );

    const products: Product[] = res.data ?? [];
    if (products.length === 0) break;

    allProducts.push(...products);
    page += 1;
  }

  const initialProducts = JSON.parse(JSON.stringify(allProducts));

  return (
    <ShopAllProducts
      initialProducts={initialProducts}
      minPrice={minPrice ? Number(minPrice) : undefined}
      maxPrice={maxPrice ? Number(maxPrice) : undefined}
    />
  );
}