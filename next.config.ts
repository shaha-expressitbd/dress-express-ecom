/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"], // modern, smaller formats
    minimumCacheTTL: 60 * 60 * 24 * 30, // cache images for 30 days
    deviceSizes: [320, 480, 640, 768, 1024, 1280, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.calquick.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cloude.calquick.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "calquick.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "calquick.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "backend.calquick.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "securepay.sslcommerz.com",
        pathname: "/public/image/**",
      },
      {
        protocol: "http",
        hostname: "localhost:3000",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "cloudecalquick.xyz",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.cloudecalquick.xyz",
        pathname: "/**",
      },
    ],
    // unoptimized: true, // Temporary for debugging
  },
  crossOrigin: "anonymous",
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_OWNER_ID: process.env.NEXT_PUBLIC_OWNER_ID,
    NEXT_PUBLIC_BUSINESS_ID: process.env.NEXT_PUBLIC_BUSINESS_ID,

    NEXT_PUBLIC_IMAGE_URL: process.env.NEXT_PUBLIC_IMAGE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_IA_BASE_URL: process.env.NEXT_PUBLIC_IA_BASE_URL,
    ALLOWED_HOSTS: process.env.ALLOWED_HOSTS,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    NEXT_PUBLIC_TAG_SERVER: process.env.NEXT_PUBLIC_TAG_SERVER,
    NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION:
      process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION,
  },
};

module.exports = nextConfig;
