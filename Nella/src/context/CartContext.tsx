"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "@/db/schema";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  originalPrice?: number | null;
  imageUrl: string;
  category: string;
  quantity: number;
  selectedColor?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, selectedColor?: string) => void;
  removeFromCart: (productId: number, selectedColor?: string) => void;
  updateQuantity: (productId: number, quantity: number, selectedColor?: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalOriginalPrice: number;
  totalDiscount: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nella_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("nella_cart", JSON.stringify(items));
      } catch {
        // ignore
      }
    }
  }, [items, isLoaded]);

  const addToCart = (product: Product, selectedColor?: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.id === product.id && i.selectedColor === selectedColor
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          originalPrice: product.originalPrice,
          imageUrl: product.imageUrl,
          category: product.category,
          quantity: 1,
          selectedColor,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number, selectedColor?: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.id === productId && i.selectedColor === selectedColor))
    );
  };

  const updateQuantity = (productId: number, quantity: number, selectedColor?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === productId && i.selectedColor === selectedColor
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalOriginalPrice = items.reduce(
    (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
    0
  );
  const totalDiscount = totalOriginalPrice - totalPrice;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalOriginalPrice,
        totalDiscount,
        itemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
