"use client";

import Image from "next/image";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { Button } from "../atoms/button";
import { formatCurrency } from "@/utils/formatCurrency";
import type { TCartItem } from "@/lib/features/cart/cartSlice";
import type { TPreorderCartItem } from "@/lib/features/preOrderCartSlice/preOrderCartSlice";
import { twMerge } from "tailwind-merge";

export interface CartItemProps {
  item: TCartItem | TPreorderCartItem;
  onRemove: () => void;
  onQuantityChange?: (quantity: number) => void;
  showQuantityControls?: boolean;
  currency?: string;
  ignoreStockCap?: boolean;
  compact?: boolean;
}

export function CartItem({
  item,
  onRemove,
  onQuantityChange,
  showQuantityControls = false,
  currency = "BDT",
  ignoreStockCap = false,
  compact = false,
}: CartItemProps) {
  /* --------------------------------------------------------------
     Defensive guards
  -------------------------------------------------------------- */
  const rawImage = item?.image || "";
  const envPrefix = process.env.NEXT_PUBLIC_IMAGE_URL || "";
  const imageSrc = rawImage.startsWith("http")
    ? rawImage
    : envPrefix
      ? `${envPrefix}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`
      : rawImage; // may end up empty → fallback UI below

  const unitPrice = Number(item?.price ?? 0);
  const qty = Number(item?.quantity ?? 0);
  const maxStock = Number(item?.maxStock ?? Infinity);
  const totalPrice = unitPrice * qty;
  const variantValues = Array.isArray(item?.variantValues)
    ? item.variantValues
    : []; // Default to empty array if undefined

  const canInc = ignoreStockCap ? true : qty < maxStock;
  const canDec = qty > 1;

  /* -------------------------------------------------------------- */
  return (
    <div
      className={twMerge(
        "group relative rounded-xl border transition-all duration-200 p-4",
        compact
          ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md dark:hover:shadow-gray-900/20"
      )}
    >
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative w-20 h-20 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 ring-1 ring-gray-200 dark:ring-gray-600 shrink-0">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={item?.name || "Product image"}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                No Image
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Header Row */}
          <div className="flex justify-between items-start gap-3 min-w-0">
            <div className="flex-col min-w-0">
              <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight break-words">
                {item?.name}
              </h3>

              {/* Variant label and Pre-Order badge */}
              <div className="flex flex-wrap gap-2 items-center mt-1 lg:mt-0">
                {variantValues.length > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 break-words flex flex-wrap gap-x-1">
                    size — {variantValues.join(" / ")}
                  </p>
                )}
                {'isPreOrder' in item && item.isPreOrder && (
                  <span className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-primary text-primary text-xs font-medium px-2 py-1 rounded-lg text-nowrap">
                    Pre-Order
                  </span>
                )}
              </div>
            </div>

            {/* Total Price Badge */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-primary dark:border-primary rounded-lg px-3 py-1.5 shrink-0">
              <span className="font-bold text-sm text-primary dark:text-primary whitespace-nowrap">
                {formatCurrency(totalPrice, currency)}
              </span>
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between mt-3 gap-2">
            {showQuantityControls ? (
              <div className="flex flex-col lg:flex-row lg:gap-6 lg:items-center min-w-0">
                <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shrink-0">
                  <button
                    type="button"
                    title="Decrease Quantity"
                    className="h-5 w-5 rounded-lg text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center disabled:opacity-40"
                    onClick={() => onQuantityChange?.(Math.max(1, qty - 1))}
                    disabled={!canDec}
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center min-w-[40px] px-1 select-none">
                    <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {qty}
                    </span>
                  </div>

                  <button
                    type="button"
                    title="Increase Quantity"
                    className="h-5 w-5 rounded-lg text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center disabled:opacity-40"
                    onClick={() => onQuantityChange?.(qty + 1)}
                    disabled={!canInc}
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-600">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Qty: {qty}
                </span>
              </div>
            )}

            {/* Remove Button */}
            <Button
              title="Remove Item"
              variant="ghost"
              className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group/remove shrink-0"
              onClick={onRemove}
              aria-label="Remove item"
            >
              <FiTrash2 className="w-4 h-4 transition-transform duration-200 group-hover/remove:scale-110" />
            </Button>
          </div>

          {/* Stock Warning */}
          {!ignoreStockCap && qty >= maxStock && (
            <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
              Maximum stock reached
            </div>
          )}
        </div>
      </div>
    </div>
  );
}