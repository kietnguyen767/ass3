"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, FileText, DollarSign, ImageIcon, Save, AlertCircle, CheckCircle, Upload, X } from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 1000,
    imageUrl: "",
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name,
          description: data.description,
          price: data.price,
          imageUrl: data.imageUrl || "",
        });
        if (data.imageUrl) {
          setPreviewImage(data.imageUrl);
        }
      });
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedFileName(null);
    setPreviewImage(form.imageUrl || null);
    const fileInput = document.getElementById("file") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async () => {
    if (form.price < 1000) {
      setMessage({ type: "error", text: "Giá sản phẩm phải lớn hơn hoặc bằng 1.000₫" });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price.toString());

    const fileInput = document.getElementById("file") as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append("file", fileInput.files[0]);
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Cập nhật sản phẩm thành công!" });
        setTimeout(() => router.push(`/products/${id}`), 1500);
      } else {
        const error = await res.json();
        setMessage({ type: "error", text: error.error || "Có lỗi xảy ra khi cập nhật" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Lỗi kết nối mạng" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Package className="text-blue-600" size={36} />
            Chỉnh sửa sản phẩm
          </h1>
          <p className="text-gray-600">Cập nhật thông tin sản phẩm của bạn</p>
        </div>

        {/* Alert Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="flex-shrink-0" size={20} />
            ) : (
              <AlertCircle className="flex-shrink-0" size={20} />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Package size={18} className="text-blue-600" />
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Nhập tên sản phẩm..."
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText size={18} className="text-blue-600" />
                  Mô tả sản phẩm
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  rows={4}
                  placeholder="Nhập mô tả chi tiết về sản phẩm..."
                />
              </div>

              {/* Price */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign size={18} className="text-blue-600" />
                  Giá bán (₫)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.price}
                    min={1000}
                    step={1000}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="1000"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₫</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Giá tối thiểu: 1.000₫</p>
              </div>

              {/* Image Upload */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <ImageIcon size={18} className="text-blue-600" />
                  Hình ảnh sản phẩm
                </label>

                {/* Preview Image */}
                {previewImage && (
                  <div className="relative mb-4 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                    {selectedFileName && (
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-lg"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                )}

                {/* Upload Button */}
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file"
                  className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:from-blue-100 hover:to-purple-100 transition group"
                >
                  <Upload className="text-blue-600 group-hover:scale-110 transition" size={24} />
                  <span className="font-medium text-gray-700">
                    {selectedFileName ? "Thay đổi ảnh" : "Chọn ảnh mới"}
                  </span>
                </label>

                {selectedFileName && (
                  <p className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Đã chọn: <span className="font-medium">{selectedFileName}</span>
                  </p>
                )}

                {!selectedFileName && form.imageUrl && (
                  <p className="mt-2 text-sm text-gray-500">
                    Ảnh hiện tại sẽ được giữ nguyên nếu không chọn ảnh mới
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang cập nhật...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Lưu thay đổi</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle size={18} />
            Lưu ý khi chỉnh sửa
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Tên sản phẩm nên ngắn gọn và dễ nhớ</li>
            <li>• Mô tả chi tiết giúp khách hàng hiểu rõ hơn về sản phẩm</li>
            <li>• Giá sản phẩm phải từ 1.000₫ trở lên</li>
            <li>• Hình ảnh nên có chất lượng cao và rõ ràng</li>
          </ul>
        </div>
      </main>
    </div>
  );
}