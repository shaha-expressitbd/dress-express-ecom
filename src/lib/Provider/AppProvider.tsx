// src/providers/AppProviders.tsx
"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { ThemeProvider } from "./ThemeProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}
