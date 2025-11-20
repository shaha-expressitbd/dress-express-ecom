"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/utils/gtm";
import { storeUtmParams } from "@/utils/gtm";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView(pathname);
    storeUtmParams();
  }, [pathname]);

  return (
    <>
      {children}


      {/* <ConsentManager /> */}
    </>
  );
}