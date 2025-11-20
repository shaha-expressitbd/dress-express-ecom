'use server';

import { publicApi } from "@/lib/api/publicApi";
import { makeStore } from "@/lib/store";
import { stripHtml } from "@/utils/stripHTML";
import { generateSlug } from "@/utils/slug"; // Only import generateSlug since extractIdFromSlug is not needed
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ProductDetail from "./product-details";
import { Product } from "@/types/product";


// Fetch product by ID
async function getProductById(id: string): Promise<Product | null> {
  const store = makeStore();
  const res = await store.dispatch(
    publicApi.endpoints.getProducts.initiate({ _id: id })
  );
  return res.data?.[0] || null;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { id?: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const { id } = await searchParams;

  console.log("Metadata - Slug:", slug, "ID:", id);

  if (!id) {
    return {
      title: "পণ্য পাওয়া যায়নি",
      description: "কোনো পণ্য পাওয়া যায়নি।",
    };
  }

  const product = await getProductById(id);
  if (!product) {
    return {
      title: "পণ্য পাওয়া যায়নি",
      description: "কোনো পণ্য পাওয়া যায়নি।",
    };
  }

  const siteImageUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emegadeal.com";
  const expectedSlug = generateSlug(product.name, product._id);
  const canonicalUrl = `${baseUrl}/product/${expectedSlug}`;

  const rawDescription = product.short_description || "পণ্যের বিস্তারিত বিবরণ দেখুন";
  const cleanedDescription = stripHtml(rawDescription);

  const firstImg = product.images?.[0]?.alterImage?.secure_url
    ? `${siteImageUrl}${product.images[0].alterImage.secure_url}`
    : `${siteImageUrl}/fallback-image.jpg`;

  return {
    title: `${product.name} | Emegadeal`,
    description: cleanedDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      url: canonicalUrl,
      title: product.name,
      description: cleanedDescription,
      images: [
        {
          url: firstImg,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: baseUrl?.replace(/^https?:\/\//, ""),
      title: product.name,
      description: cleanedDescription,
      images: [firstImg],
    },
  };
}

// Product page component
export default async function ProductPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { id?: string };
}) {
  const { slug } = await params;
  const { id } = await searchParams;

  console.log("ProductPage - Slug:", slug, "ID:", id);

  // Check if id is provided
  if (!id) {
    console.error("No product ID provided in query parameters");
    return notFound();
  }

  // Fetch product by ID
  const product = await getProductById(id);
  if (!product) {
    console.error("Product not found for ID:", id);
    return notFound();
  }

  // Generate the expected slug
  const expectedSlug = generateSlug(product.name, product._id);

  // Remove query parameter part for comparison
  const cleanSlug = slug.split("?")[0];
  const cleanExpectedSlug = expectedSlug.split("?")[0];

  // Redirect if the slug doesn't match to prevent duplicate content
  if (cleanSlug !== cleanExpectedSlug) {
    redirect(`/product/${expectedSlug}`);
  }

  return <ProductDetail product={product} />;
}