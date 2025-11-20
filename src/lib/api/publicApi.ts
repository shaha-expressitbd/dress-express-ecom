import { ApiResponse } from "@/types/apiResponse";
import { Business, Category } from "@/types/business";
import { OnlineOrderPayload, OnlineOrderResponse } from "@/types/onlineOrder";
import type { Product } from "@/types/product";
import type { Action, PayloadAction } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";

/* ENV CONSTANTS */
const OWNER_ID = process.env.NEXT_PUBLIC_OWNER_ID;
const BUSINESS_ID = process.env.NEXT_PUBLIC_BUSINESS_ID;
const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/* HYDRATE GUARD */
function isHydrate(action: Action): action is PayloadAction<any> {
  return action.type === HYDRATE;
}

/* API INSTANCE */
export const publicApi = createApi({
  reducerPath: "publicApi",
  baseQuery: fetchBaseQuery({ baseUrl: PUBLIC_API_URL }),
  tagTypes: ["Product", "Products", "Category", "OnlineOrder", "Business"],

  extractRehydrationInfo(action, { reducerPath }) {
    if (isHydrate(action)) return action.payload[reducerPath];
  },

  endpoints: (builder) => ({
    /* 1. BUSINESS */
    getBusiness: builder.query<Business, void>({
      query: () => {
        const url = `/public/${OWNER_ID}/${BUSINESS_ID}`;
        return url;
      },
      transformResponse: (res: ApiResponse<Business[]>) => {
        return res.data[0];
      },
      providesTags: ["Business"],
    }),

    /* 2. PRODUCTS */
    getProducts: builder.query<
      Product[],
      Partial<{ search?: string; page?: number; limit?: number; _id?: string }>
    >({
      query: (params = {}) => {
        const payload: Record<string, number | string | undefined> = {
          ...params,
        };
        if (payload.search)
          payload.search = decodeURIComponent(String(payload.search));

        const url = `/public/${OWNER_ID}/${BUSINESS_ID}/products`;
        return {
          url,
          params: payload,
          headers: { "Cache-Control": "no-cache" },
        };
      },

      transformResponse: (res: ApiResponse<Product[]>) => {
        return res.data;
      },

      keepUnusedDataFor: 0,

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    /* 3. SINGLE PRODUCT */
    getProduct: builder.query<Product, string>({
      query: (id) => {
        const url = `/public/${OWNER_ID}/${BUSINESS_ID}/products?_id=${id}`;
        return url;
      },
      transformResponse: (res: ApiResponse<Product>) => {
        return res.data;
      },
      providesTags: (r) =>
        r
          ? [{ type: "Product", id: r._id }]
          : [{ type: "Products", id: "LIST" }],
    }),

    /* 4. ONLINE ORDER */
    createOnlineOrder: builder.mutation<
      OnlineOrderResponse,
      OnlineOrderPayload
    >({
      query: (body) => {
        const url = `/public/${OWNER_ID}/${BUSINESS_ID}/online-order`;
        return {
          url,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["OnlineOrder"],
    }),

    /* 5. ONLINE ORDER WITH SSL */
    createOnlineOrderWithSSL: builder.mutation<
      OnlineOrderResponse,
      OnlineOrderPayload
    >({
      query: (body) => {
        const url = `/public/${OWNER_ID}/${BUSINESS_ID}/online-order-with-ssl`;
        return {
          url,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["OnlineOrder"],
    }),

    /* 6. CATEGORIES */
    getCategories: builder.query<Category[], void>({
      query: () => {
        const url = `/public/${OWNER_ID}/${BUSINESS_ID}`;
        return url;
      },
      transformResponse: (res: ApiResponse<Business[]>) => {
        return res.data[0].categories;
      },
      providesTags: (r) =>
        r ? r.map((c) => ({ type: "Category" as const, id: c._id })) : [],
    }),
  }),
});

/* HOOK EXPORTS */
export const {
  useGetBusinessQuery,
  useGetProductsQuery,
  useGetProductQuery,
  useCreateOnlineOrderMutation,
  useCreateOnlineOrderWithSSLMutation,
  useGetCategoriesQuery,
} = publicApi;
