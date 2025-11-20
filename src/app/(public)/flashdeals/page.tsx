// app/flash-deals/page.tsx
import React from 'react';
import { publicApi } from '@/lib/api/publicApi';
import { makeStore } from '@/lib/store';
import type { Product } from '@/types/product';
import FlashDeals from './_components/FlashDeals';

type SearchParams = {
    page?: string;
    limit?: string;
    // Add more dynamic params as needed
};

export const dynamic = 'force-dynamic'; // Force dynamic behavior
export const revalidate = 0; // Disable cache

export async function generateMetadata() {
    return {
        title: 'Flash Deals | Dress Express',
        description: 'Enjoy limited-time flash deals on discount products.',
        openGraph: {
            title: 'Flash Deals | Dress Express',
            description: 'Enjoy limited-time flash deals on discount products.',
            url: '/flash-deals',
            type: 'website',
        },
    } as const;
}

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    // Await the searchParams promise
    const { page = '1', limit = '1000' } = await searchParams ?? {};

    const store = makeStore();

    // Convert to numbers with fallbacks
    const pageNumber = Math.max(1, parseInt(page)) || 1;
    const limitNumber = Math.min(1000, parseInt(limit)) || 1000;

    // Fetch products with error handling
    let initialDeals: Product[] = [];

    try {
        const { data } = await store.dispatch(
            publicApi.endpoints.getProducts.initiate({
                page: pageNumber,
                limit: limitNumber
            })
        );

        // Filter and validate products
        initialDeals = Array.isArray(data)
            ? data.filter((p: Product) => p?._id?.trim())
            : [];
    } catch (error) {
        console.error('Failed to fetch flash deals:', error);
    }

    // Development-only logging
    if (process.env.NODE_ENV === 'development') {
        console.log('🔗 [SSR] FlashDeals fetched:', initialDeals.length);
    }

    return <FlashDeals initialDeals={initialDeals} />;
}