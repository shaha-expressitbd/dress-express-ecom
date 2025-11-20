import { useCallback, useMemo } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { useAppSelector } from "./useAppSelector";
import {
  addItem,
  clearCart,
  closeCart,
  openCart,
  removeItem,
  selectCartDiscount,
  selectCartItems,
  selectCartItemsCount,
  selectCartSubtotal,
  selectCartGrandTotal,
  selectIsCartOpen,
  setDiscountAmount,
  TCartItem,
  toggleCart,
  updateQuantity,
} from "@/lib/features/cart/cartSlice";
import { selectPreorderItem } from "@/lib/features/preOrderCartSlice/preOrderCartSlice";
import {
  trackAddToCart,
  trackRemoveFromCart,
  trackUpdateItemQuantity,
} from "@/utils/gtm";

export const useCart = () => {
  const dispatch = useAppDispatch();

  /* ───────── selectors ───────── */
  const rawItems = useAppSelector(selectCartItems);
  const rawItemCount = useAppSelector(selectCartItemsCount);
  const rawSubtotal = useAppSelector(selectCartSubtotal);
  const rawDiscount = useAppSelector(selectCartDiscount);
  const rawGrandTotal = useAppSelector(selectCartGrandTotal);
  const rawIsOpen = useAppSelector(selectIsCartOpen);
  const preorderItem = useAppSelector(selectPreorderItem); // Check preorder item

  /* ───────── memoised state ───────── */
  const { items, itemCount, subtotal, discount, grandTotal, isOpen } = useMemo(
    () => ({
      items: rawItems,
      itemCount: rawItemCount,
      subtotal: rawSubtotal,
      discount: rawDiscount,
      grandTotal: rawGrandTotal,
      isOpen: rawIsOpen,
    }),
    [rawItems, rawItemCount, rawSubtotal, rawDiscount, rawGrandTotal, rawIsOpen]
  );

  /* ───────── utils ───────── */
  const getItem = (id: string, variantId?: string) =>
    items.find(
      (it: TCartItem) =>
        it._id === id && (it.variantId ?? "") === (variantId ?? "")
    );

  /* ───────── actions ───────── */
  const addToCart = useCallback(
    (item: TCartItem) => {
      if (preorderItem) {
        alert(
          "You have a preorder item in your cart. Please complete or clear your preorder checkout before adding regular items."
        );
        return;
      }
      dispatch(addItem(item));
      trackAddToCart(item);
    },
    [dispatch, preorderItem]
  );

  const removeFromCart = useCallback(
    (id: string, variantId?: string) => {
      const item = getItem(id, variantId);
      if (item) {
        trackRemoveFromCart(item);
        dispatch(removeItem({ id, variantId }));
      }
    },
    [dispatch, getItem]
  );

  const updateItemQty = useCallback(
    (id: string, variantId: string | undefined, quantity: number) => {
      const item = getItem(id, variantId);
      if (item) {
        dispatch(updateQuantity({ id, variantId, quantity }));
        trackUpdateItemQuantity(item, quantity);
      }
    },
    [dispatch, getItem]
  );

  const clearCartItems = useCallback(() => dispatch(clearCart()), [dispatch]);
  const openCartDrawer = useCallback(() => dispatch(openCart()), [dispatch]);
  const closeCartDrawer = useCallback(() => dispatch(closeCart()), [dispatch]);
  const toggleCartDrawer = useCallback(
    () => dispatch(toggleCart()),
    [dispatch]
  );

  const applyDiscount = useCallback(
    (amount: number) => dispatch(setDiscountAmount(amount)),
    [dispatch]
  );

  /* ───────── helpers ───────── */
  const itemExists = (id: string, variantId?: string) =>
    !!getItem(id, variantId);
  const getItemQuantity = (id: string, variantId?: string) =>
    getItem(id, variantId)?.quantity ?? 0;

  return {
    /* state */
    items,
    itemCount,
    isOpen,
    subtotal,
    discount,
    grandTotal,

    /* actions */
    addItem: addToCart,
    removeItem: removeFromCart,
    updateItemQuantity: updateItemQty,
    clearCart: clearCartItems,
    openCart: openCartDrawer,
    closeCart: closeCartDrawer,
    toggleCart: toggleCartDrawer,
    applyDiscount,

    /* utils */
    itemExists,
    getItemQuantity,
  };
};
