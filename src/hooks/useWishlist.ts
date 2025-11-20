"use client";

import {
  WishlistItem,
  selectWishlistItems,
  selectWishlistCount,
  selectWishlistOpen,
  openWishlist,
  closeWishlist,
  addItem,
  removeItem,
  clearWishlist,
} from "@/lib/features/wishlist/wishlistSlice";
import {
  addItem as addCartItem,
  updateQuantity, // Changed from updateItemQuantity
  selectCartItems,
} from "@/lib/features/cart/cartSlice";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";

// Define TCartItem type based on your cartSlice (adjust as per your actual type)
interface TCartItem {
  _id: string;
  variantId: string;
  price: number;
  quantity: number;
  maxStock: number;
  name: string;
  currency: string;
  image: string;
  variantValues: string[];
  sellingPrice: number;
  isWithinOffer: boolean;
}

/**
 * Hook that exposes wishlist API + handles “moveToCart” locally
 */
export const useWishlist = () => {
  const dispatch = useAppDispatch();

  /* state */
  const items = useAppSelector(selectWishlistItems);
  const itemCount = useAppSelector(selectWishlistCount);
  const isOpen = useAppSelector(selectWishlistOpen);
  const cartItems = useAppSelector(selectCartItems); // Access cart items

  /* actions */
  const open = () => dispatch(openWishlist());
  const close = () => dispatch(closeWishlist());

  const add = (item: WishlistItem) => dispatch(addItem(item));
  const remove = (id: string) => dispatch(removeItem(id));
  const clear = () => dispatch(clearWishlist());

  /** Move an item to cart without thunk */
  const moveToCart = (id: string) => {
    const item = items.find((i) => i._id === id);
    if (!item) return;

    // Check if an item with the same variantId and price exists in the cart
    const existingCartItem = cartItems.find(
      (
        cartItem: TCartItem // Explicitly type cartItem
      ) => cartItem.variantId === item._id && cartItem.price === item.price
    );

    if (existingCartItem) {
      // If item exists, update quantity
      dispatch(
        updateQuantity({
          id: existingCartItem._id,
          variantId: existingCartItem.variantId,
          quantity: existingCartItem.quantity + 1,
        })
      );
    } else {
      // If no matching item, add new item to cart
      dispatch(
        addCartItem({
          ...item,
          quantity: 1,
          maxStock: 9999,
          variantId: item._id,
          sellingPrice: item.price,
          isWithinOffer: false,
        } as TCartItem)
      );
    }

    // Remove item from wishlist
    dispatch(removeItem(id));
  };

  return {
    /* state */
    items,
    itemCount,
    isOpen,
    /* actions */
    openWishlist: open,
    closeWishlist: close,
    addItem: add,
    removeItem: remove,
    clearWishlist: clear,
    moveToCart,
  };
};
