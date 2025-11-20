"use client";

import { useRouter } from "next/navigation";
import { BiShoppingBag } from "react-icons/bi";
import { useCart } from "@/hooks/useCart";
import type { Product, Variant } from "@/types/product";
import { TCartItem } from "@/lib/features/cart/cartSlice";
import { toast } from "sonner";
import { Button } from "../atoms/button";

interface PreOrderBtnProps {
    item: Pick<Product, "_id" | "name" | "images" | "hasVariants" | "total_stock"> & Partial<Product>;
    variant?: Variant;
    quantity: number;
    className?: string;
}

export default function PreOrderBtn({ item, variant, quantity, className = "" }: PreOrderBtnProps) {
    const { addItem } = useCart();
    const router = useRouter();

    const handlePreOrder = () => {
        const price = Number(variant?.offer_price && variant.offer_price < variant.selling_price
            ? variant.offer_price
            : variant?.selling_price ?? item.total_stock);

        const cartItem: TCartItem = {
            _id: variant?._id ?? item._id,
            name: item.name,
            price,
            image: `${process.env.NEXT_PUBLIC_IMAGE_URL}${variant?.image?.alterImage.secure_url ?? item.images[0].alterImage.secure_url}`,
            quantity,
            maxStock: variant?.variants_stock ?? item.total_stock,
            variantValues: variant?.variants_values ?? [],
            variantId: variant?._id,
            isPreOrder: true,
        };

        addItem(cartItem);
        toast.success("Pre-order item added to cart");
        router.push("/checkout");
    };

    return (
        <Button
            title="Pre-order product"
            variant="gradient"
            size="sm"
            onClick={handlePreOrder}
            aria-label="Pre-order product"
        >
            <BiShoppingBag size={20} />
            <span>Pre-Order</span>
        </Button>
    );
}