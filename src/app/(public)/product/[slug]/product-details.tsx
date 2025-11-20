/* src/components/ProductDetail.tsx */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { BiMinus, BiPlus, BiSolidCartAdd } from "react-icons/bi";
import { FiHeart } from "react-icons/fi";
import { toast } from "sonner";
import type { Product, Variant } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { usePreorderCart } from "@/hooks/usePreorderCart";
import { useWishlist } from "@/hooks/useWishlist";
import ProductPricing from "../_component/ProductPricing";
import QuantityControls from "../_component/QuantityControls";
import ProductTabs from "../_component/ProductTabs";
import RelatedProducts from "@/components/RelatedProducts";
import MediaGallery, { MediaItem } from "../_component/MediaGallery";
import { CartSheet } from "@/components/ui/organisms/cart-sheet";
import { SidebarToggler } from "@/components/ui/molecules/sidebarToggler";
import VariantSelectModal from "../_component/VariantSelectModal";
import { trackProductView } from "@/utils/gtm";
import { WishlistSheet } from "@/components/ui/organisms/WishlistSheet";
import { TCartItem } from "@/lib/features/cart/cartSlice";
import { Button } from "@/components/ui/atoms/button";
import { useRouter } from "next/navigation";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  /* ----------------------- cart ----------------------- */
  const { addItem, openCart, items: cartItems, clearCart } = useCart();

  /* --------------------- preorder --------------------- */
  const {
    addItem: addToPreorderCart,
    item: preorderItem,
    clearCart: clearPreorderCart,
  } = usePreorderCart();

  /* --------------------- wishlist --------------------- */
  const {
    items: wishlistItems,
    addItem: addWishlistItem,
    removeItem: removeWishlistItem,
  } = useWishlist();

  /* ---------------------- variants -------------------- */
  const hasVariants = product.hasVariants;
  const variants = product.variantsId;
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  /* --------------------- analytics -------------------- */
  useEffect(() => {
    trackProductView(product, selectedVariant);
  }, [product, selectedVariant]);

  /* --------------------- UI state --------------------- */
  const [variantPicked, setVariantPicked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [variantError, setVariantError] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "Short-Description" | "Long-Description" | "specs" | "shipping" | string
  >("Short-Description");
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const variantSelectRef = useRef<HTMLSelectElement>(null);
  const [wishlistVariantModalOpen, setWishlistVariantModalOpen] = useState(false);

  const router = useRouter();

  /* --------------------- price calc ------------------- */
  const fallbackVariant =
    variants.find((v) => v.variants_stock > 0) || variants[0];
  const v = selectedVariant || fallbackVariant;
  const sellingPrice = Number(v?.selling_price ?? 0);
  const offerPrice = Number(v?.offer_price ?? sellingPrice);
  const now = Date.now();
  const offerStart = v?.discount_start_date
    ? new Date(v.discount_start_date).getTime()
    : 0;
  const offerEnd = v?.discount_end_date
    ? new Date(v.discount_end_date).getTime()
    : 0;
  const isWithinOffer =
    offerPrice < sellingPrice && now >= offerStart && now <= offerEnd;
  const discountPercent = isWithinOffer
    ? Math.round(((sellingPrice - offerPrice) / sellingPrice) * 100)
    : 0;
  const stock = selectedVariant
    ? selectedVariant.variants_stock
    : product.total_stock;

  const isPreOrder = hasVariants
    ? v?.isPreOrder ?? false
    : variants[0]?.isPreOrder ?? product.isPreOrder ?? false;

  /* ---------------- wishlist flag --------------------- */
  const currentVariantId = hasVariants
    ? selectedVariant?._id ?? variants[0]._id
    : product._id;
  const isWishlisted = wishlistItems.some((i) => i._id === currentVariantId);

  /* ------------------- media gallery ------------------ */
  const allMedia = useMemo<MediaItem[]>(() => {
    const media: MediaItem[] = [];

    if (product.video?.[0]?.video) {
      media.push({
        type: "video",
        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}${product.video[0].alterVideo?.secure_url}`,
        public_id: product.video[0].video.public_id,
        _id: product.video[0]._id,
      });
    }

    const images = product.images.map((img) => ({
      type: "image" as const,
      url: `${process.env.NEXT_PUBLIC_IMAGE_URL}${img.alterImage.optimizeUrl ?? img.alterImage.secure_url
        }`,
      public_id: img.image.public_id,
      _id: img._id,
    }));

    if (selectedVariant?.image) {
      const vUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}${selectedVariant.image.alterImage.optimizeUrl ??
        selectedVariant.image.alterImage.secure_url
        }`;
      const idx = images.findIndex((i) => i.url === vUrl);
      const vItem: MediaItem =
        idx > -1
          ? (images.splice(idx, 1)[0] as MediaItem)
          : {
            type: "image",
            url: vUrl,
            public_id: selectedVariant.image.alterImage.public_id,
            _id: `${selectedVariant._id}-img`,
          };
      media.splice(media.length ? 1 : 0, 0, vItem);
    }

    media.push(...images);
    return media;
  }, [product.images, product.video, selectedVariant]);

  const selectedMediaUrl =
    variantPicked && selectedVariant?.image
      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${selectedVariant.image.alterImage.optimizeUrl ??
      selectedVariant.image.alterImage.secure_url
      }`
      : undefined;

  /* ------------------- handlers ----------------------- */
  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = variants.find((x) => x._id === e.target.value) ?? null;
    setSelectedVariant(found);
    setQuantity(1);
    setVariantPicked(true);
    setVariantError(false);
  };

  const handleQtyChange = (val: number) =>
    setQuantity(Math.min(Math.max(1, val), stock));

  const addCartItem = (variant: Variant | null) => {
    if (preorderItem) {
      toast.error(
        <div>
          You have a preorder item in your cart. Please complete or clear your preorder checkout before adding regular items.
          <div className="flex gap-2 mt-2">
            <Button
              title="Clear Preorder"
              variant="outline"
              size="sm"
              onClick={() => {
                clearPreorderCart();
                toast.success("Preorder cart cleared. You can now add regular items.");
              }}
            >
              Clear Preorder
            </Button>
            <Button
              title="Go to Checkout"
              variant="outline"
              size="sm"
              onClick={() => router.push("/checkout")}
            >
              Go to Checkout
            </Button>
          </div>
        </div>,
        { duration: 5000, position: "top-right" }
      );
      return;
    }

    const price = isWithinOffer ? offerPrice : sellingPrice;
    const cartItem: TCartItem = {
      _id: variant?._id ?? product._id, // Use variantId as _id
      productId: product._id, // Store productId separately
      name: product.name,
      price, // Effective price
      sellingPrice, // Always store the selling price
      offerPrice: isWithinOffer ? offerPrice : undefined, // Store offer price if active
      isWithinOffer, // Indicate if offer is active
      image: `${process.env.NEXT_PUBLIC_IMAGE_URL}${variant?.image?.alterImage.secure_url ??
        product.images[0].alterImage.secure_url
        }`,
      quantity,
      maxStock: variant?.variants_stock ?? product.total_stock,
      variantValues: variant?.variants_values ?? [],
      variantId: variant?._id,
      currency: "BDT",
    };
    addItem(cartItem);
    openCart();
    toast.success("Added to cart");

    setSelectedVariant(null);
    setVariantPicked(false);
    variantSelectRef.current?.blur();
    variantSelectRef.current && (variantSelectRef.current.value = "");
  };

  const handleAddToCart = () => {
    if (hasVariants) {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        setIsVariantModalOpen(true);
        return;
      }
      if (!selectedVariant && variants.length > 1) {
        setVariantError(true);
        variantSelectRef.current?.focus();
        return;
      }
    }

    const variantToUse =
      hasVariants && variants.length > 1 ? selectedVariant : variants[0];

    if (variantToUse && variantToUse.variants_stock <= 0) {
      toast.error("এই ভ্যারিয়েন্ট স্টকে নেই, অন্যটি বাছাই করুন");
      return;
    }

    if (isPreOrder) {
      handlePreOrder(variantToUse);
      return;
    }

    addCartItem(variantToUse);
  };

  const handlePreOrder = (variantToUse?: Variant | null) => {
    if (cartItems.length > 0) {
      toast.error(
        <div>
          You have items in your regular cart. Please complete or clear your regular cart checkout before adding a preorder item.
          <div className="flex gap-2 mt-2">
            <Button
              title="Clear Cart"
              variant="outline"
              size="sm"
              onClick={() => {
                clearCart();
                toast.success("Regular cart cleared. You can now add preorder items.");
              }}
            >
              Clear Cart
            </Button>
          </div>
        </div>,
        { duration: 5000, position: "top-right" }
      );
      return;
    }

    if (hasVariants) {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        setIsVariantModalOpen(true);
        return;
      }
      if (!variantToUse && !selectedVariant && variants.length > 1) {
        setVariantError(true);
        variantSelectRef.current?.focus();
        toast.error("দয়া করে একটি পছন্দ নির্বাচন করুন");
        return;
      }
    }

    const variant = variantToUse || (hasVariants ? (selectedVariant || variants[0]) : variants[0]);

    if (variant && !variant.isPreOrder && variant.variants_stock <= 0) {
      toast.error("এই ভ্যারিয়েন্ট স্টকে নেই, অন্যটি বাছাই করুন");
      return;
    }

    const price = isWithinOffer ? offerPrice : sellingPrice;
    const preorderItem = {
      _id: variant._id, // Use variantId as _id
      productId: product._id,
      name: product.name,
      price,
      image: `${process.env.NEXT_PUBLIC_IMAGE_URL}${variant?.image?.alterImage.secure_url ?? product.images[0].alterImage.secure_url
        }`,
      quantity,
      maxStock: variant?.variants_stock ?? product.total_stock,
      variantValues: variant?.variants_values ?? [],
      variantId: variant?._id,
      isPreOrder: true,
      currency: "BDT",
    };
    addToPreorderCart(preorderItem);
    toast.success("Proceeding to checkout with pre-order item");
    setSelectedVariant(null);
    setVariantPicked(false);
    variantSelectRef.current?.blur();
    variantSelectRef.current && (variantSelectRef.current.value = "");
    router.push("/checkout");
  };

  /* ---------------- wishlist toggle ------------------- */
  const addWishlistVariant = useCallback(
    (v: Variant | null) => {
      if (isPreOrder) {
        toast.error("This item cannot be added to wishlist");
        return;
      }
      const effectivePrice = isWithinOffer ? offerPrice : sellingPrice;
      const variantId = v ? v._id : product._id;
      addWishlistItem({
        _id: variantId, // Use variantId as _id
        productId: product._id, // Store productId separately
        name: product.name,
        price: effectivePrice,
        currency: "BDT",
        image: `${process.env.NEXT_PUBLIC_IMAGE_URL}${v?.image?.alterImage.secure_url ??
          product.images[0].alterImage.secure_url
          }`,
        variantValues: v?.variants_values ?? [],
      });
      toast.success("Added to wishlist!");

      setSelectedVariant(null);
      setVariantPicked(false);
      variantSelectRef.current?.blur();
      variantSelectRef.current && (variantSelectRef.current.value = "");
    },
    [product, addWishlistItem, isPreOrder, isWithinOffer, offerPrice, sellingPrice, quantity]
  );

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeWishlistItem(currentVariantId);
      toast.success("Removed from wishlist");
      return;
    }

    if (isPreOrder) {
      toast.error("This item cannot be added to wishlist");
      return;
    }

    if (hasVariants) {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        setWishlistVariantModalOpen(true);
        return;
      }
      if (!selectedVariant && variants.length > 1) {
        setVariantError(true);
        variantSelectRef.current?.focus();
        toast.error("Please select a variant first");
        return;
      }
    }

    const variantToUse =
      hasVariants && variants.length > 1 ? selectedVariant : variants[0];

    if (variantToUse && variantToUse.variants_stock <= 0) {
      toast.error("এই ভ্যারিয়েন্ট স্টকে নেই, অন্যটি বাছাই করুন");
      return;
    }
    addWishlistVariant(variantToUse);
  };

  /* -------- product change → reset -------- */
  useEffect(() => {
    setSelectedVariant(null);
    setVariantPicked(false);
    setVariantError(false);
    variantSelectRef.current && (variantSelectRef.current.value = "");
  }, [product._id]);

  /* ------------------- render ------------------------- */
  return (
    <div>
      {/* Variant picker (Cart) */}
      <VariantSelectModal
        isOpen={isVariantModalOpen}
        variants={variants}
        selectedId={selectedVariant?._id}
        onSelect={(v) => {
          setSelectedVariant(v);
          setQuantity(1);
          setIsVariantModalOpen(false);
        }}
        onClose={() => setIsVariantModalOpen(false)}
        product={product}
      />

      <VariantSelectModal
        isOpen={wishlistVariantModalOpen}
        variants={variants}
        selectedId={selectedVariant?._id}
        onSelect={(v) => {
          setSelectedVariant(v);
          setQuantity(1);
          setWishlistVariantModalOpen(false);
          addWishlistVariant(v); // Add to wishlist after selecting variant
        }}
        onClose={() => setWishlistVariantModalOpen(false)}
        product={product}
        isWishlistModal={true}
      />

      {/* main layout */}
      <div className="md:container md:mx-auto md:max-w-7xl md:mt-4 md:pb-0 pb-16">
        <article className="relative grid grid-cols-1 lg:grid-cols-2 md:gap-10 items-start">
          {/* media */}
          <div className="md:container md:mx-auto lg:sticky lg:top-40 px-0 md:px-4">
            <MediaGallery
              media={allMedia}
              productName={product.name}
              stock={stock}
              selectedMediaUrl={selectedMediaUrl}
              isPreOrder={isPreOrder}
            />
          </div>

          {/* details */}
          <div className="w-full px-2 md:px-4">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mt-8 break-all">
              {product.name}
            </h1>

            <ProductPricing
              sellingPrice={sellingPrice}
              offerPrice={offerPrice}
              stock={stock}
              discountPercent={discountPercent}
              discountStartDate={v?.discount_start_date ?? undefined}
              discountEndDate={v?.discount_end_date ?? undefined}
            />

            {/* desktop variant select */}
            {hasVariants && variants.length > 1 && (
              <div className="my-4 hidden lg:block">
                <label className="block mb-2 text-sm font-medium text-black dark:text-white">
                  পছন্দ নির্বাচন করুন
                </label>
                <select
                  ref={variantSelectRef}
                  value={selectedVariant?._id ?? ""}
                  onChange={handleVariantChange}
                  className={`w-full border ${variantError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 dark:focus:ring-gray-500 bg-white dark:bg-gray-800 text-black dark:text-white`}
                >
                  <option value="" disabled>
                    -- পছন্দ নির্বাচন করুন --
                  </option>
                  {variants.map((v) => {
                    const now = Date.now();
                    const offerStart = v.discount_start_date
                      ? new Date(v.discount_start_date).getTime()
                      : 0;
                    const offerEnd = v.discount_end_date
                      ? new Date(v.discount_end_date).getTime()
                      : 0;
                    const isDiscountActive =
                      Number(v.offer_price) < Number(v.selling_price) &&
                      now >= offerStart &&
                      now <= offerEnd;
                    const displayPrice = isDiscountActive
                      ? Number(v.offer_price).toFixed(2)
                      : Number(v.selling_price).toFixed(2);
                    const discountPercent = isDiscountActive
                      ? Math.round(
                        ((Number(v.selling_price) - Number(v.offer_price)) /
                          Number(v.selling_price)) * 100
                      )
                      : 0;

                    return (
                      <option
                        key={v._id}
                        value={v._id}
                        disabled={v.variants_stock <= 0}
                      >
                        {v.variants_values?.join(" / ") ?? ""} - ৳{displayPrice}
                        {isDiscountActive && ` (${discountPercent}% OFF)`}
                        {v.variants_stock <= 0 && " (স্টক নেই)"}
                      </option>
                    );
                  })}
                </select>
                {variantError && (
                  <p className="mt-1 text-sm text-red-600">
                    দয়া করে একটি পছন্দ নির্বাচন করুন
                  </p>
                )}
              </div>
            )}

            <div className="md:pb-2">
              <QuantityControls
                quantity={quantity}
                stock={stock}
                onQuantityChange={handleQtyChange}
                product={product}
                variant={selectedVariant}
                isWithinOffer={isWithinOffer}
                offerPrice={offerPrice}
                sellingPrice={sellingPrice}
                onAddToCart={() => {
                  handleAddToCart();
                  return true;
                }}
                onVariantMissing={() => {
                  setVariantError(true);
                  variantSelectRef.current?.focus();
                }}
                isPreOrder={isPreOrder}
                onPreOrder={() => handlePreOrder()}
              />
            </div>

            <ProductTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              shortDescription={product.short_description}
              longDescription={product.long_description}
              stock={stock}
              variantsCount={variants.length}
            />
          </div>
        </article>

        {/* overlay buttons (mobile) */}
        <div className="fixed bottom-16 left-2 z-50 lg:hidden">
          <div className="max-w-[50px] bg-primary p-2 rounded-full">
            <SidebarToggler />
          </div>
        </div>

        <div className="fixed bottom-16 right-4 z-50 lg:hidden flex flex-col gap-2 items-end">
          {wishlistItems.length > 0 && <WishlistSheet />}
          {cartItems.length > 0 && <CartSheet />}
        </div>

        {/* sticky bar (mobile) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t shadow-xl lg:hidden z-40">
          <div className="flex items-center justify-between p-1">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 rounded-md border overflow-hidden">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${product.images?.[0]?.alterImage.secure_url}`}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-base text-primary">
                  ৳{(isWithinOffer ? offerPrice : sellingPrice).toFixed(2)}
                </div>
                {selectedVariant && (
                  <div className="text-xs text-gray-500 truncate max-w-[120px]">
                    {selectedVariant.variants_values?.join(" / ")}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Show quantity controls only if product has no variants */}
              {!product.hasVariants && (
                <div className="flex items-center border rounded-md bg-white">
                  <button
                    onClick={() => handleQtyChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="flex items-center justify-center w-8 h-8 disabled:opacity-30"
                  >
                    <BiMinus className="w-3 h-3" />
                  </button>
                  <input
                    type="number"
                    readOnly
                    value={quantity}
                    className="w-10 text-center text-sm font-medium"
                  />
                  <button
                    onClick={() => handleQtyChange(quantity + 1)}
                    disabled={quantity >= stock}
                    className="flex items-center justify-center w-8 h-8 disabled:opacity-30"
                  >
                    <BiPlus className="w-3 h-3" />
                  </button>
                </div>
              )}

              {isPreOrder ? (
                <Button
                  title="Pre-order product"
                  size="md"
                  onClick={() => handlePreOrder()}
                  variant="gradient"
                  disabled={stock <= 0}
                >
                  Pre-Order
                </Button>
              ) : (
                <>
                  <button
                    onClick={handleWishlistToggle}
                    aria-label={
                      isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                    }
                    className={`p-1 rounded-md border ${isWishlisted
                      ? "text-red-500 border-red-400 bg-red-50"
                      : "text-gray-500 border-gray-300 bg-white"
                      } ${isPreOrder ? "cursor-not-allowed opacity-50" : ""}`}
                    disabled={isPreOrder}
                  >
                    <FiHeart
                      size={20}
                      fill={isWishlisted ? "#ef4444" : "none"}
                    />
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="bg-primary text-white px-4 p-1 rounded-md text-nowrap"
                  >
                    Order
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* related products */}
        {product.sub_category[0]?._id && (
          <div className="py-4 md:py-8 md:pb-20">
            <RelatedProducts
              currentProductId={product._id}
              subCategoryId={product.sub_category[0]._id}
            />
          </div>
        )}
      </div>

      {/* footer (mobile) */}
      <footer className="block">
        <div className="w-full bg-black text-center py-2 flex items-center justify-center">
          <p className="flex flex-col sm:flex-row gap-2 text-sm sm:text-base">
            <span className="text-gray-400">Powered by:</span>
            <a
              href="https://calquick.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              <Image
                height={100}
                width={100}
                src="https://calquick.app/images/logo/logo-white.png"
                className="h-6 w-auto object-contain"
                alt="calquick-logo"
                priority
              />
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}