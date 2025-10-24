import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.userP.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

  const res = NextResponse.json({ message: "Login successful" });

  // Set cookie HTTP-only chuẩn
  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 ngày
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
