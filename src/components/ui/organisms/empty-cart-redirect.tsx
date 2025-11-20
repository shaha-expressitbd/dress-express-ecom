"use client";

import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function EmptyCartRedirect() {
  const { items } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0) {
      toast.warning("Your cart is empty!", {
        description: "Add some items to your cart first",
      });
      // router.push("/products");
    }
  }, [items.length, router]);

  return null;
}
