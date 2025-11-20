import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

export interface TPreorderCartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
  variantValues?: string[];
  variantId?: string;
  isPreOrder: boolean;
  currency: string;
}

interface PreorderCartState {
  item: TPreorderCartItem | null;
  discount: number;
  isOpen: boolean;
}

const initialState: PreorderCartState = {
  item: null,
  discount: 0,
  isOpen: false,
};

const preorderCartSlice = createSlice({
  name: "preorderCart",
  initialState,
  reducers: {
    setPreorderItem: (state, action: PayloadAction<TPreorderCartItem>) => {
      state.item = action.payload;
      state.isOpen = true;
    },
    clearPreorderCart: (state) => {
      state.item = null;
      state.discount = 0;
      state.isOpen = false;
    },
    setDiscountAmount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },
    openPreorderCart: (state) => {
      state.isOpen = true;
    },
    closePreorderCart: (state) => {
      state.isOpen = false;
    },
    togglePreorderCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    updatePreorderQuantity: (state, action: PayloadAction<number>) => {
      if (state.item) {
        state.item.quantity = Math.max(
          1,
          Math.min(action.payload, state.item.maxStock)
        );
      }
    },
  },
});

/* Actions */
export const {
  setPreorderItem,
  clearPreorderCart,
  setDiscountAmount,
  openPreorderCart,
  closePreorderCart,
  togglePreorderCart,
  updatePreorderQuantity,
} = preorderCartSlice.actions;

/* Selectors */
export const selectPreorderItem = (state: RootState) => state.preorderCart.item;
export const selectPreorderItemCount = (state: RootState) =>
  state.preorderCart.item ? 1 : 0;
export const selectPreorderSubtotal = (state: RootState) =>
  state.preorderCart.item
    ? state.preorderCart.item.price * state.preorderCart.item.quantity
    : 0;
export const selectPreorderDiscount = (state: RootState) =>
  state.preorderCart.discount;
export const selectPreorderGrandTotal = (state: RootState) =>
  selectPreorderSubtotal(state) - state.preorderCart.discount;
export const selectIsPreorderCartOpen = (state: RootState) =>
  state.preorderCart.isOpen;

export default preorderCartSlice.reducer;
