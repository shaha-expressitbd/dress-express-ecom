import "@/app/globals.css";
import React from "react";
export type PrivateLayoutProps = {
  children: React.ReactNode;
};

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
