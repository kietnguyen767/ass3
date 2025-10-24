"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useOrder } from "@/app/context/OrderContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Tag, CreditCard, Wallet, Banknote, ChevronRight } from "lucide-react";

const SUGGESTED_ADDRESSES = [
  { id: 1, label: "Nhà riêng", address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM" },
  { id: 2, label: "Văn phòng", address: "456 Lê Lai, Quận 1, TP.HCM" },
];

const VOUCHERS = [
  { id: "FREESHIP", name: "Miễn phí vận chuyển", discount: 30000, type: "shipping" },
  { id: "SALE10", name: "Giảm 10%", discount: 10, type: "percent" },
  { id: "SAVE50K", name: "Giảm 50.000₫", discount: 50000, type: "fixed" },
];

const PAYMENT_METHODS = [
  { id: "cod", name: "Thanh toán khi nhận hàng (COD)", icon: Banknote },
  { id: "momo", name: "Ví MoMo", icon: Wallet },
  { id: "card", name: "Thẻ tín dụng/ghi nợ", icon: CreditCard },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const { addOrder } = useOrder();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useCustomAddress, setUseCustomAddress] = useState(true);

  // ✅ Cập nhật dữ liệu input, xử lý riêng cho phone
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, "").slice(0, 11);
      setFormData((prev) => ({ ...prev, phone: onlyNums }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" })); // xóa lỗi khi người dùng nhập lại
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ và tên";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9]{10,11}$/.test(formData.phone))
      newErrors.phone = "Số điện thoại không hợp lệ (10–11 chữ số)";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ giao hàng";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const selectSuggestedAddress = (address: string) => {
    setFormData((prev) => ({ ...prev, address }));
    setUseCustomAddress(false);
    setErrors((prev) => ({ ...prev, address: "" }));
  };

  const calculateDiscount = () => {
    const voucher = VOUCHERS.find((v) => v.id === selectedVoucher);
    if (!voucher) return 0;
    if (voucher.type === "percent") return Math.floor(cartTotal * (voucher.discount / 100));
    return voucher.discount;
  };

  const finalTotal = cartTotal - calculateDiscount();

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));

      const order = {
        id: `ORD-${Date.now()}`,
        customer: formData,
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
        total: finalTotal,
        discount: calculateDiscount(),
        voucher: selectedVoucher,
        paymentMethod,
        status: "pending" as const,
        createdAt: new Date(),
      };

      addOrder(order);
      await clearCart();
      router.push("/orders");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Giỏ hàng trống 🛒</h1>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
        >
          Quay lại mua sắm
        </Link>
      </div>
    );
  }

  const selectedVoucherData = VOUCHERS.find((v) => v.id === selectedVoucher);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 lg:px-0 grid lg:grid-cols-3 gap-8">
      {/* Form giao hàng */}
      <div className="lg:col-span-2 space-y-6">
        {/* Thông tin giao hàng */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Thông tin giao hàng</h2>
          </div>

          <div className="space-y-5">
            {/* Họ tên */}
            <div>
              <input
                name="name"
                placeholder="Họ và tên"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Số điện thoại */}
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại (10–11 chữ số)"
                value={formData.phone}
                onChange={handleChange}
                inputMode="numeric"
                pattern="[0-9]{10,11}"
                maxLength={11}
                className={`w-full border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Địa chỉ */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Địa chỉ giao hàng</label>
              <div className="grid grid-cols-2 gap-3">
                {SUGGESTED_ADDRESSES.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => selectSuggestedAddress(addr.address)}
                    className={`p-3 border-2 rounded-xl text-left transition ${
                      formData.address === addr.address && !useCustomAddress
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-900">{addr.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{addr.address}</div>
                  </button>
                ))}
              </div>
              <input
                name="address"
                placeholder="Hoặc nhập địa chỉ khác"
                value={formData.address}
                onChange={(e) => {
                  handleChange(e);
                  setUseCustomAddress(true);
                }}
                className={`w-full border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Ghi chú */}
            <textarea
              name="note"
              placeholder="Ghi chú (tuỳ chọn)"
              value={formData.note}
              rows={3}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Voucher */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="text-orange-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Mã giảm giá</h2>
          </div>

          <button
            type="button"
            onClick={() => setShowVoucherModal(!showVoucherModal)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-400 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Tag className="text-orange-500" size={20} />
              <span className="text-gray-700">
                {selectedVoucherData ? selectedVoucherData.name : "Chọn hoặc nhập mã"}
              </span>
            </div>
            <ChevronRight className="text-gray-400 group-hover:text-orange-500 transition" size={20} />
          </button>

          {showVoucherModal && (
            <div className="mt-4 space-y-2 border-t pt-4">
              {VOUCHERS.map((voucher) => (
                <button
                  key={voucher.id}
                  type="button"
                  onClick={() => {
                    setSelectedVoucher(voucher.id);
                    setShowVoucherModal(false);
                  }}
                  className={`w-full p-4 border-2 rounded-xl text-left transition ${
                    selectedVoucher === voucher.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-orange-600">{voucher.id}</div>
                      <div className="text-sm text-gray-600">{voucher.name}</div>
                    </div>
                    {selectedVoucher === voucher.id && (
                      <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phương thức thanh toán */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="text-green-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Phương thức thanh toán</h2>
          </div>

          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full p-4 border-2 rounded-xl text-left transition flex items-center gap-3 ${
                    paymentMethod === method.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <Icon className={paymentMethod === method.id ? "text-green-600" : "text-gray-400"} size={24} />
                  <span className="flex-1 font-medium text-gray-800">{method.name}</span>
                  {paymentMethod === method.id && (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tóm tắt đơn hàng */}
      <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-4">
        <h2 className="text-2xl font-bold mb-6">Đơn hàng của bạn</h2>

        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.product.name} <span className="text-gray-500">x{item.quantity}</span>
              </span>
              <span className="font-medium">
                {(item.product.price * item.quantity).toLocaleString("vi-VN")}₫
              </span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tạm tính:</span>
            <span>{cartTotal.toLocaleString("vi-VN")}₫</span>
          </div>
          {selectedVoucher && (
            <div className="flex justify-between text-sm text-orange-600">
              <span>Giảm giá:</span>
              <span>-{calculateDiscount().toLocaleString("vi-VN")}₫</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4 font-bold text-xl flex justify-between mb-6">
          <span>Tổng cộng:</span>
          <span className="text-blue-600">{finalTotal.toLocaleString("vi-VN")}₫</span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Đang xử lý..." : "Xác nhận đặt hàng"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Bằng việc đặt hàng, bạn đồng ý với Điều khoản sử dụng của chúng tôi
        </p>
      </div>
    </div>
  );
}
