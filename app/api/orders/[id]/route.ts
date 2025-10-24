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

/**
 * GET /api/orders/[id]
 * 👉 Lấy thông tin chi tiết 1 đơn hàng
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ cần await vì params là Promise
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    // ✅ Chỉ cho phép xem đơn của chính mình
    if (order.userId !== user.id) {
      return NextResponse.json(
        { error: "Không có quyền truy cập đơn hàng này" },
        { status: 403 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Get Order Detail Error:", error);
    return NextResponse.json(
      { error: "Không thể tải thông tin đơn hàng" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/orders/[id]
 * 👉 Cập nhật trạng thái đơn hàng (hủy, xác nhận, v.v.)
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ sửa: params là Promise
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Thiếu trạng thái đơn hàng" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    if (order.userId !== user.id) {
      return NextResponse.json(
        { error: "Không có quyền cập nhật đơn hàng này" },
        { status: 403 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
        ...(status === "CANCELLED" && { completedAt: new Date() }),
        ...(status === "DELIVERED" && { completedAt: new Date() }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật trạng thái đơn hàng thành ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update Order Error:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật đơn hàng" },
      { status: 500 }
    );
  }
}
