import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import "./globals.css";
import { Providers } from "./components/Providers";
import { CartProvider } from "@/app/context/CartContext";
import { OrderProvider } from "@/app/context/OrderContext"; // ✅ Thêm dòng này
import CartBadge from "./components/CartBadge";

type AuthUser = { id: string; email: string };

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || "supersecret") as AuthUser;
    return user;
  } catch (error) {
    return null;
  }
}

export const metadata: Metadata = {
  title: "🛍️ Clothing Store | Next.js E-Commerce",
  description: "A simple e-commerce app built with Next.js + JWT/Prisma",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <html lang="vi">
      <body className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 text-gray-900 min-h-screen flex flex-col">
        {/* ✅ Bọc toàn bộ app bằng cả CartProvider + OrderProvider */}
        <CartProvider isAuthenticated={!!user}>
          <OrderProvider>
            <Providers isAuthenticated={!!user}>
              {/* Background hiệu ứng */}
              <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse [animation-delay:700ms]"></div>
              </div>

              {/* Navigation */}
              <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8">
                  <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link
                      href="/"
                      className="group flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                      <span className="text-3xl transition-transform duration-300 group-hover:rotate-12">🛍️</span>
                      <span className="hidden sm:inline">ClothingStore</span>
                    </Link>

                    {/* Navigation Items */}
                    <div className="flex items-center gap-4 lg:gap-6 text-sm font-medium text-gray-700 ml-4 lg:ml-8 mr-auto md:mr-8">
                      <Link
                        href="/"
                        className="hover:text-blue-600 transition-colors duration-200 flex items-center gap-1.5 group"
                      >
                        <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="hidden md:inline">Trang chủ</span>
                      </Link>

                      <Link
                        href="/products"
                        className="hover:text-blue-600 transition-colors duration-200 flex items-center gap-1.5 group"
                      >
                        <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="hidden md:inline">Sản phẩm</span>
                      </Link>

                      {/* ✅ Giỏ hàng có badge động */}
                      <CartBadge />

                      {user && (
                        <Link
                          href="/orders"
                          className="hover:text-blue-600 transition-colors duration-200 flex items-center gap-1.5 group"
                        >
                          <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          <span className="hidden lg:inline">Đơn hàng</span>
                        </Link>
                      )}
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-2 lg:gap-3">
                      {user ? (
                        <>
                          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-100">
                            <span className="text-xl inline-block animate-[wave_2s_ease-in-out_infinite]">👋</span>
                            <span className="text-sm">
                              Chào, <span className="font-semibold text-blue-700">{user.email.split("@")[0]}</span>
                            </span>
                          </div>
                          <Link
                            href="/add-product"
                            className="group relative px-4 lg:px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium overflow-hidden hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-0.5"
                            title="Thêm sản phẩm mới"
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              <span className="hidden sm:inline">Thêm</span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                          </Link>
                          <form action="/api/auth/logout" method="POST">
                            <button
                              type="submit"
                              className="group px-4 lg:px-5 py-2.5 border-2 border-gray-300 rounded-lg font-medium hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                            >
                              <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              <span className="hidden sm:inline">Log out</span>
                            </button>
                          </form>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            className="group px-4 lg:px-5 py-2.5 border-2 border-gray-300 rounded-lg font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                          >
                            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden sm:inline">Đăng nhập</span>
                          </Link>
                          <Link
                            href="/register"
                            className="group relative px-4 lg:px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium overflow-hidden hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:-translate-y-0.5"
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                              </svg>
                              <span className="hidden sm:inline">Đăng ký</span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300"></div>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </nav>

              {/* Nội dung chính */}
              <main className="relative flex-1 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {children}
                </div>
              </main>
            </Providers>
          </OrderProvider>
        </CartProvider>
      </body>
    </html>
  );
}
