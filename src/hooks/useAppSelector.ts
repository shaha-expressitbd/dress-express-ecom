// src/hooks/useAppSelector.ts
"use client";

import type { RootState } from "@/lib/store";
import { TypedUseSelectorHook, useSelector } from "react-redux";

/**
 * A typed selector hook for your Redux store.
 * Simply wraps React-Redux’s useSelector.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
