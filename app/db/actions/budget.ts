"use server";

import { db } from "@/app/db"; // Votre instance Drizzle
import { categories, transactions, users } from "@/app/db/schema";
import { revalidatePath } from "next/cache";
import { sql, desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";




export async function getStats() {
  const result = await db
    .select({
      total: sql<number>`
        sum(
          CASE 
            WHEN ${categories.isRevenue} = true THEN cast(${transactions.montant} as decimal)
            ELSE -cast(${transactions.montant} as decimal)
          END
        )`,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id));

  return result[0].total || 0;
}

export async function seedCategories() {
  const categoriesExistantes = await db.select().from(categories);
  
  // On n'ajoute que si la table est vide
  if (categoriesExistantes.length === 0) {
    await db.insert(categories).values([
      { nom: "Alimentation", budgetMensuelPrevu: "400", isRevenue: false, userId: 1 },
      { nom: "Loyer & Charges", budgetMensuelPrevu: "800", isRevenue: false, userId: 1 },
      { nom: "Transport", budgetMensuelPrevu: "100", isRevenue: false, userId: 1 },
      { nom: "Loisirs", budgetMensuelPrevu: "150", isRevenue: false, userId: 1 },
      { nom: "Salaire", budgetMensuelPrevu: "0", isRevenue: true, userId: 1 },
    ]);
  }
}

export async function getCategories() {
  return await db.select().from(categories).orderBy(categories.nom);
}

export async function ensureCategoriesExist() {
  const existing = await db.select().from(categories).limit(1);

  // Si la table est vide, on insère les bases
  if (existing.length === 0) {
    console.log("Initialisation des catégories par défaut...");
    // Cherche un utilisateur existant
    const user = await db.query.users.findFirst();
    let userId = user?.id;
    // Si aucun utilisateur, on en crée un de test
    if (!userId) {
      const [newUser] = await db.insert(users).values({
        identifiant: "admin",
        motDePasse: "admin", // À changer en prod !
      }).returning({ id: users.id });
      userId = newUser.id;
    }
    await db.insert(categories).values([
      { nom: "Alimentation", budgetMensuelPrevu: "400", isRevenue: false, userId },
      { nom: "Loyer & Charges", budgetMensuelPrevu: "800", isRevenue: false, userId },
      { nom: "Transport", budgetMensuelPrevu: "100", isRevenue: false, userId },
      { nom: "Loisirs", budgetMensuelPrevu: "150", isRevenue: false, userId },
      { nom: "Salaire", budgetMensuelPrevu: "0", isRevenue: true, userId },
    ]);
  }
}




export async function getRecentTransactions() {
  return await db
    .select({
      id: transactions.id,
      amount: transactions.montant,
      description: transactions.description,
      date: transactions.dateTransaction,
      categoryName: categories.nom,
      isRevenue: categories.isRevenue,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .orderBy(desc(transactions.dateTransaction), desc(transactions.id))
    .limit(10); // On affiche les 10 dernières pour ne pas surcharger
}

export async function getChartData() {
  const data = await db
    .select({
      name: categories.nom,
      // On utilise abs() pour transformer les -250 en 250
      value: sql<number>`sum(abs(cast(${transactions.montant} as decimal)))`,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(categories.isRevenue, false)) // On ne veut que les dépenses
    .groupBy(categories.nom);

    return data.map(d => ({
      ...d,
      value: Number(d.value)
    }));
}

export async function getBudgetStatus() {
  const status = await db
    .select({
      nom: categories.nom,
      value: sql<number>`sum(abs(cast(${transactions.montant} as decimal)))`,
      actuel: sql<number>`sum(abs(${transactions.montant}))`,
      limite: categories.budgetMensuelPrevu,
    })
    .from(categories)
    .leftJoin(transactions, eq(transactions.categoryId, categories.id))
    .where(eq(categories.isRevenue, false)) // Uniquement les dépenses
    .groupBy(categories.nom, categories.budgetMensuelPrevu);
  // Conversion explicite en nombre pour Recharts et BudgetProgress
  return status.map(d => ({
    ...d,
    value: Number(d.value),
    actuel: Number(d.actuel),
    limite: Number(d.limite)
  }));
}



export async function deleteTransaction(id: number) {
  await db.delete(transactions).where(eq(transactions.id, id));
  
  // On rafraîchit la page pour mettre à jour le solde et les graphiques
  revalidatePath("/dashboard");
}



export async function addTransaction(formData: FormData) {

  const cookieStore = await cookies();
  let userIdCookie = cookieStore.get("user_id")?.value;
  if (!userIdCookie) {
    // TEMPORAIRE pour tests locaux : prend le premier utilisateur existant
    const user = await db.query.users.findFirst();
    userIdCookie = user?.id?.toString();
    if (!userIdCookie) throw new Error("Non autorisé");
  }
  const userId = parseInt(userIdCookie);

  await db.insert(transactions).values({
    montant: (formData.get("amount") as string),
    description: formData.get("description") as string,
    categoryId: parseInt(formData.get("categoryId") as string),
    userId: userId, // Utilise l'ID de la session !
  });
  
  revalidatePath("/dashboard");
}

