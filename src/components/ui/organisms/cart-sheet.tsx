"use client";

import { useBusiness } from "@/hooks/useBusiness";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";
import {
  FiShoppingCart,
  FiX,
  FiShoppingBag,
  FiArrowRight,
  FiHeart,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowLeft,
} from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "../atoms/button";
import { Sheet, SheetContent, SheetFooter } from "../molecules/sheet";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { TCartItem } from "@/lib/features/cart/cartSlice";
import { RiLuggageCartFill } from "react-icons/ri";

// src/components/ui/organisms/cart-sheet.tsx
function CartItemComponent({
  item,
  onRemove,
  onQuantityChange,
}: {
  item: TCartItem;
  onRemove: () => void;
  onQuantityChange: (q: number) => void;
}) {
  const src = item.image.startsWith("http")
    ? item.image
    : `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.image.startsWith("/") ? "" : "/"}${item.image}`;

  return (
    <div className="flex gap-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative flex-shrink-0 h-24 w-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <Image
          src={src}
          alt={item.name}
          fill
          sizes="100px"
          className="object-cover"
          priority
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 break-words">
            {item.name}
          </h3>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onRemove}
            className="text-red-500 hover:text-red-600 transition-colors"
            aria-label="Remove"
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>

        {item.variantValues?.length > 0 && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Size — {item.variantValues.join(" / ")}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between gap-4">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {item.isWithinOffer && item.sellingPrice !== item.price ? (
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">
                  {formatCurrency(item.price, item.currency || "BDT")}
                </span>
                <span className="line-through text-gray-500 dark:text-gray-400">
                  {formatCurrency(item.sellingPrice, item.currency || "BDT")}
                </span>
              </div>
            ) : (
              <span>{formatCurrency(item.price, item.currency || "BDT")}</span>
            )}
          </div>
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => onQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiMinus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">
              {item.quantity}
            </span>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => onQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.maxStock}
              className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPlus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartSheet() {
  const router = useRouter();
  const { businessData } = useBusiness();
  const {
    items,
    itemCount,
    isOpen,
    subtotal,
    discount,
    removeItem,
    closeCart,
    openCart,
    updateItemQuantity,
  } = useCart();

  console.log("cartitems:", items);
  const currency = businessData?.currency?.[0] || "BDT";
  const [mounted, setMounted] = useState(false);
  const [bump, setBump] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMounted(true);
    console.log("CartSheet: Component mounted, isOpen:", isOpen, "localIsOpen:", localIsOpen);
  }, [isOpen, localIsOpen]);

  useEffect(() => {
    setLocalIsOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!localIsOpen) return;

    const handler = (e: MouseEvent) => {
      try {
        const target = e.target as HTMLElement;
        // Ignore clicks on the trigger button
        if (triggerRef.current && (triggerRef.current === target || triggerRef.current.contains(target))) {
          console.log("CartSheet: Click on trigger button, ignoring");
          return;
        }
        // Ignore clicks inside the cart sheet
        if (wrapperRef.current && (wrapperRef.current === target || wrapperRef.current.contains(target))) {
          return;
        }
        console.log("CartSheet: Outside click detected, closing cart");
        closeCart();
        setLocalIsOpen(false);
      } catch (error) {
        console.error("CartSheet: Error handling click outside:", error);
        closeCart();
        setLocalIsOpen(false);
      }
    };

    // Delay to avoid immediate closure after opening
    const timeout = setTimeout(() => {
      window.addEventListener("click", handler);
    }, 100);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("click", handler);
    };
  }, [localIsOpen, closeCart]);

  const handleRemove = useCallback(
    (id: string, variantId: string) => {
      removeItem(id, variantId);
      toast.success("Item removed from cart", { duration: 700 });
    },
    [removeItem]
  );

  const handleQty = useCallback(
    (id: string, variantId: string, q: number) => {
      if (q < 1) {
        handleRemove(id, variantId);
      } else {
        updateItemQuantity(id, variantId, q);
      }
    },
    [handleRemove, updateItemQuantity]
  );

  const handleCheckout = useCallback(async () => {
    console.log("handleCheckout: Starting, items:", items.length, "isOpen:", isOpen, "localIsOpen:", localIsOpen);
    if (items.length === 0) {
      console.log("handleCheckout: Cart is empty");
      toast.warning("Your cart is empty", { duration: 2000 });
      return;
    }

    if (isNavigating) {
      console.log("handleCheckout: Navigation already in progress");
      return;
    }

    try {
      setIsNavigating(true);
      console.log("handleCheckout: Closing cart...");
      await closeCart();
      setLocalIsOpen(false);
      console.log("handleCheckout: Cart closed, waiting 300ms...");
      await new Promise((resolve) => setTimeout(resolve, 300));
      console.log("handleCheckout: Navigating to /checkout");
      router.push("/checkout");
      console.log("handleCheckout: Navigation triggered");
      setIsNavigating(false);
    } catch (error) {
      console.error("handleCheckout: Navigation error:", error);
      toast.error("Failed to navigate to checkout. Please try again.", { duration: 3000 });
      setIsNavigating(false);
      console.log("handleCheckout: Fallback navigation to /checkout");
      window.location.href = "/checkout";
    }
  }, [items.length, isNavigating, closeCart, router, isOpen, localIsOpen]);

  const handleOpenCart = useCallback(() => {
    console.log("CartSheet: Trigger button clicked, calling openCart");
    setBump(true);
    setTimeout(() => setBump(false), 300);
    openCart();
    setLocalIsOpen(true);
    console.log("CartSheet: openCart called, isOpen:", isOpen, "localIsOpen:", true);
  }, [openCart, isOpen]);

  const trigger = (

    <Button
      title="Open Cart"
      variant="ghost"
      ref={triggerRef}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.preventDefault();
        handleOpenCart();
      }}
      className="p-0"
    >
      <div className="relative">
        <div>
          <RiLuggageCartFill className="w-8 h-8 text-pink-600 " />
        </div>

        {mounted && itemCount > 0 && (
          <>
            <span
              className="absolute -top-3 -right-3 bg-gradient-to-r from-primary to-black text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center ring-2 ring-white dark:ring-gray-800"
            >
              {itemCount > 9 ? "9+" : itemCount}
            </span>
            <div className="absolute -top-4 -right-3 w-5 h-5 rounded-full bg-red-500 animate-ping opacity-60" />
          </>
        )}
      </div>
    </Button>

  );

  return (
    <>
      {trigger}
      <Sheet isOpen={localIsOpen || isOpen}>

        <SheetContent className="p-0">
          <div
            ref={wrapperRef}
            className="flex flex-col h-screen sm:max-w-md bg-white dark:bg-gray-900 overflow-hidden"
          >
            <div className="relative px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <FiShoppingBag className="w-5 h-5 text-primary dark:text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      Shopping Cart
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    console.log("CartSheet: Close button clicked");
                    closeCart();
                    setLocalIsOpen(false);
                  }}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-1 md:p-2 space-y-3 sm:space-y-4 mb-48 no-scrollbar">
              {items.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-full gap-6 p-6 sm:p-8"
                >
                  <div className="relative">
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                      <FiShoppingCart className="w-16 h-16 text-gray-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 p-2 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                      <FiHeart className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white">
                      Your cart is empty
                    </h3>
                    <p className="text-black dark:text-gray-400 max-w-xs text-sm">
                      Discover amazing products and start building your perfect order
                    </p>
                  </div>

                  <div>
                    <Button
                      title="Start Shopping"
                      variant="gradient"
                      onClick={() => {
                        console.log("CartSheet: Start Shopping button clicked");
                        closeCart();
                        setLocalIsOpen(false);
                      }}
                    >
                      <Link href="/products" className="flex items-center gap-2">
                        <FiShoppingBag className="w-4 h-4" />
                        Start Shopping
                        <FiArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((it: TCartItem) => (
                    <div
                      key={`${it._id}-${it.variantId}`}
                      className="p-1 md:p-2 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
                    >
                      <CartItemComponent
                        item={it}
                        onRemove={() => handleRemove(it._id, it.variantId as string)}
                        onQuantityChange={(q) => handleQty(it._id, it.variantId as string, q)}
                      />
                    </div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {items.length > 0 && (
              <div
                className="border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-t from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50"
              >
                <SheetFooter className="p-2 sm:p-2 space-y-2">
                  <div className="space-y-3 p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal, currency)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span>Discount</span>
                        <span>-{formatCurrency(discount, currency)}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <Button
                        title="Secure Checkout"
                        variant="gradient"
                        size="md"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={handleCheckout}
                        disabled={isNavigating || items.length < 1}
                        className="group"
                      >
                        <div className="flex w-full items-center justify-center gap-3">
                          <span>এগিয়ে যান</span>
                          {isNavigating ? (
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-1">
                                <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" />
                                <div
                                  className="w-1 h-1 bg-white/60 rounded-full animate-pulse"
                                  style={{ animationDelay: "0.2s" }}
                                />
                                <div
                                  className="w-1 h-1 bg-white/60 rounded-full animate-pulse"
                                  style={{ animationDelay: "0.4s" }}
                                />
                              </div>
                              <FiArrowRight className="w-4 sm:w-5 h-4 sm:h-5 transition-transform group-hover:translate-x-0.5" />
                            </>
                          )}
                        </div>
                      </Button>
                    </div>

                    <div>
                      <Button
                        title="Continue Shopping"
                        variant="gradient"
                        size="sm"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => {
                          console.log("CartSheet: Continue Shopping button clicked");
                          closeCart();
                          setLocalIsOpen(false);
                        }}
                        className="group"
                      >
                        <div className="flex items-center justify-center gap-3">
                          <FiArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 transition-transform group-hover:-translate-x-0.5" />
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" />
                            <div
                              className="w-1 h-1 bg-white/60 rounded-full animate-pulse"
                              style={{ animationDelay: "0.2s" }}
                            />
                            <div
                              className="w-1 h-1 bg-white/60 rounded-full animate-pulse"
                              style={{ animationDelay: "0.4s" }}
                            />
                          </div>
                          <span>আরও কিনুন</span>
                        </div>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center">
                      <div className="w-1 h-2 bg-white rounded-full" />
                    </div>
                    <span>Secure SSL encrypted checkout</span>
                  </div>
                </SheetFooter>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}