"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItems } from "@/config/routes.config";

export default function SecondBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 5);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`w-full z-50 transition-all duration-300 hidden md:block ${isScrolled
        ? "bg-white/95 dark:bg-[#1A2A27]/95 shadow-md py-1"
        : "bg-white dark:bg-[#1A2A27] py-1"
        }`}
    >
      <div className="container mx-auto flex items-center justify-center px-4">
        <ul className="flex items-center justify-center flex-1 space-x-4 text-gray-700 dark:text-gray-300">
          {menuItems.map((item) => (
            <li key={item.title} className="flex items-center gap-1">
              {item.icon && <item.icon className="text-primary" />}
              <Link
                href={item.path ?? "/"}
                className={`inline-block font-medium transition-colors hover:text-primary dark:hover:text-white ${pathname === item.path ? "border-b-2 border-primary" : ""
                  }`}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}