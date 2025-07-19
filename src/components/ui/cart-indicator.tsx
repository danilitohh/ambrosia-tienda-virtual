"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/providers/cart-provider";

export function CartIndicator() {
  const { itemCount, isLoading } = useCart();

  return (
    <div className="relative">
      <Link 
        href="/cart" 
        className="relative text-[#C6FF00] hover:text-[#b2e600] transition-colors"
        title="Ver carrito"
      >
        <ShoppingCart className="h-6 w-6" />
        {!isLoading && itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </Link>
    </div>
  );
} 