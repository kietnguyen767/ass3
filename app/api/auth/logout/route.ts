import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Lấy origin từ request
  const url = new URL("/", req.url); // => absolute URL

  const res = NextResponse.redirect(url);

  // Xóa cookie token
  res.cookies.set("token", "", { maxAge: 0, path: "/" });

  return res;
}
