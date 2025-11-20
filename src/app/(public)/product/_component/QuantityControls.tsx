"use client";

import { BiMinus, BiPlus, BiShare } from "react-icons/bi";
import { toast } from "sonner";
import AddToCartBtn from "@/components/ui/molecules/addToCartBtn";
import AddToWishlistBtn from "@/components/ui/molecules/AddToWishlistBtn";
import type { Product, Variant } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { usePreorderCart } from "@/hooks/usePreorderCart";
import { Button } from "@/components/ui/atoms/button";
import { useRouter } from "next/navigation";

interface QuantityControlsProps {
  quantity: number;
  stock: number;
  onQuantityChange: (val: number) => void;
  product: Pick<
    Product,
    "_id" | "name" | "images" | "hasVariants" | "total_stock"
  > &
  Partial<Product>;
  variant: Variant | null;
  isWithinOffer: boolean;
  offerPrice: number;
  sellingPrice: number;
  onAddToCart: () => boolean;
  onVariantMissing: () => void;
  isPreOrder: boolean;
  onPreOrder: () => void;
}

/** Desktop‑only (md up) row. */
export default function QuantityControls({
  quantity,
  stock,
  onQuantityChange,
  product,
  variant,
  isWithinOffer,
  offerPrice,
  sellingPrice,
  onAddToCart,
  onVariantMissing,
  isPreOrder,
  onPreOrder,
}: QuantityControlsProps) {
  const { items: cartItems, clearCart } = useCart();
  const { addItem: addToPreorderCart } = usePreorderCart();
  const router = useRouter();

  /* ------ share helper ------ */
  const shareProduct = async () => {
    const slug = product.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const url = `${window.location.origin}/products/${slug}?id=${product._id}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch {
        toast.error("Failed to share product");
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied!");
      } catch {
        toast.error("Failed to copy link");
      }
    }
  };

  const handlePreOrderClick = () => {
    if (product.hasVariants && !variant) {
      onVariantMissing();
      return;
    }
    if (cartItems.length > 0) {
      toast.error(
        <div>
          You have items in your regular cart. Please complete or clear your regular cart checkout before adding a preorder item.
          <div className="flex gap-2 mt-2">
            <Button
              title="clear cart"
              variant="outline"
              size="sm"
              onClick={() => {
                clearCart();
                toast.success("Regular cart cleared. You can now add preorder items.");
              }}
            >
              Clear Cart
            </Button>
            <Button
              title="gotocart"
              variant="outline"
              size="sm"
              onClick={() => {
                const { openCart } = useCart();
                openCart();
                toast.dismiss();
              }}
            >
              Go to Cart
            </Button>
          </div>
        </div>,
        { duration: 5000, position: "top-right" }
      );
      return;
    }
    onPreOrder();
  };

  return (
    <div className="hidden lg:flex items-center justify-between gap-4">
      {/* QTY */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-600 dark:text-white">
          QTY:
        </label>
        <div className="flex items-center border border-gray-200 rounded">
          <button
            type="button"
            className="w-6 h-6 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-l-sm disabled:opacity-30"
            onClick={() => onQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <BiMinus className="w-2.5 h-2.5" />
          </button>
          <input
            type="number"
            min={1}
            max={stock}
            value={quantity}
            onChange={(e) =>
              onQuantityChange(
                Math.max(1, Math.min(stock, Number(e.target.value)))
              )
            }
            className="w-8 h-6 text-center text-xs border-x border-gray-200 focus:outline-none"
          />
          <button
            type="button"
            className="w-6 h-6 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-r-sm disabled:opacity-30"
            onClick={() => onQuantityChange(quantity + 1)}
            disabled={quantity >= stock}
            aria-label="Increase quantity"
          >
            <BiPlus className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {isPreOrder ? (
        <Button
          title="Pre-order product"
          variant="gradient"
          size="sm"
          onClick={handlePreOrderClick}
          disabled={stock <= 0}
          aria-label="Pre-order product"
        >
          Pre-Order
        </Button>
      ) : (
        <>
          {/* Add to cart */}
          <AddToCartBtn
            item={product as Product}
            variant={
              variant
                ? {
                  ...variant,
                  selling_price: (
                    isWithinOffer ? offerPrice : sellingPrice
                  ).toString(),
                }
                : undefined
            }
            quantity={quantity}
            className="flex-1 min-w-[120px]"
            onAddToCart={onAddToCart}
          />

          {/* Wishlist */}
          <AddToWishlistBtn
            item={product as Product}
            variant={variant}
            requireVariant={product.hasVariants}
            size="icon"
            onVariantMissing={onVariantMissing}
          />
        </>
      )}

      {/* Share */}
      <button
        onClick={shareProduct}
        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded transition-colors"
        aria-label="Share"
      >
        <BiShare className="w-3 h-3" />
        <span>Share</span>
      </button>
    </div>
  );
}