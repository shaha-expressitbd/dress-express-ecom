"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import { FiEye, FiHeart, FiShoppingCart } from "react-icons/fi";
import { toast } from "sonner";

import { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Button } from "../atoms/button";
import VariantSelectModal from "@/app/(public)/product/_component/VariantSelectModal";

interface ProductCardProps {
    product: Product;
    isAboveFold?: boolean;
}

export default function ProductCard({
    product,
    isAboveFold = false,
}: ProductCardProps) {
    const router = useRouter();

    /* cart */
    const { addItem: addCartItem, openCart } = useCart();

    /* wishlist */
    const {
        items: wishlistItems,
        addItem: addWishlistItem,
        removeItem: removeWishlistItem,
    } = useWishlist();

    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

    /* helpers - tomar existing logic, with adjustments for non-variant discounts */
    const { productLink, variant, priceData, badges, isOutOfStock, isPreOrder } = useMemo(() => {
        const slugify = (name: string) =>
            name
                .toLowerCase()
                .replace(/[অ-হ]/g, (c) => {
                    const m: Record<string, string> = {
                        অ: "o", আ: "a", ই: "i", ঈ: "i", উ: "u", ঊ: "u", ঋ: "ri", এ: "e", ঐ: "oi", ও: "o", ঔ: "ou", ক: "k", খ: "kh", গ: "g", ঘ: "gh",
                    };
                    return m[c] || c;
                })
                .replace(/\s+/g, "-")
                .replace(/[^\w-]+/g, "")
                .replace(/--+/g, "-")
                .replace(/^-+|-+$/g, "");

        const productLink = `/product/${slugify(product.name)}?id=${product._id}`;

        const variant =
            product.variantsId?.find(v => v.variants_stock > 0) ??
            product.variantsId?.[0] ??
            null;

        let sell: number;
        let offer: number;
        let start: number;
        let end: number;
        let isOffer: boolean;

        if (variant) {
            sell = +variant.selling_price || 0;
            offer = +variant.offer_price || sell;
            start = variant.discount_start_date ? new Date(variant.discount_start_date).getTime() : 0;
            end = variant.discount_end_date ? new Date(variant.discount_end_date).getTime() : 0;
            isOffer = offer < sell && Date.now() >= start && Date.now() <= end;
        } else {
            sell = +product.selling_price || 0;
            offer = +(product.offer_price || sell);
            start = product.discount_start_date ? new Date(product.discount_start_date).getTime() : 0;
            end = product.discount_end_date ? new Date(product.discount_end_date).getTime() : 0;
            isOffer = offer < sell && Date.now() >= start && Date.now() <= end;
        }

        const display = isOffer ? offer : sell;
        const pct = isOffer ? Math.round(((sell - offer) / sell) * 100) : 0;

        const condition = variant?.condition || "";
        const outOfStock =
            !product.isPublish ||
            (variant ? variant.variants_stock <= 0 : product.total_stock <= 0);
        const isPreOrder = product.hasVariants ? (variant?.isPreOrder ?? false) : (product.variantsId?.[0]?.isPreOrder ?? product.isPreOrder ?? false);

        return {
            productLink,
            variant,
            priceData: { sell, offer, display, pct, isOffer },
            badges: { condition, hasVariant: product.hasVariants },
            isOutOfStock: outOfStock,
            isPreOrder,
        };
    }, [product]);

    /* sync local heart state with Redux */
    useEffect(() => {
        if (!variant && product.hasVariants) return;
        const idToCheck = variant ? variant._id : product._id;
        setIsWishlisted(wishlistItems.some((i) => i._id === idToCheck));
    }, [wishlistItems, variant, product._id, product.hasVariants]);

    /* handlers - tomar existing logic */
    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isOutOfStock) {
            toast.error("Out of stock");
            return;
        }

        if (isPreOrder) {
            toast.error("Pre-order items cannot be added to wishlist");
            return;
        }

        if (!variant && product.hasVariants) return;

        const idToUse = variant ? variant._id : product._id;
        const imageToUse =
            variant?.image?.alterImage?.secure_url ??
            product.images?.[0]?.alterImage?.secure_url ??
            "/placeholder.png";
        const variantValuesToUse = variant?.variants_values ?? [];

        if (isWishlisted) {
            removeWishlistItem(idToUse);
            toast.success("Removed from wishlist");
            window?.dataLayer?.push({
                event: "remove_from_wishlist",
                item_id: idToUse,
            });
        } else {
            addWishlistItem({
                _id: idToUse,
                name: product.name,
                price: priceData.display,
                currency: "BDT",
                image: imageToUse,
                variantValues: variantValuesToUse,
            });
            toast.success("Added to wishlist!");
            window?.dataLayer?.push({
                event: "add_to_wishlist",
                item_id: idToUse,
            });
        }
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(productLink);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isOutOfStock) {
            toast.error("Out of stock");
            return;
        }

        if (isPreOrder) {
            toast.error("Pre-order items cannot be added to cart");
            return;
        }

        if (product.hasVariants) {
            setIsVariantModalOpen(true);
            return;
        }

        const idToUse = variant ? variant._id : product._id;
        const imageToUse =
            variant?.image?.alterImage?.secure_url ??
            product.images?.[0]?.alterImage?.secure_url ??
            "/placeholder.png";
        const variantValuesToUse = variant?.variants_values ?? [];
        const maxStock = variant ? variant.variants_stock : product.total_stock;

        addCartItem({
            productId: product._id,
            _id: variant?._id,
            name: product.name,
            price: priceData.display,
            sellingPrice: priceData.sell,
            offerPrice: priceData.isOffer ? priceData.offer : undefined,
            isWithinOffer: priceData.isOffer,
            currency: "BDT",
            image: imageToUse,
            quantity: 1,
            variantId: variant?._id,
            variantValues: variantValuesToUse,
            maxStock: maxStock || 1,
            isPreOrder: isPreOrder,
        });

        toast.success("Added to cart!");
        openCart();
        window?.dataLayer?.push({
            event: "add_to_cart",
            item_id: idToUse,
            item_name: product.name,
            price: priceData.display,
        });
    };

    const handleVariantSelect = (selectedVariant: any) => {
        // This will be called when a variant is selected in the modal
        // The modal will handle adding to cart/wishlist
    };

    const img =
        product.images?.[0]?.alterImage?.secure_url ||
        product.images?.[0]?.image.secure_url ||
        "/placeholder.png";
    const blur =
        product.images?.[0]?.image.secure_url?.replace(
            "/upload/",
            "/upload/e_blur:300/"
        ) || "/placeholder.png";

    return (
        <div
            className="group relative h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link
                href={productLink}
                className="block h-full"
                aria-label={`View ${product.name} details`}
                prefetch={false}
            >
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`}
                            alt={product.name}
                            fill
                            priority={isAboveFold}
                            fetchPriority={isAboveFold ? "high" : "auto"}
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width:640px) 50vw, (max-width:1024px) 25vw, 300px"
                            placeholder="blur"
                            blurDataURL={blur}
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {isPreOrder && (
                                <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-md">
                                    Pre-Order
                                </span>
                            )}
                            {badges.condition && (
                                <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-md capitalize">
                                    {badges.condition}
                                </span>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={handleWishlist}
                                className={`p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:scale-110 transition-transform ${isWishlisted ? "text-red-500" : "text-gray-600 dark:text-gray-300"
                                    } ${isOutOfStock || isPreOrder ? "cursor-not-allowed opacity-50" : ""}`}
                                disabled={isOutOfStock || isPreOrder}
                            >
                                <FiHeart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                            </button>

                            <button
                                onClick={handleQuickView}
                                className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-md hover:scale-110 transition-transform"
                            >
                                <FiEye size={18} />
                            </button>
                        </div>

                        {/* Out of Stock Overlay */}
                        {isOutOfStock && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span className="bg-gray-800 text-white px-3 py-1 rounded-md font-medium">
                                    Out of Stock
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-2 line-clamp-1 capitalize">
                            {product.name}
                        </h3>

                        <div className="mt-auto">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    ৳{priceData.display.toFixed()}
                                </span>
                                {priceData.isOffer && (
                                    <span className="text-sm text-gray-500 line-through">
                                        ৳{priceData.sell.toFixed()}
                                    </span>
                                )}
                            </div>

                            {/* Quick Add to Cart or Quick View */}
                            <Button
                                title={isPreOrder ? "Quick View" : "Quick Add to Cart"}
                                variant="gradient"
                                onClick={isPreOrder ? handleQuickView : handleAddToCart}
                                disabled={isOutOfStock}
                            >
                                {!isOutOfStock && (isPreOrder ? (
                                    <FiEye size={20} className="font-bold md:block hidden" />
                                ) : (
                                    <FiShoppingCart size={20} className="font-bold lg:block hidden" />
                                ))}
                                {isOutOfStock ? "Out of Stock" : isPreOrder ? "View" : "Add to Cart"}
                            </Button>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Variant Select Modal */}
            {isVariantModalOpen && (
                <VariantSelectModal
                    isOpen={isVariantModalOpen}
                    variants={product.variantsId || []}
                    onSelect={handleVariantSelect}
                    onClose={() => setIsVariantModalOpen(false)}
                    product={{
                        _id: product._id,
                        name: product.name,
                        images: product.images,
                        hasVariants: product.hasVariants,
                        total_stock: product.total_stock,
                    }}
                />
            )}
        </div>
    );
}