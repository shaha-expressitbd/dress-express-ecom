// src/store/businessSlice.ts
import { Business } from "@/types/business";
import { createSlice } from "@reduxjs/toolkit";

interface BusinessState {
  data: Business | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BusinessState = {
  data: null,
  isLoading: false,
  error: null,
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setBusiness: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.isLoading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setBusiness, setLoading, setError } = businessSlice.actions;
export default businessSlice.reducer;
