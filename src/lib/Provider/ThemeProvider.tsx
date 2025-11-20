"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode, color } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    document.documentElement.className = `${mode} ${color}`;
  }, [mode, color]);

  return <>{children}</>;
};
