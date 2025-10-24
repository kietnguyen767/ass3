import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  if (!email || !password)
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });

  const existing = await prisma.userP.findUnique({ where: { email } });
  if (existing)
    return NextResponse.json({ message: "User already exists" }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.userP.create({
    data: { email, password: hashed, name },
  });

  return NextResponse.json(user, { status: 201 });
}
