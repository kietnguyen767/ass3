// app/api/cart/remove/route.ts
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
    const user = jwt.verify(token, process.env.JWT_SECRET || "supersecret") as AuthUser;
    return user;
  } catch {
    return null;
  }
}

// DELETE - Remove single item from cart
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { cartItemId } = body;

    if (!cartItemId) {
      return NextResponse.json(
        { error: "Cart item ID is required" },
        { status: 400 }
      );
    }

    // Find cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // Verify cart belongs to user
    if (cartItem.cart.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    // Get updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    // Calculate cart totals
    const cartTotal = updatedCart?.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;

    const cartCount = updatedCart?.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    ) || 0;

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
      cart: updatedCart,
      cartTotal,
      cartCount,
    });

  } catch (error) {
    console.error("Remove from cart error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Clear entire cart
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    // Find user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      return NextResponse.json({
        success: true,
        message: "Cart is already empty",
      });
    }

    // Delete all cart items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({
      success: true,
      message: "Cart cleared successfully",
      cartTotal: 0,
      cartCount: 0,
    });

  } catch (error) {
    console.error("Clear cart error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}