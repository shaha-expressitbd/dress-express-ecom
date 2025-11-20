// src/hooks/useAppDispatch.ts
"use client";

import type { AppDispatch } from "@/lib/store";
import { useDispatch } from "react-redux";

/**
 * A typed dispatch hook for your Redux store.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
