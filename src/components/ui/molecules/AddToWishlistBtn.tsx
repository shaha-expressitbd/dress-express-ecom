"use client";

import { useCallback } from "react";
import { FiHeart } from "react-icons/fi";
import { toast } from "sonner";
import type { Product, Variant } from "@/types/product";
import { useWishlist } from "@/hooks/useWishlist";

interface Props {
    item: Product;
    variant?: Variant | null;
    requireVariant?: boolean;
    size?: "sm" | "md" | "icon";
    className?: string;
    labelOn?: string;
    labelOff?: string;
    onVariantMissing?: () => void;
}

export default function AddToWishlistBtn({
    item,
    variant = null,
    requireVariant = false,
    size = "sm",
    className,
    labelOn = "Wishlisted",
    labelOff = "Wishlist",
    onVariantMissing,
}: Props) {
    const { items, addItem, removeItem } = useWishlist();

    /* সঠিক variantId খুঁজে বের করি */
    const variantId =
        variant?._id ?? item.variantsId?.[0]?._id ?? item._id;

    const isWishlisted = items.some((i) => i._id === variantId);

    /* ---------------- handler ---------------- */
    const handleClick = useCallback(() => {
        if (requireVariant && !variant) {
            toast.error("Please select a variant first");
            onVariantMissing?.();
            return;
        }
        const outOfStock =
            variant ? variant.variants_stock <= 0 : item.total_stock <= 0;

        if (outOfStock) {
            toast.error("Out of stock");
            return;
        }

        /* remove */
        if (isWishlisted) {
            removeItem(variantId);
            toast.success("Removed from wishlist");
            return;
        }

        /* add */
        const selectedV = variant ?? item.variantsId?.[0];
        const sellingPrice = Number(selectedV?.selling_price ?? 0);
        const offerPrice = Number(selectedV?.offer_price ?? sellingPrice);
        const now = Date.now();
        const offerStart = selectedV?.discount_start_date ? new Date(selectedV.discount_start_date).getTime() : 0;
        const offerEnd = selectedV?.discount_end_date ? new Date(selectedV.discount_end_date).getTime() : 0;
        const price = (offerPrice < sellingPrice && now >= offerStart && now <= offerEnd) ? offerPrice : sellingPrice;

        addItem({
            _id: variantId,
            productId: item._id,
            name: item.name,
            price,
            currency: "BDT",
            image: `${process.env.NEXT_PUBLIC_IMAGE_URL
                }${variant?.image?.alterImage.secure_url ??
                item.images[0]?.alterImage.secure_url
                }`,
            variantValues: variant?.variants_values ?? [],
        });
        toast.success("Added to wishlist");
    }, [
        item,
        variant,
        requireVariant,
        isWishlisted,
        addItem,
        removeItem,
        variantId,
        onVariantMissing,
    ]);

    /* ---------------- UI ---------------- */
    return (
        <button
            onClick={handleClick}
            aria-label={isWishlisted ? labelOn : labelOff}
            className={`inline-flex items-center justify-center border rounded-md ${size === "icon" ? "p-1" : "px-3 py-1"
                } ${isWishlisted
                    ? "text-red-500 border-red-400 bg-red-50"
                    : "text-gray-600 border-gray-300 bg-white"
                } ${className ?? ""}`}
        >
            <FiHeart
                size={size === "icon" ? 18 : 16}
                fill={isWishlisted ? "#ef4444" : "none"}
            />
            {size !== "icon" && (
                <span className="ml-1 text-sm">
                    {isWishlisted ? labelOn : labelOff}
                </span>
            )}
        </button>
    );
}