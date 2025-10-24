import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

// ✅ Kiểm tra token hợp lệ
async function verifyToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("Unauthorized");
  jwt.verify(token, process.env.JWT_SECRET || "supersecret");
  return token;
}

// ================================
// GET: /api/products/[id]
// ================================
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ sửa ở đây
) {
  const { id } = await context.params; // ✅ cần await
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

// ================================
// PUT: /api/products/[id]
// ================================
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ sửa ở đây
) {
  const { id } = await context.params;
  await verifyToken();

  const formData = await req.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const file = formData.get("file") as File | null;

  let imageUrl: string | null = null;

  if (file && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    fs.mkdirSync(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, file.name);
    fs.writeFileSync(filePath, buffer);
    imageUrl = `/uploads/${file.name}`;
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      ...(imageUrl && { imageUrl }),
    },
  });

  return NextResponse.json(updated);
}

// ================================
// DELETE: /api/products/[id]
// ================================
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ sửa ở đây
) {
  const { id } = await context.params;
  await verifyToken();

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
