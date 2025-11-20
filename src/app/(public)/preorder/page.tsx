// app/(public)/preorder/page.tsx
"use server";
import React from "react";
import { publicApi } from "@/lib/api/publicApi";
import { makeStore } from "@/lib/store";
import type { Product } from "@/types/product";
import PreOrderProducts from "./_components/PreOrderProducts";

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
        title: 'Pre-Order Products - Dress Expressbd',
        description: 'Discover and pre-order the latest products on Grilgirlbd.',
        openGraph: {
            title: 'Pre-Order Products - Dress Expressbd',
            description: 'Discover and pre-order the latest products on Grilgirlbd.',
            url: '/preorder',
            type: 'website',
        },
    } as const;
}

export default async function PreOrderPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const {
        search = '',
        sort,
        brand,
        minPrice,
        maxPrice,
        condition,
    } = await searchParams ?? {};

    const store = makeStore();
    const allProducts: Product[] = [];

    let page = 1;
    const limit = 20;
    const maxPages = 100;

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
            })
        );

        const products: Product[] = res.data ?? [];
        if (products.length === 0) break;

        // Filter for pre-order products only
        const preOrderProducts = products.filter(product =>
            product.variantsId?.some(variant => variant.isPreOrder === true)
        );

        allProducts.push(...preOrderProducts);

        // If we got less than limit products, no more pages
        if (products.length < limit) break;

        page += 1;
    }

    const initialProducts = JSON.parse(JSON.stringify(allProducts));

    return (
        <div className="mb-10 md:mb-0">
            <PreOrderProducts initialProducts={initialProducts} />
        </div>
    );
}