// context/CartContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface Product {
  name: string;
  category: string;
  price: string;
  description?: string
  images?: string[];
  quantity?: number;
  image?: string;
}

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (name: string) => void;
  updateQuantity: (name: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const exist = prev.find(p => p.name === product.name);
      if (exist) {
        return prev.map(p =>
          p.name === product.name
            ? { ...p, quantity: (p.quantity || 1) + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (name: string) =>
    setCartItems(prev => prev.filter(p => p.name !== name));

  const updateQuantity = (name: string, quantity: number) => {
    if (quantity <= 0) {
      // opcional: eliminar si llega a 0
      return removeFromCart(name);
    }
    setCartItems(prev =>
      prev.map(p =>
        p.name === name
          ? { ...p, quantity }
          : p
      )
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
};
