import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Supprime le cookie user_id
  const response = NextResponse.redirect(new URL("/login", req.url));
  response.cookies.set("user_id", "", { path: "/", maxAge: 0 });
  return response;
}
