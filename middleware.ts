import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Chỉ redirect nếu không có token
  if (
    !token &&
    (req.nextUrl.pathname.startsWith("/add-product") ||
      req.nextUrl.pathname.includes("/edit") ||
      req.nextUrl.pathname.includes("/delete"))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Nếu có token invalid, vẫn cho phép truy cập
  return NextResponse.next();
}

export const config = {
  matcher: ["/add-product/:path*", "/products/:id/edit/:path*", "/products/:id/delete/:path*"],
};
