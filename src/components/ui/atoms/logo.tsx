"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useBusiness } from "@/hooks/useBusiness";

export default function Logo() {
  const { businessData } = useBusiness();
  const [imgError, setImgError] = useState(false);

  // Static fallback logo URL
  const fallbackLogoUrl = "/assets/logo.png";
  // const logoUrl = logo?.optimizeUrl || logo?.secure_url || "/assets/mega-logo.png";
  // Preload the fallback logo using useEffect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const img = document.createElement('img');
      img.src = fallbackLogoUrl;
    }
  }, []);

  if (!businessData) {
    // Show fallback immediately while loading
    return (
      <>
        {/* // <Image
      //   src={fallbackLogoUrl}
      //   alt="Loading logo"
      //   width={120}
      //   height={40}
      //   priority
      //   className="h-4 md:h-12 w-auto"
      // /> */}

      </>
    );
  }

  const { businessName, logo } = businessData;

  // const logoUrl = logo?.optimizeUrl || logo?.secure_url || fallbackLogoUrl;
  const logoUrl = fallbackLogoUrl;

  if (imgError || !logoUrl) {
    return <h1 className="text-2xl font-bold">{businessName}</h1>;
  }

  return (
    <>
      <Image
        src={logoUrl}
        alt={businessName + " logo"}
        width={140}
        height={40}
        priority
        loading="eager"
        className="h-6 md:h-12 w-auto"
        onError={() => setImgError(true)}
      />
    </>

  );
}