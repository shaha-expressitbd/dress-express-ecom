// app/(public)/products/[slug]/layout.tsx
import "@/app/globals.css";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Product Details - Azmain Fashion",
  description: "View detailed product information",
  openGraph: {
    title: "Product Details - Azmain Fashion",
    description: "View detailed product information",
    type: "website",
    images: [{ url: "/fallback-image.jpg" }],
  },
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>{children}</div>
  );
}