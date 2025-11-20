// src/lib/features/cart/cartSlice.ts
import { Variant } from "./../../../types/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

/* ───── item টাইপে আগেই variantId ছিল ───── */
// src/lib/features/cart/cartSlice.ts
export interface TCartItem {
  productId: string;
  _id: string; // productId
  variantId?: string;
  variantLabel?: string;
  name: string;
  price: number; // This will store the effective price (offerPrice if active, else sellingPrice)
  sellingPrice: number; // Add sellingPrice
  offerPrice?: number; // Add offerPrice
  isWithinOffer: boolean; // Add flag to indicate if offer is active
  image: string;
  quantity: number;
  maxStock: number;
  currency?: string;
  variantValues: string[];
  isPreOrder?: boolean;
}

interface CartState {
  items: TCartItem[];
  isOpen: boolean;
  discountAmount: number;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  discountAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /* ───────── addItem ───────── */
    // src/lib/features/cart/cartSlice.ts
    addItem: (state, action: PayloadAction<TCartItem>) => {
      const incoming = action.payload;
      const existing = state.items.find(
        (item) =>
          item._id === incoming._id && item.variantId === incoming.variantId
      );

      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + incoming.quantity,
          existing.maxStock
        );
      } else {
        state.items.push({
          ...incoming,
          quantity: Math.min(incoming.quantity, incoming.maxStock),
          variantValues: incoming.variantValues,
          sellingPrice: incoming.sellingPrice, // Ensure sellingPrice is stored
          offerPrice: incoming.offerPrice, // Ensure offerPrice is stored
          isWithinOffer: incoming.isWithinOffer, // Ensure isWithinOffer is stored
        });
      }
    },

    /* ───────── removeItem ───────── */
    // 🔸 এখন object payload (productId + variantId)
    removeItem: (
      state,
      action: PayloadAction<{ id: string; variantId: string }>
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item._id === action.payload.id &&
            item.variantId === action.payload.variantId
          )
      );
    },

    /* ───────── updateQuantity ───────── */
    // 🔸 idem
    updateQuantity: (
      state,
      action: PayloadAction<{
        id: string;
        variantId: string;
        quantity: number;
      }>
    ) => {
      const { id, variantId, quantity } = action.payload;
      const item = state.items.find(
        (i) => i._id === id && i.variantId === variantId
      );
      if (!item) return;

      if (quantity <= 0) {
        state.items = state.items.filter(
          (i) => !(i._id === id && i.variantId === variantId)
        );
      } else {
        item.quantity = Math.min(quantity, item.maxStock);
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setDiscountAmount: (state, action: PayloadAction<number>) => {
      state.discountAmount = action.payload;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
  setDiscountAmount,
} = cartSlice.actions;

/* ───── Selectors অপরিবর্তিত ───── */
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartItemsCount = (state: RootState) =>
  state.cart.items.reduce((sum: number, i: TCartItem) => sum + i.quantity, 0);
export const selectCartSubtotal = (state: RootState) =>
  state.cart.items.reduce(
    (sum: number, i: TCartItem) => sum + i.price * i.quantity,
    0
  );
export const selectCartDiscount = (state: RootState) =>
  state.cart.discountAmount;
export const selectCartGrandTotal = (state: RootState) =>
  selectCartSubtotal(state) - state.cart.discountAmount;
export const selectIsCartOpen = (state: RootState) => state.cart.isOpen;

export default cartSlice.reducer;
