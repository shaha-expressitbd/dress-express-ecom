"use client";

import { Button } from "@/components/ui/atoms/button";
import { CartItem } from "@/components/ui/molecules/cartItem";
import type { TCartItem } from "@/lib/features/cart/cartSlice";
import type { TPreorderCartItem } from "@/lib/features/preOrderCartSlice/preOrderCartSlice";
import { formatCurrency } from "@/utils/formatCurrency";
import React from "react";
import { Dispatch, SetStateAction } from "react";

interface CartSummaryProps {
    items: (TCartItem | TPreorderCartItem)[];
    deliveryCharge: number;
    total: number;
    currency: string;
    additional_discount_amount: number;
    setDiscount: Dispatch<SetStateAction<number>>;
    removeItem: (id: string, variantId?: string) => void;
    updateItemQuantity: (
        id: string,
        variantId: string | undefined,
        qty: number
    ) => void;
    isLoading: boolean;
    handleSubmit: (e: React.FormEvent) => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
    items,
    deliveryCharge,
    total,
    currency,
    additional_discount_amount,
    setDiscount,
    removeItem,
    updateItemQuantity,
    isLoading,
    handleSubmit,
}) => {
    const subtotal = items.reduce(
        (sum: number, item: TCartItem | TPreorderCartItem) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="w-full lg:w-2/5 lg:px-0 mb-50 lg:mb-0">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-2 lg:p-8 border border-gray-100 lg:sticky lg:top-20">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        🛍️ আপনার কার্ট
                    </h2>
                    <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                        {items.length} আইটেম
                    </span>
                </div>

                {/* Items */}
                <div className="space-y-4 overflow-y-auto pr-2 pb-52 lg:pb-0 lg:max-h-[50vh]">
                    {items.map((item) => (
                        <div
                            key={`${item._id}-${item.variantId ?? "default"}`}
                            className="bg-gray-50 dark:bg-gray-700 p-1 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            <CartItem
                                item={item}
                                onRemove={() => removeItem(item._id, item.variantId)}
                                onQuantityChange={(q) =>
                                    updateItemQuantity(item._id, item.variantId, q)
                                }
                                showQuantityControls
                            />
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                            আপনার কার্ট খালি
                        </div>
                    )}
                </div>

                {/* Totals (Desktop) */}
                <div className="mt-6 pt-6 border-t border-gray-200 hidden lg:block">
                    <div className="flex justify-between text-gray-600 dark:text-white">
                        <span>সাবটোটাল</span>
                        <span className="font-medium">
                            {formatCurrency(subtotal, currency)}
                        </span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-white">
                        <span>ডেলিভারি চার্জ</span>
                        <span className="font-medium">
                            {formatCurrency(deliveryCharge, currency)}
                        </span>
                    </div>
                    {additional_discount_amount > 0 && (
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                            <span>ডিসকাউন্ট</span>
                            <span className="font-medium">
                                [&minus;] {formatCurrency(additional_discount_amount, currency)}
                            </span>
                        </div>
                    )}
                    <div className="border-t pt-4">
                        <div className="flex justify-between text-xl font-bold text-gray-800 dark:text-white">
                            <span>মোট</span>
                            <span className="text-primary">
                                {formatCurrency(total, currency)}
                            </span>
                        </div>
                    </div>



                    <Button
                        type="button"
                        title="order"
                        variant="gradient"
                        className="w-full mt-6"
                        disabled={isLoading}
                        onClick={handleSubmit}
                    >
                        {isLoading ? (
                            <>
                                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                                প্রসেস হচ্ছে...
                            </>
                        ) : (
                            <>
                                <span className="mr-2">🛒</span> অর্ডারটি নিশ্চিত করুন
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;