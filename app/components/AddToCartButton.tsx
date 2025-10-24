// components/AddToCartButton.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";

// Định nghĩa giao diện Product
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  stock: number;
}

// Định nghĩa Props cho component
interface AddToCartButtonProps {
  product: Product;
  isAuthenticated: boolean;
  variant?: "icon" | "button";
  quantity?: number;
  className?: string;
}

export default function AddToCartButton({
  product,
  isAuthenticated,
  variant = "icon",
  quantity = 1,
  className = "",
}: AddToCartButtonProps) {
  // Lấy hàm xử lý giỏ hàng từ CartContext
  const { addToCart, addToGuestCart, isLoading } = useCart();
  // State để quản lý trạng thái đang thêm sản phẩm
  const [isAdding, setIsAdding] = useState(false);

  // Hàm xử lý khi nhấn nút Thêm vào giỏ hàng
  const handleAddToCart = async (e: React.MouseEvent) => {
    // Ngăn chặn sự kiện click lan truyền (quan trọng khi dùng trong thẻ link hoặc card)
    e.preventDefault();
    e.stopPropagation();

    if (product.stock < 1) {
      alert("Sản phẩm đã hết hàng");
      return;
    }

    setIsAdding(true);
    try {
      if (isAuthenticated) {
        // Người dùng đã đăng nhập: gọi API để thêm vào giỏ hàng
        await addToCart(product.id, quantity);
        alert("Đã thêm vào giỏ hàng!");
      } else {
        // Người dùng là khách: thêm vào giỏ hàng cục bộ (localStorage)
        addToGuestCart(product, quantity);
        alert("Đã thêm vào giỏ hàng! Đăng nhập để lưu giỏ hàng.");
      }
    } catch (error) {
      // Error already handled in context (ví dụ: hiển thị Toast/thông báo)
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // --- RENDERING CHO BIẾN THỂ 'ICON' ---
  if (variant === "icon") {
    return (
      <button
        onClick={handleAddToCart}
        disabled={isAdding || isLoading || product.stock < 1}
        className={`p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title={product.stock < 1 ? "Hết hàng" : "Thêm vào giỏ hàng"}
      >
        {/* Spinner khi đang tải */}
        {isAdding ? (
          <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        ) : (
          // Icon giỏ hàng
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )}
      </button>
    );
  }

  // --- RENDERING CHO BIẾN THỂ 'BUTTON' (MẶC ĐỊNH KHI variant != "icon") ---
  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || isLoading || product.stock < 1}
      className={`group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:shadow-lg hover:-translate-y-0.5 ${className}`}
    >
      {isAdding ? (
        <>
          {/* Spinner và văn bản "Đang thêm..." */}
          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Đang thêm...</span>
        </>
      ) : (
        <>
          {/* Icon giỏ hàng và văn bản nút */}
          <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{product.stock < 1 ? "Hết hàng" : "Thêm vào giỏ"}</span>
        </>
      )}
    </button> // <--- Thẻ đóng đã được bổ sung ở đây
  );
}