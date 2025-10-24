import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// ✅ POST /api/products - Tạo sản phẩm mới
export async function POST(req: Request) {
  try {
    // --- 1️⃣ Xác thực JWT ---
    const cookieHeader = req.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    const token = tokenMatch?.[1];

    // 👉 Nếu bạn chưa có auth, comment 3 dòng này để test nhanh
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    jwt.verify(token, process.env.JWT_SECRET || "supersecret");

    // --- 2️⃣ Nhận dữ liệu JSON ---
    const body = await req.json();

    const {
      name,
      description,
      price,
      stock = 0,
      category,
      featured = false,
      onSale = false,
      salePrice,
      imageUrl,
    } = body;

    // --- 3️⃣ Validate ---
    if (!name || !price) {
      return NextResponse.json(
        { error: "Tên và giá sản phẩm là bắt buộc" },
        { status: 400 }
      );
    }

    // --- 4️⃣ Tạo sản phẩm ---
    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || "",
        price: parseFloat(price),
        stock: parseInt(stock),
        category: category || null,
        featured: featured === true || featured === "true",
        onSale: onSale === true || onSale === "true",
        salePrice: salePrice ? parseFloat(salePrice) : null,
        imageUrl: imageUrl || null,
      },
    });

    // --- 5️⃣ Trả về ---
    return NextResponse.json({
      success: true,
      message: "Tạo sản phẩm thành công!",
      product: newProduct,
    });
  } catch (err: unknown) {
    console.error("❌ Lỗi tạo sản phẩm:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// ✅ GET /api/products - Lấy danh sách sản phẩm
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách sản phẩm:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
