// app/page.tsx
import Link from "next/link";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import AddToCartButton from "./components/AddToCartButton";

// Tắt cache, luôn fetch dữ liệu mới mỗi lần truy cập
export const revalidate = 0;

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    return user;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  
  const user = await getUser();
  const isAuthenticated = !!user;

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-12 lg:p-16 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Mở cửa 24/7</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Khám phá phong cách của bạn 👋
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
            Bộ sưu tập thời trang hiện đại với hơn <strong>{products.length} sản phẩm</strong> chất lượng cao. 
            Miễn phí vận chuyển cho đơn hàng từ 500.000₫
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="group px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex items-center gap-2"
            >
              <span>Mua sắm ngay</span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link
              href="/products"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50"
            >
              Xem bộ sưu tập
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 text-8xl opacity-20 animate-bounce hidden lg:block">
          🛍️
        </div>
        <div className="absolute bottom-10 right-1/4 text-6xl opacity-10 animate-pulse hidden lg:block">
          ✨
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
          <div className="text-4xl mb-2">📦</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{products.length}+</div>
          <div className="text-sm text-gray-600">Sản phẩm</div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
          <div className="text-4xl mb-2">⭐</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">4.9</div>
          <div className="text-sm text-gray-600">Đánh giá</div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
          <div className="text-4xl mb-2">🚚</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">24h</div>
          <div className="text-sm text-gray-600">Giao hàng</div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
          <div className="text-4xl mb-2">💝</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">1K+</div>
          <div className="text-sm text-gray-600">Khách hàng</div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Sản phẩm nổi bật ✨
            </h2>
            <p className="text-gray-600">
              Khám phá những sản phẩm mới nhất và được yêu thích nhất
            </p>
          </div>
          
          {products.length > 0 && (
            <Link
              href="/products"
              className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group"
            >
              <span>Xem tất cả</span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
        </div>

        {products.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <div className="text-8xl mb-6">📦</div>
            <h3 className="text-3xl font-bold text-gray-700 mb-3">
              Chưa có sản phẩm nào
            </h3>
            <p className="text-gray-500 mb-8 text-lg max-w-md mx-auto">
              Bắt đầu bằng cách thêm sản phẩm đầu tiên vào cửa hàng của bạn
            </p>
            <Link
              href="/add-product"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Thêm sản phẩm đầu tiên</span>
            </Link>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Quick View Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    Xem chi tiết
                  </div>

                  {/* Stock Badge */}
                  {product.stock < 10 && product.stock > 0 && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-lg">
                      Chỉ còn {product.stock}
                    </div>
                  )}
                  
                  {product.stock === 0 && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
                      Hết hàng
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  
                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Giá</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {product.price.toLocaleString('vi-VN')}₫
                      </div>
                    </div>
                    
                    {/* Icon giỏ hàng (chỉ hiển thị, không có onClick) */}
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Button on Mobile */}
        {products.length > 0 && (
          <div className="md:hidden text-center pt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              <span>Xem tất cả sản phẩm</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="text-5xl mb-4 transition-transform group-hover:scale-110">🚚</div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Giao hàng nhanh chóng</h3>
          <p className="text-gray-600 leading-relaxed">
            Miễn phí vận chuyển cho đơn hàng từ 500.000₫. Giao hàng trong 24h tại nội thành.
          </p>
        </div>
        
        <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="text-5xl mb-4 transition-transform group-hover:scale-110">💳</div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Thanh toán an toàn</h3>
          <p className="text-gray-600 leading-relaxed">
            Hỗ trợ đa dạng phương thức thanh toán. Bảo mật thông tin tuyệt đối.
          </p>
        </div>
        
        <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="text-5xl mb-4 transition-transform group-hover:scale-110">🔄</div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Đổi trả dễ dàng</h3>
          <p className="text-gray-600 leading-relaxed">
            Chính sách đổi trả linh hoạt trong 7 ngày. Hoàn tiền 100% nếu không hài lòng.
          </p>
        </div>
      </section>

    </div>
  );
}