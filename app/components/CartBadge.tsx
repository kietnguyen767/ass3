"use client";

import { useCart } from "@/app/context/CartContext";
import Link from "next/link";

export default function CartBadge() {
  const { cartCount } = useCart();

  return (
    <Link
      href="/cart"
      className="hover:text-purple-600 transition-colors duration-200 flex items-center gap-1.5 relative group"
    >
      {/* Icon giỏ hàng */}
      <svg
        className="w-5 h-5 transition-transform group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>

      <span className="hidden md:inline">Giỏ hàng</span>

      {/* ✅ Badge màu đỏ hiển thị số lượng */}
      {cartCount > 0 && (
        <span
          key={cartCount}
          className="absolute -top-2 -right-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full"
        >
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>
  );
}
