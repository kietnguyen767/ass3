"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// -------------------- Types --------------------
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  stock: number;
}

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

interface GuestCartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  // Guest cart methods
  addToGuestCart: (product: Product, quantity?: number) => void;
  updateGuestQuantity: (productId: string, quantity: number) => void;
  removeFromGuestCart: (productId: string) => void;
  syncGuestCartToDb: () => Promise<void>;
}

// -------------------- Context --------------------
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  isAuthenticated,
}: {
  children: ReactNode;
  isAuthenticated: boolean;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [guestItems, setGuestItems] = useState<GuestCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // -------------------- Guest Cart --------------------
  // Load from localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      const savedCart = localStorage.getItem("guestCart");
      if (savedCart) {
        try {
          setGuestItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Failed to load guest cart:", error);
        }
      }
    }
  }, [isAuthenticated]);

  // Save to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      if (guestItems.length > 0) {
        localStorage.setItem("guestCart", JSON.stringify(guestItems));
      } else {
        localStorage.removeItem("guestCart");
      }
    }
  }, [guestItems, isAuthenticated]);

  // -------------------- Fetch from DB --------------------
  const refreshCart = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Không thể tải giỏ hàng");
      const data = await res.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Failed to refresh cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) refreshCart();
  }, [isAuthenticated]);

  // -------------------- Sync Guest Cart when Login --------------------
  const syncGuestCartToDb = async () => {
    if (!isAuthenticated || guestItems.length === 0) return;

    try {
      for (const item of guestItems) {
        await fetch("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.product.id,
            quantity: item.quantity,
          }),
        });
      }
      localStorage.removeItem("guestCart");
      setGuestItems([]);
      await refreshCart();
    } catch (error) {
      console.error("Failed to sync guest cart:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) syncGuestCartToDb();
  }, [isAuthenticated]);

  // -------------------- Authenticated User Methods --------------------
  const addToCart = async (productId: string, quantity: number = 1) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể thêm vào giỏ hàng");
      setItems(data.cart.items);
    } catch (error: any) {
      console.error("Add to cart error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể cập nhật giỏ hàng");
      setItems(data.cart.items);
    } catch (error: any) {
      console.error("Update quantity error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể xóa sản phẩm");
      setItems(data.cart.items);
    } catch (error: any) {
      console.error("Remove from cart error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart/remove", { method: "POST" });
      if (!res.ok) throw new Error("Không thể xóa toàn bộ giỏ hàng");
      setItems([]);
    } catch (error) {
      console.error("Clear cart error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------- Guest User Methods --------------------
  const addToGuestCart = (product: Product, quantity: number = 1) => {
    setGuestItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const newItems = [...prev];
        newItems[existingIndex].quantity += quantity;
        return newItems;
      } else {
        return [...prev, { product, quantity }];
      }
    });
  };

  const updateGuestQuantity = (productId: string, quantity: number) => {
    setGuestItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromGuestCart = (productId: string) => {
    setGuestItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // -------------------- Derived Values --------------------
  const currentItems = isAuthenticated
    ? items
    : guestItems.map((gi) => ({
        id: gi.product.id,
        productId: gi.product.id,
        quantity: gi.quantity,
        product: gi.product,
      }));

  const cartCount = currentItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = currentItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // -------------------- Provide Context --------------------
  return (
    <CartContext.Provider
      value={{
        items: currentItems,
        cartCount,
        cartTotal,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        addToGuestCart,
        updateGuestQuantity,
        removeFromGuestCart,
        syncGuestCartToDb,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
