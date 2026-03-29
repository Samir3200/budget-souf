import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // Recherche de l'utilisateur
  const user = await db.query.users.findFirst({
    where: eq(users.identifiant, username),
  });

  if (!user || user.motDePasse !== password) {
    // Mauvais identifiants
    return NextResponse.redirect("/login?error=1");
  }

  // Authentification réussie : on pose un cookie (simple, à sécuriser en prod)
  const response = NextResponse.redirect(new URL("/dashboard", req.url));
  response.cookies.set("user_id", String(user.id), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    // secure: true, // à activer en prod
  });
  return response;
}
