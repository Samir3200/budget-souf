"use server";

import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const identifiant = formData.get("identifiant") as string;
  const password = formData.get("password") as string;

  // 1. Chercher l'utilisateur
  const user = await db.query.users.findFirst({
    where: eq(users.identifiant, identifiant),
  });

  // 2. Vérifier le mot de passe (Ici en clair pour le test, mais à hasher plus tard !)
  if (!user || user.motDePasse !== password) {
    return { error: "Identifiant ou mot de passe incorrect" };
  }

  // 3. Créer la session dans les cookies (Expire dans 7 jours)
  const cookieStore = await cookies();
  cookieStore.set("user_id", user.id.toString(), {
    httpOnly: true, // Sécurité : empêche le vol du cookie par JS
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, 
    path: "/",
  });

  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("user_id");
  redirect("/");
}