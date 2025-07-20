"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  inStock?: boolean;
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;
  updateQuantity: (id: string, quantity: number) => void;
  isLoading: boolean;
  itemCount: number;
  total: number;
  appliedPromoCode: any;
  discount: number;
  validateStock: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState<any>(null);

  // Calcular totales
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedPromoCode ? appliedPromoCode.discountAmount : 0;
  const total = subtotal - discount;

  // Función para validar stock
  const validateStock = useCallback(async (): Promise<boolean> => {
    if (items.length === 0) return true;

    try {
      const res = await fetch("/api/cart/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const validation = await res.json();
      return validation.valid;
    } catch (error) {
      console.error("Error validando stock:", error);
      return false;
    }
  }, [items]);

  // Cargar carrito de localStorage siempre, sin importar autenticación
  useEffect(() => {
    setIsLoading(true);
    try {
      const local = localStorage.getItem("cart");
      setItems(local ? JSON.parse(local) : []);
    } catch (error) {
      console.error("Error cargando carrito:", error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar carrito en localStorage siempre que cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Eliminar migración y sincronización con backend

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    if (!session?.user) {
      localStorage.removeItem("cart");
    }
  }, [session]);

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addItem, 
        removeItem, 
        clearCart, 
        setCart: setItems,
        updateQuantity,
        isLoading,
        itemCount,
        total,
        appliedPromoCode,
        discount,
        validateStock
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
} 