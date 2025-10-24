"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/app/context/CartContext";
import { OrderProvider } from "@/app/context/OrderContext";

interface ProvidersProps {
  children: ReactNode;
  isAuthenticated: boolean;
}

/**
 * ✅ Providers component
 * Gộp các context (Cart, Order, v.v...) vào 1 chỗ duy nhất.
 * Dễ mở rộng mà không cần sửa layout chính.
 */
export function Providers({ children, isAuthenticated }: ProvidersProps) {
  return (
    <CartProvider isAuthenticated={isAuthenticated}>
      <OrderProvider>
        {children}
      </OrderProvider>
    </CartProvider>
  );
}
