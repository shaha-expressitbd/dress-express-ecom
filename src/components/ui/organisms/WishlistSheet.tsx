"use client";

import { useBusiness } from "@/hooks/useBusiness";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    FiHeart,
    FiTrash2,
    FiArrowRight,
    FiShoppingCart,
    FiArrowLeft,
    FiX,
} from "react-icons/fi";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Button } from "../atoms/button";
import { Sheet, SheetContent, SheetFooter } from "../molecules/sheet";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { FaHeart } from "react-icons/fa";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */
interface TWishlistItem {
    _id: string;
    productId: string;
    name: string;
    price: number;
    currency?: string;
    image: string;
    variantValues: string[];
}

/* -------------------------------------------------------------------------- */
/*  Row Component (desktop + mobile safe)                                     */
/* -------------------------------------------------------------------------- */
function WishlistItemRow({
    item,
    onRemove,
    onMoveToCart,
}: {
    item: TWishlistItem;
    onRemove: () => void;
    onMoveToCart: () => void;
}) {
    const src = item.image.startsWith("http")
        ? item.image
        : `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image.startsWith("/") ? "" : "/"
        }${item.image}`;

    /* stop bubbling so outside‑click handler never fires from these buttons */
    const stop = (e: React.MouseEvent | React.TouchEvent) => e.stopPropagation();

    return (
        <div className="flex gap-4 items-start">
            {/* image */}
            <div className="relative shrink-0 h-20 w-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <Image
                    src={src}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                />
            </div>

            {/* details */}
            <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 break-all">
                    {item.name}
                </h3>

                <div className="flex flex-wrap gap-x-2 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    <span>{formatCurrency(item.price, item.currency || "BDT")}</span>
                    {item.variantValues.length > 0 && (
                        <span className="truncate">{item.variantValues.join(" / ")}</span>
                    )}
                </div>
            </div>

            {/* action buttons */}
            <div className="flex flex-col items-center gap-2 shrink-0">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onMouseDown={stop}
                    onTouchStart={stop}
                    onClick={onRemove}
                    className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    aria-label="Remove"
                >
                    <FiTrash2 className="w-4 h-4" />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseDown={stop}
                    onTouchStart={stop}
                    onClick={onMoveToCart}
                    className="p-2 rounded-full bg-gradient-to-br from-primary to-red-600 text-white shadow-sm hover:shadow-md transition-all"
                    aria-label="Move to cart"
                >
                    <FiShoppingCart className="w-4 h-4" />
                </motion.button>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Main Wishlist Sheet                                                       */
/* -------------------------------------------------------------------------- */
export function WishlistSheet() {
    const router = useRouter();
    const { businessData } = useBusiness();
    const currency = businessData?.currency?.[0] || "BDT";

    const {
        items,
        itemCount,
        isOpen,
        openWishlist,
        closeWishlist,
        removeItem,
        moveToCart,
    } = useWishlist();
    const { openCart } = useCart();

    const [mounted, setMounted] = useState(false);
    const [bump, setBump] = useState(false);

    /* 👉 ref & outside‑click handler */
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => setMounted(true), []);

    /* desktop outside‑click close; mobile/TSP: no touch listener */
    useEffect(() => {
        if (!isOpen) return;

        const handleOutside = (e: MouseEvent) => {
            if (
                contentRef.current &&
                !contentRef.current.contains(e.target as Node)
            ) {
                closeWishlist();
            }
        };

        document.addEventListener("mousedown", handleOutside);

        return () => {
            document.removeEventListener("mousedown", handleOutside);
        };
    }, [isOpen, closeWishlist]);

    /* open button animation */
    const handleOpen = () => {
        setBump(true);
        setTimeout(() => setBump(false), 300);
        openWishlist();
    };

    const handleRemove = (id: string) => {
        removeItem(id);
        toast.success("Removed from wishlist", { duration: 700 });
        closeWishlist(); // Close wishlist after removing item
    };

    const handleMove = (id: string) => {
        moveToCart(id);
        openCart();
        closeWishlist(); // Close wishlist after moving item to cart
    };

    // Rest of the component remains unchanged
    return (
        <>
            {/* trigger */}
            <Button
                title="Wishlist"
                variant="ghost"
                onClick={handleOpen}
            >
                <div className="relative">
                    <div>
                        <FaHeart className="w-7 h-8 text-pink-600" />
                    </div>

                    {mounted && itemCount > 0 && (
                        <>
                            <AnimatePresence>
                                <motion.span
                                    key="badge"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow ring-2 ring-white dark:ring-gray-800"
                                >
                                    {itemCount > 9 ? "9+" : itemCount}
                                </motion.span>
                            </AnimatePresence>

                            <div className="absolute -top-4 -right-3 w-5 h-5 rounded-full bg-pink-700 animate-ping opacity-60" />
                        </>
                    )}
                </div>
            </Button>

            {/* sheet */}
            <Sheet isOpen={isOpen}>
                <SheetContent className="flex flex-col h-screen sm:max-w-md bg-white dark:bg-gray-900 overflow-hidden">
                    <div ref={contentRef} className="flex flex-col flex-1 min-h-0">
                        {/* header */}
                        <div className="relative px-5 py-5 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-b border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-pink-100 to-red-100 dark:from-pink-900/30 dark:to-red-900/30">
                                        <FiHeart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                            Wishlist
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {itemCount} {itemCount === 1 ? "item" : "items"}
                                        </p>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={closeWishlist}
                                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <FiX className="w-5 h-5 text-gray-500" />
                                </motion.button>
                            </div>
                        </div>

                        {/* list */}
                        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 mb-48 no-scrollbar">
                            {items.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center h-full gap-6 p-6 sm:p-8"
                                >
                                    <div className="p-6 rounded-3xl bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30">
                                        <FiHeart className="w-16 h-16 text-pink-400" />
                                    </div>

                                    <div className="text-center space-y-2">
                                        <h3 className="text-lg font-bold text-black dark:text-white">
                                            Wishlist is empty
                                        </h3>
                                        <p className="text-black dark:text-gray-400 text-sm max-w-xs">
                                            Browse products and add the ones you love
                                        </p>
                                    </div>

                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            title="Start Browsing"
                                            variant="gradient"
                                            onClick={closeWishlist}
                                        >
                                            <Link href="/products" className="flex items-center gap-2">
                                                Start Browsing <FiArrowRight className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <AnimatePresence>
                                    {items.map((itm) => (
                                        <motion.div
                                            key={itm._id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{
                                                opacity: 0,
                                                x: -20,
                                                height: 0,
                                                margin: 0,
                                                padding: 0,
                                                transition: { duration: 0.3 },
                                            }}
                                            transition={{ duration: 0.25 }}
                                            className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/40 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-3 shadow-sm"
                                        >
                                            <WishlistItemRow
                                                item={itm}
                                                onRemove={() => handleRemove(itm._id)}
                                                onMoveToCart={() => handleMove(itm._id)}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* footer */}
                        {items.length > 0 && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-t from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50"
                            >
                                <SheetFooter className="p-3 space-y-3">
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button
                                            title="Continue Shopping"
                                            variant="gradient"
                                            size="sm"
                                            onClick={closeWishlist}
                                            className="group"
                                        >
                                            <FiArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
                                            Continue shopping
                                        </Button>
                                    </motion.div>

                                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center">
                                            <div className="w-1 h-2 bg-white rounded-full" />
                                        </div>
                                        Secure SSL encrypted browsing
                                    </div>
                                </SheetFooter>
                            </motion.div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
