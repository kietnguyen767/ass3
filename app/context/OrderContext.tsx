"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// 🔹 Kiểu dữ liệu của 1 đơn hàng
export interface Order {
  id: string;
  customer?: {
    name: string;
    phone: string;
    address: string;
    note?: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }[];
  total: number;
  discount?: number;
  voucher?: string | null;
  paymentMethod?: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date; // giữ Date để xử lý dễ hơn trong code
}

// 🔹 Kiểu dữ liệu trong Context
interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  clearOrders: () => void;
  getOrderById: (id: string) => Order | undefined;
  isLoading: boolean;
}

// 🔹 Tạo Context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// 🔹 Provider component
export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Load đơn hàng từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("orders");
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt), // 🔄 chuyển string -> Date
        }));
        setOrders(parsed);
      } catch (err) {
        console.error("Error loading orders:", err);
      }
    }
  }, []);

  // ✅ Lưu vào localStorage mỗi khi thay đổi
  useEffect(() => {
    const plainOrders = orders.map((order) => ({
      ...order,
      createdAt: order.createdAt.toISOString(), // 🔄 đảm bảo có thể stringify
    }));
    localStorage.setItem("orders", JSON.stringify(plainOrders));
  }, [orders]);

  // ✅ Thêm đơn hàng mới
  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  // ✅ Xóa toàn bộ đơn hàng (nếu cần)
  const clearOrders = () => {
    setOrders([]);
  };

  // ✅ Lấy đơn hàng theo ID
  const getOrderById = (id: string) => orders.find((o) => o.id === id);

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        clearOrders,
        getOrderById,
        isLoading,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// 🔹 Hook tiện dụng
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
