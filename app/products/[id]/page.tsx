// app/products/[id]/page.tsx
import prisma from "@/lib/prisma";
import Link from "next/link";
import ProductActions from "../../components/ProductActions";

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The product you’re looking for doesn’t exist.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Back Button */}
        <Link
          href="/products"
          className="group inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-8"
        >
          <svg
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium">Back to Store</span>
        </Link>

        {/* Product Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Image */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-10 flex items-center justify-center">
              {product.imageUrl ? (
                <div className="relative group">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full max-h-[550px] object-contain rounded-2xl shadow-lg transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                    🔍 Zoom
                  </div>
                </div>
              ) : (
                <div className="w-full h-[500px] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="p-10 flex flex-col">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  In Stock
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  New Arrival
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-blue-600">
                    {product.price.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <p className="text-sm text-green-600 font-medium mt-1">
                  ✓ Miễn phí vận chuyển cho đơn trên 500.000₫
                </p>
              </div>

              {/* Description */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Mô tả sản phẩm
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description ||
                    "Không có mô tả cho sản phẩm này."}
                </p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Tính năng nổi bật
                </h3>
                <ul className="space-y-2">
                  {[
                    "Chất liệu cao cấp, bền đẹp",
                    "Chính sách đổi trả 30 ngày",
                    "Thanh toán an toàn",
                    "Giao hàng toàn quốc nhanh chóng",
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <svg
                        className="w-5 h-5 text-green-600 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto">
                <ProductActions
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  stock={product.stock}
                />
              </div>

              {/* Bottom Info */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  SKU: {product.id.slice(0, 8).toUpperCase()}
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Danh mục: Quần áo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}