"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { BiX, BiMinus, BiPlus } from "react-icons/bi";
import { useCart } from "@/hooks/useCart";
import { usePreorderCart } from "@/hooks/usePreorderCart";
import { useWishlist } from "@/hooks/useWishlist";
import type { Variant, Product } from "@/types/product";
import { TCartItem } from "@/lib/features/cart/cartSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/atoms/button";
import { TWishlistItem } from "@/types/TWishlistItem";

interface Props {
  isOpen: boolean;
  variants: Variant[];
  selectedId?: string;
  onSelect: (variant: Variant) => void;
  onClose: () => void;
  product?: Pick<Product, "_id" | "name" | "images" | "hasVariants" | "total_stock"> & Partial<Product>;
  isWishlistModal?: boolean;
}

export default function VariantSelectModal({
  isOpen,
  variants,
  selectedId,
  onSelect,
  onClose,
  product,
  isWishlistModal = false,
}: Props) {
  const [currentId, setCurrentId] = useState<string | undefined>(selectedId);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    variants.reduce((acc, v) => ({ ...acc, [v._id]: 1 }), {})
  );

  const { addItem: addToCart, openCart } = useCart();
  const { addItem: addToPreorderCart } = usePreorderCart();
  const { addItem: addToWishlist } = useWishlist();

  const wasOpen = useRef(false);
  const scrollY = useRef(0);

  // Sync selectedId
  useEffect(() => {
    setCurrentId(selectedId);
  }, [selectedId]);

  // Body scroll lock + padding fix
  useEffect(() => {
    if (!isOpen) {
      if (wasOpen.current) {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        document.body.style.top = "";
        document.body.style.position = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY.current);
        wasOpen.current = false;
      }
      return;
    }

    wasOpen.current = true;
    scrollY.current = window.scrollY;

    // Lock scroll
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY.current}px`;
    document.body.style.width = "100%";

    // Fix scrollbar gap
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.body.style.top = "";
      document.body.style.position = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY.current);
    };
  }, [isOpen]);

  const handleClose = () => {
    setQuantities(variants.reduce((acc, v) => ({ ...acc, [v._id]: 1 }), {}));
    onClose();
  };

  const handleQtyChange = (variantId: string, val: number, stock: number) => {
    setQuantities((prev) => ({
      ...prev,
      [variantId]: Math.min(Math.max(1, val), stock),
    }));
  };

  const handlePick = (v: Variant) => {
    setCurrentId(v._id);
    const now = Date.now();
    const offerStart = v.discount_start_date ? new Date(v.discount_start_date).getTime() : 0;
    const offerEnd = v.discount_end_date ? new Date(v.discount_end_date).getTime() : 0;
    const isWithinOffer = Number(v.offer_price) < Number(v.selling_price) && now >= offerStart && now <= offerEnd;
    const price = Number(isWithinOffer ? v.offer_price : v.selling_price);
    const quantity = quantities[v._id] || 1;

    if (v.isPreOrder && product) {
      if (isWishlistModal) {
        toast.error("This item cannot be added to wishlist");
        handleClose();
        return;
      }

      const preorderItem: TCartItem & { isPreOrder: true } = {
        _id: v._id,
        productId: product._id,
        name: product.name,
        price,
        image: `${process.env.NEXT_PUBLIC_IMAGE_URL}${v.image?.alterImage.secure_url ?? product.images[0].alterImage.secure_url}`,
        quantity,
        maxStock: v.variants_stock,
        variantValues: v.variants_values ?? [],
        variantId: v._id,
        isPreOrder: true,
        currency: "BDT",
        sellingPrice: Number(v.selling_price),
        isWithinOffer,
      };

      addToPreorderCart(preorderItem);
      toast.success("Proceeding to checkout with pre-order item");
      onSelect(v);
      handleClose();
      openCart();
    } else {
      if (isWishlistModal) {
        const wishlistItem: TWishlistItem = {
          _id: v._id,
          productId: product!._id,
          name: product!.name,
          price,
          image: `${process.env.NEXT_PUBLIC_IMAGE_URL}${v.image?.alterImage.secure_url ?? product!.images[0].alterImage.secure_url}`,
          variantValues: v.variants_values ?? [],
          currency: "BDT",
          sellingPrice: Number(v.selling_price),
          isWithinOffer,
        };

        addToWishlist(wishlistItem);
        toast.success("Added to wishlist");
        onSelect(v);
        handleClose();
      } else {
        const cartItem: TCartItem = {
          _id: v._id,
          productId: product!._id,
          name: product!.name,
          price,
          image: `${process.env.NEXT_PUBLIC_IMAGE_URL}${v.image?.alterImage.secure_url ?? product!.images[0].alterImage.secure_url}`,
          quantity,
          maxStock: v.variants_stock,
          variantValues: v.variants_values ?? [],
          variantId: v._id,
          currency: "BDT",
          sellingPrice: Number(v.selling_price),
          isWithinOffer,
        };

        addToCart(cartItem);
        toast.success("Added to cart");
        onSelect(v);
        handleClose();
        openCart();
      }
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="variant-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 sm:p-6 flex items-center justify-between">
          <div>
            <h2 id="variant-modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
              পছন্দ নির্বাচন করুন
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {variants.length} টি অপশন উপলব্ধ
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Close"
          >
            <BiX className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {variants.map((v) => {
            const isDisabled = v.variants_stock <= 0;
            const size = (v.variants_values ?? []).join(" / ");
            const isSelected = currentId === v._id;
            const imgSrc = `${process.env.NEXT_PUBLIC_IMAGE_URL}${v.image?.alterImage.optimizeUrl || v.image?.alterImage.secure_url || product?.images[0]?.alterImage.secure_url
              }`;
            const now = Date.now();
            const offerStart = v.discount_start_date ? new Date(v.discount_start_date).getTime() : 0;
            const offerEnd = v.discount_end_date ? new Date(v.discount_end_date).getTime() : 0;
            const isWithinOffer = Number(v.offer_price) < Number(v.selling_price) && now >= offerStart && now <= offerEnd;
            const quantity = quantities[v._id] || 1;

            return (
              <div
                key={v._id}
                className={`flex items-start p-3 border rounded-lg transition-all ${isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : isSelected
                      ? "border-red-500 bg-red-50 dark:bg-red-950"
                      : "border-gray-200 dark:border-gray-700 hover:border-red-400"
                  }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden border flex-shrink-0">
                      <Image src={imgSrc} alt={size} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-gray-900 dark:text-white break-all">
                        সাইজ: {size}
                      </span>
                      <span className="text-primary ml-2">{v.isPreOrder ? "(Pre-Order)" : ""}</span>
                      {isDisabled ? (
                        <span className="text-sm text-red-500 block mt-1">স্টক নেই</span>
                      ) : (
                        <span className="text-sm text-gray-500 block mt-1">
                          স্টক: {v.variants_stock} টি
                        </span>
                      )}
                      <Button
                        title="Add"
                        variant="default"
                        onClick={() => !isDisabled && handlePick(v)}
                        disabled={isDisabled}
                        className="mt-2 px-3 py-1 text-sm"
                      >
                        {isWishlistModal ? "Add to Wishlist" : v.isPreOrder ? "প্রি-অর্ডার" : "অর্ডার"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="ml-3 flex-shrink-0 text-right">
                  <div className="flex flex-col items-end gap-1">
                    {isWithinOffer ? (
                      <>
                        <span className="text-lg font-bold text-red-600">
                          ৳{Number(v.offer_price).toFixed(2)}
                        </span>
                        <span className="text-sm line-through text-gray-400">
                          ৳{Number(v.selling_price).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ৳{Number(v.selling_price).toFixed(2)}
                      </span>
                    )}
                    {!isWishlistModal && !isDisabled && (
                      <div className="flex items-center border rounded-md bg-white dark:bg-gray-800 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQtyChange(v._id, quantity - 1, v.variants_stock);
                          }}
                          disabled={quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center disabled:opacity-40"
                        >
                          <BiMinus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          readOnly
                          value={quantity}
                          className="w-10 text-center text-sm font-medium bg-transparent"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQtyChange(v._id, quantity + 1, v.variants_stock);
                          }}
                          disabled={quantity >= v.variants_stock}
                          className="w-7 h-7 flex items-center justify-center disabled:opacity-40"
                        >
                          <BiPlus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4">
          <Button title="close" variant="gradient" onClick={handleClose} className="w-full">
            সম্পন্ন
          </Button>
        </div>
      </div>
    </div>
  );

  // Use createPortal
  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}