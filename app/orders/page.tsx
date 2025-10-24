"use client";

import { useState } from "react";
import { useOrder } from "@/app/context/OrderContext";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
  Phone,
  User,
  Tag,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const STATUS_CONFIG = {
  pending: {
    label: "Đang xử lý",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
    iconColor: "text-yellow-600",
  },
  processing: {
    label: "Đã xác nhận",
    icon: CheckCircle,
    color: "bg-blue-100 text-blue-700 border-blue-300",
    iconColor: "text-blue-600",
  },
  shipped: {
    label: "Đang giao hàng",
    icon: Truck,
    color: "bg-purple-100 text-purple-700 border-purple-300",
    iconColor: "text-purple-600",
  },
  delivered: {
    label: "Đã giao",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700 border-green-300",
    iconColor: "text-green-600",
  },
  cancelled: {
    label: "Đã hủy",
    icon: XCircle,
    color: "bg-red-100 text-red-700 border-red-300",
    iconColor: "text-red-600",
  },
};

const PAYMENT_METHOD_LABELS = {
  cod: "Thanh toán khi nhận hàng",
  momo: "Ví MoMo",
  card: "Thẻ tín dụng/ghi nợ",
};

export default function OrdersPage() {
  const { orders } = useOrder();
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) newSet.delete(orderId);
      else newSet.add(orderId);
      return newSet;
    });
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Package className="w-20 h-20 text-gray-300 mb-4" />
        <h2 className="text-3xl font-bold mb-3 text-gray-900">
          Chưa có đơn hàng nào
        </h2>
        <p className="text-gray-600 mb-6">
          Hãy khám phá sản phẩm và đặt hàng ngay!
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
        >
          Khám phá ngay
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">
          Đơn hàng của bạn
        </h1>
        <p className="text-gray-600">Quản lý và theo dõi đơn hàng của bạn</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
            filterStatus === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Tất cả ({orders.length})
        </button>
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const count = orders.filter((o) => o.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                filterStatus === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const statusConfig =
            STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
          const StatusIcon = statusConfig.icon;
          const isExpanded = expandedOrders.has(order.id);

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="text-blue-600" size={20} />
                      <span className="text-sm text-gray-500">Mã đơn hàng</span>
                    </div>
                    <h2 className="text-xl font-bold text-blue-600">
                      {order.id}
                    </h2>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${statusConfig.color}`}
                  >
                    <StatusIcon size={18} className={statusConfig.iconColor} />
                    <span className="font-semibold">
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="text-gray-400" size={16} />
                    <div>
                      <div className="text-xs text-gray-500">Ngày đặt</div>
                      <div className="text-sm font-medium">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="text-gray-400" size={16} />
                    <div>
                      <div className="text-xs text-gray-500">Sản phẩm</div>
                      <div className="text-sm font-medium">
                        {order.items.length} món
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="text-gray-400" size={16} />
                    <div>
                      <div className="text-xs text-gray-500">Thanh toán</div>
                      <div className="text-sm font-medium">
                        {
                          PAYMENT_METHOD_LABELS[
                            order.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS
                          ]
                        }
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="text-gray-400" size={16} />
                    <div>
                      <div className="text-xs text-gray-500">Tổng tiền</div>
                      <div className="text-sm font-bold text-blue-600">
                        {order.total.toLocaleString("vi-VN")}₫
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleOrderDetails(order.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-t border-gray-100 text-blue-600 font-medium hover:bg-blue-50 transition rounded-b-xl -mb-6 -mx-6"
                >
                  <span>{isExpanded ? "Ẩn chi tiết" : "Xem chi tiết"}</span>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 p-6 space-y-6">
                  <div className="bg-white rounded-xl p-4">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="text-blue-600" size={18} />
                      Thông tin người nhận
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <User className="text-gray-400 mt-0.5" size={16} />
                        <span className="text-gray-700">
                          {order.customer?.name ?? "Không có thông tin"}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="text-gray-400 mt-0.5" size={16} />
                        <span className="text-gray-700">
                          {order.customer?.phone ?? "—"}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="text-gray-400 mt-0.5" size={16} />
                        <span className="text-gray-700">
                          {order.customer?.address ?? "—"}
                        </span>
                      </div>
                      {order.customer?.note && (
                        <div className="flex items-start gap-2 pt-2 border-t">
                          <span className="text-gray-500">Ghi chú:</span>
                          <span className="ml-2 text-gray-700 italic">
                            {order.customer.note}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="text-blue-600" size={18} />
                      Chi tiết sản phẩm
                    </h3>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={item.id}
                          className={`flex justify-between items-center py-3 ${
                            index !== order.items.length - 1
                              ? "border-b border-gray-100"
                              : ""
                          }`}
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.price.toLocaleString("vi-VN")}₫ ×{" "}
                              {item.quantity}
                            </div>
                          </div>
                          <div className="font-bold text-gray-900">
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN"
                            )}
                            ₫
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tạm tính:</span>
                        <span className="font-medium">
                          {(order.total + (order.discount ?? 0)).toLocaleString(
                            "vi-VN"
                          )}
                          ₫
                        </span>
                      </div>
                      {(order.discount ?? 0) > 0 && (
                        <div className="flex justify-between text-sm text-orange-600">
                          <span>
                            Giảm giá {order.voucher ? `(${order.voucher})` : ""}
                            :
                          </span>
                          <span className="font-medium">
                            -{(order.discount ?? 0).toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span className="text-gray-900">Tổng cộng:</span>
                        <span className="text-blue-600">
                          {order.total.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
