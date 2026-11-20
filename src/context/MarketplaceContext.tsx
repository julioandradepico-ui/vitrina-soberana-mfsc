"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { PRODUCTS, ProductItem } from "@/data/mfscData";

export interface CartEntry {
  product: ProductItem;
  quantity: string;
}

interface MarketplaceContextValue {
  allProducts: ProductItem[];
  customProducts: ProductItem[];
  addCustomProduct: (item: ProductItem) => void;
  cart: CartEntry[];
  addToCart: (product: ProductItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, quantity: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

const LS_CUSTOM_KEY = "mfsc_vitrina_custom_products_v1";
const LS_CART_KEY = "mfsc_vitrina_rfq_cart_v1";

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [customProducts, setCustomProducts] = useState<ProductItem[]>([]);
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      const savedCustom = localStorage.getItem(LS_CUSTOM_KEY);
      if (savedCustom) setCustomProducts(JSON.parse(savedCustom));
      const savedCart = localStorage.getItem(LS_CART_KEY);
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch {
      // Ignore storage errors in private browsing
    }
  }, []);

  const addCustomProduct = (item: ProductItem) => {
    setCustomProducts((prev) => {
      const next = [item, ...prev];
      try {
        localStorage.setItem(LS_CUSTOM_KEY, JSON.stringify(next));
      } catch {
        // ignore quota errors
      }
      return next;
    });
  };

  const addToCart = (product: ProductItem) => {
    setCart((prev) => {
      if (prev.some((e) => e.product.id === product.id)) return prev;
      const next = [...prev, { product, quantity: "Por definir" }];
      try {
        localStorage.setItem(LS_CART_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const next = prev.filter((e) => e.product.id !== productId);
      try {
        localStorage.setItem(LS_CART_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const updateCartQty = (productId: string, quantity: string) => {
    setCart((prev) => {
      const next = prev.map((e) =>
        e.product.id === productId ? { ...e, quantity } : e
      );
      try {
        localStorage.setItem(LS_CART_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(LS_CART_KEY);
    } catch {}
  };

  const allProducts = [...customProducts, ...PRODUCTS];

  return (
    <MarketplaceContext.Provider
      value={{
        allProducts,
        customProducts,
        addCustomProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        isCartOpen,
        setCartOpen,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace must be used inside MarketplaceProvider");
  return ctx;
}
