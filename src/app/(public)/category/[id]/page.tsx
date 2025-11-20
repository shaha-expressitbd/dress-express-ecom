// app/[id]/page.tsx
'use server'
import React from 'react'
import { publicApi } from '@/lib/api/publicApi'
import { makeStore } from '@/lib/store'
import { Product } from '@/types/product'
import CategoryProductsPage from './_components/CategoryProductsPage'


export default async function Page() {
    const store = makeStore()
    const res = await store.dispatch(
        publicApi.endpoints.getProducts.initiate({ page: 1, limit: 1000 })
    )
    //console.log(res)
    const initialProducts: Product[] = res.data
        ? JSON.parse(JSON.stringify(res.data))
        : []

    return (
        <CategoryProductsPage
            initialProducts={initialProducts}
        // category={decodeURIComponent(params.id)}
        />
    )
}