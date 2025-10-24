//products/page.tsx
import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // Đảm bảo luôn fetch dữ liệu mới

export default async function ProductsPage() {
  // 🧩 Lấy danh sách sản phẩm từ database
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Chưa có sản phẩm nào 😢</p>
        <Link
          href="/add-product"
          className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all"
        >
          ➕ Thêm sản phẩm đầu tiên
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        🛍️ Danh sách sản phẩm
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
          >
            {/* Product Image */}
            <Link href={`/products/${product.id}`} className="block relative overflow-hidden">
              <img
                src={product.imageUrl || "/placeholder.png"}
                alt={product.name}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            {/* Product Info */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                  {product.description || "Không có mô tả"}
                </p>
              </div>

              {/* Price & View Button */}
              <div className="flex items-center justify-between mt-auto">
                <span className="text-lg font-bold text-blue-600">
                  {product.price.toLocaleString("vi-VN")}₫
                </span>
                <Link
                  href={`/products/${product.id}`}
                  className="text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
