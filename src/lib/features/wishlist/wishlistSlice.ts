/* -------------------------------------------------------------------------- */
/*  Wishlist Slice                                                            */
/* -------------------------------------------------------------------------- */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ————————————————————— Types —————————————————————— */
export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  currency?: string;
  image: string; // relative or absolute URL
  variantValues: string[]; // e.g. ["L", "Blue"]
}

interface WishlistState {
  items: WishlistItem[];
  isOpen: boolean;
}

/* —————————————————— Initial State ————————————————— */
const initialState: WishlistState = {
  items: [],
  isOpen: false,
};

/* ——————————————————— Slice ———————————————————— */
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    openWishlist(state) {
      state.isOpen = true;
    },
    closeWishlist(state) {
      state.isOpen = false;
    },
    addItem(state, action: PayloadAction<WishlistItem>) {
      if (!state.items.find((i) => i._id === action.payload._id)) {
        state.items.push(action.payload);
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const {
  openWishlist,
  closeWishlist,
  addItem,
  removeItem,
  clearWishlist,
} = wishlistSlice.actions;

export const wishlistReducer = wishlistSlice.reducer;

/* Selectors */
export const selectWishlistItems = (s: { wishlist: WishlistState }) =>
  s.wishlist.items;

export const selectWishlistCount = (s: { wishlist: WishlistState }) =>
  s.wishlist.items.length;

export const selectWishlistOpen = (s: { wishlist: WishlistState }) =>
  s.wishlist.isOpen;
