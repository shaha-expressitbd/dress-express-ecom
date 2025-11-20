import React from "react";
import { IconType } from "react-icons";
import {
  FaHome,
  FaShoppingBag,
  FaBullhorn,
  FaBolt,
  FaStar,
  FaFire,
  FaStore,
} from "react-icons/fa";

export interface NavSubItem {
  title: string;
  path: string;
  icon?: IconType;
  element?: React.ElementType;
}

export interface NavGroup {
  title: string;
  path?: string;
  icon?: IconType;
  element?: React.ElementType;
  submenu?: NavSubItem[];
}

export const menuItems: NavGroup[] = [
  { title: "Home", path: "/", icon: FaHome },
  { title: "Shop", path: "/products", icon: FaShoppingBag },
  { title: "Pre-Order", path: "/preorder", icon: FaBullhorn },
];
