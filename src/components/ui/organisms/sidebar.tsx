"use client";

import { menuItems } from "@/config/routes.config";
import { useSidebar } from "@/hooks/useSidebar";
import { sidebarRef } from "@/lib/refs";
import { useBusiness } from "@/hooks/useBusiness";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  FaCaretDown,
  FaCaretUp,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import Logo from "../atoms/logo";
import { twMerge } from "tailwind-merge";

/* ---------- styling helpers ---------- */
const indentCls = ["pl-4", "pl-8", "pl-12", "pl-16", "pl-20"];
/** চোখে পড়ার মতো হাইলাইট */
const highlightCls =
  "bg-primary text-white font-semibold border-l-[5px] border-pink-500 shadow-md shadow-pink-500/40";
/** নরমাল হোভার স্টেট */
const hoverCls =
  "hover:bg-secondary hover:text-gray-100 transition-colors duration-150";

export default function Sidebar() {
  const { isSidebarOpen, isDesktop, close } = useSidebar();
  const { businessData } = useBusiness();
  const pathname = usePathname();
  const router = useRouter();

  /* accordion states */
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [openCatIds, setOpenCatIds] = useState<Set<string>>(new Set());

  /* helpers */
  const toggleMenu = (t: string) =>
    setOpenMenus(p => (p.includes(t) ? p.filter(x => x !== t) : [...p, t]));
  const toggleCat = (id: string) =>
    setOpenCatIds(p => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  /* category list */
  const categories = useMemo(() => businessData?.categories ?? [], [businessData]);

  /* ডিফল্টে সব ক্যাটাগরি ওপেন */
  useEffect(() => {
    if (!categories.length || openCatIds.size) return;
    const gather = (cats: any[]): string[] =>
      cats.flatMap(c => [c._id, ...(c.children ? gather(c.children) : [])]);
    setOpenCatIds(new Set(gather(categories)));
  }, [categories, openCatIds.size]);

  /* ইউআরএল থেকে একচুয়াল স্লাগ */
  const selectedSlug = pathname.startsWith("/category/")
    ? decodeURIComponent(pathname.split("/")[2]).toLowerCase()
    : null;

  /* ---------- recursive CategoryItem ---------- */
  const CategoryItem = ({
    cat,
    level = 0,
  }: {
    cat: any;
    level?: number;
  }) => {
    const hasChildren = Array.isArray(cat.children) && cat.children.length > 0;
    const isOpen = openCatIds.has(cat._id);
    const isActive = selectedSlug === cat.name.toLowerCase();

    const go = () => {
      router.push(`/category/${encodeURIComponent(cat.name.toLowerCase())}`);
      !isDesktop && close();
    };

    return (
      <li className="flex flex-col">
        <button
          onClick={hasChildren ? () => toggleCat(cat._id) : go}
          className={twMerge(
            "flex items-center justify-between w-full rounded py-2 pr-3 text-left",
            indentCls[Math.min(level, indentCls.length - 1)],
            hoverCls,
            isActive && highlightCls
          )}
        >
          <span className="truncate">{cat.name}</span>
          {hasChildren &&
            (isOpen ? (
              <FaChevronDown
                className={twMerge(
                  "shrink-0 w-4 h-4 md:w-3 md:h-3",
                  isActive && "text-white"
                )}
              />
            ) : (
              <FaChevronRight
                className={twMerge(
                  "shrink-0 w-4 h-4 md:w-3 md:h-3",
                  isActive && "text-white"
                )}
              />
            ))}
        </button>

        {hasChildren && isOpen && (
          <ul className="flex flex-col gap-0.5">
            {cat.children.map((child: any) => (
              <CategoryItem key={child._id} cat={child} level={level + 1} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  /* ---------- wrapper ---------- */
  const sidebarClasses =
    "h-full w-64 fixed top-0 left-0 z-50 flex flex-col text-black dark:text-white " +
    "bg-white dark:bg-gray-800";

  const SidebarOverlay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black dark:bg-white z-40"
      onClick={close}
    />
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* ---------- header ---------- */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        <Link href="/" onClick={!isDesktop ? close : undefined}>
          <Logo />
        </Link>
        {!isDesktop && (
          <button onClick={close} className="text-2xl focus:outline-none">
            &times;
          </button>
        )}
      </div>

      {/* ---------- menu ---------- */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* top-level menu items */}
        {menuItems.map(item => {
          const hasSub = !!item.submenu;
          const isActive = item.path === pathname;
          const isGroupActive =
            hasSub && item.submenu!.some(sub => sub.path === pathname);
          const isOpen = openMenus.includes(item.title) || isGroupActive;

          if (hasSub) {
            return (
              <div key={item.title}>
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={twMerge(
                    "flex justify-between items-center w-full p-2 rounded",
                    hoverCls,
                    isGroupActive && highlightCls
                  )}
                >
                  <div className="flex items-center gap-2">
                    {item.icon && (
                      <item.icon
                        className={twMerge(
                          "w-4 h-4 text-gray-400",
                          (isGroupActive || isActive) && "text-white"
                        )}
                      />
                    )}
                    <span>{item.title}</span>
                  </div>
                  {isOpen ? (
                    <FaCaretUp className="w-4 h-4" />
                  ) : (
                    <FaCaretDown className="w-4 h-4" />
                  )}
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <ul className="pl-6 mt-1 space-y-1">
                    {item.submenu!.map(sub => (
                      <li key={sub.title}>
                        <Link
                          href={sub.path}
                          onClick={!isDesktop ? close : undefined}
                          className={twMerge(
                            "flex items-center gap-2 px-2 py-1 rounded",
                            hoverCls,
                            pathname === sub.path && highlightCls
                          )}
                        >
                          {sub.icon && (
                            <sub.icon
                              className={twMerge(
                                "w-4 h-4 text-gray-400",
                                pathname === sub.path && "text-white"
                              )}
                            />
                          )}
                          <span>{sub.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            );
          }

          return (
            <Link
              key={item.title}
              href={item.path!}
              onClick={!isDesktop ? close : undefined}
              className={twMerge(
                "flex items-center gap-2 px-2 py-2 rounded",
                hoverCls,
                isActive && highlightCls
              )}
            >
              {item.icon && (
                <item.icon
                  className={twMerge("w-4 h-4 text-primary ", isActive && "text-white")}
                />
              )}
              <span>{item.title}</span>
            </Link>
          );
        })}

        {/* divider */}
        {categories.length > 0 && (
          <hr className="my-3 border-gray-600/50 dark:border-gray-500" />
        )}

        {/* categories accordion */}
        {categories.length > 0 && (
          <details open className="space-y-1">
            <summary className="cursor-pointer select-none font-medium flex items-center justify-between py-1">
              <span>All Categories</span>
              <span className="text-xs opacity-80">
                {openCatIds.size > 0 ? <FaCaretUp /> : <FaCaretDown />}
              </span>
            </summary>

            <ul className="mt-1 flex flex-col gap-0.5">
              {categories.map((c: any) => (
                <CategoryItem key={c._id} cat={c} />
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );

  /* ---------- final render ---------- */
  if (isDesktop) {
    return (
      <aside ref={sidebarRef} className={sidebarClasses}>
        <SidebarContent />
      </aside>
    );
  }

  return (
    <>
      {isSidebarOpen && <SidebarOverlay />}
      <motion.aside
        ref={sidebarRef}
        className={sidebarClasses}
        initial={{ x: "-100%" }}
        animate={{ x: isSidebarOpen ? 0 : "-100%" }}
        exit={{ x: "-100%" }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.45 }}
      >
        <SidebarContent />
      </motion.aside>
    </>
  );
}
