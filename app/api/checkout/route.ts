import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

type AuthUser = { id: string; email: string };

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET || "supersecret") as AuthUser;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      shippingName,
      shippingEmail,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingNote,
      paymentMethod,
    } = body;

    if (!shippingName || !shippingPhone || !shippingAddress) {
      return NextResponse.json({ error: "Thiếu thông tin giao hàng" }, { status: 400 });
    }

    // Lấy giỏ hàng người dùng
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Giỏ hàng trống" }, { status: 400 });
    }

    // Tính tổng giá
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const shippingFee = 30000; // phí ship tạm tính
    const discount = 0; // có thể thay đổi sau này
    const total = subtotal + shippingFee - discount;

    // Tạo đơn hàng
    const newOrder = await prisma.order.create({
      data: {
        userId: user.id,
        shippingName,
        shippingEmail: shippingEmail || user.email,
        shippingPhone,
        shippingAddress,
        shippingCity,
        shippingNote,
        paymentMethod: paymentMethod || "COD",
        subtotal,
        shippingFee,
        discount,
        total,
        status: "PENDING",
        paymentStatus: "UNPAID",
        items: {
          create: cart.items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            productPrice: item.product.price,
            productImage: item.product.imageUrl,
            quantity: item.quantity,
            subtotal: item.product.price * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Xóa giỏ hàng sau khi đặt hàng
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({
      success: true,
      message: "Đặt hàng thành công",
      order: newOrder,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      { error: "Lỗi máy chủ. Không thể đặt hàng." },
      { status: 500 }
    );
  }
}
