import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
export async function middleware(request: NextRequest){
  const pathname = request.nextUrl.pathname;

  // Allow public pages
  if (
  pathname === "/" ||
  pathname === "/login" ||
  pathname === "/customer" ||
  pathname === "/customer/register" ||
  pathname === "/customer/watchdemo"
) {
  return NextResponse.next();
}

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {

  const payload = (await verifyToken(token)) as {
    role: string;
  };

  if (
    pathname.startsWith("/admin") &&
    payload.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    pathname.startsWith("/customer") &&
    payload.role !== "user"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();

} catch (err) {
  console.log("Middleware Error:", err);

  return NextResponse.redirect(new URL("/", request.url));
}
}
export const config = {
  matcher: [
"/admin/dashboard/:path*",
"/admin/customers/:path*",
"/admin/transactions/:path*",

"/customer/animal/:path*",
"/customer/dashboard/:path*",
"/customer/profile/:path*",
"/customer/transactions/:path*",
"/customer/select-animal/:path*",
],
};
