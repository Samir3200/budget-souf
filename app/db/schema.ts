import { pgTable, serial, text, numeric, integer, timestamp, boolean, date } from 'drizzle-orm/pg-core';

// Table des utilisateurs
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  identifiant: text('identifiant').notNull().unique(),
  motDePasse: text('mot_de_passe').notNull(),
});

// Table des catégories (avec budget mensuel cible)
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  nom: text('nom').notNull(),
  budgetMensuelPrevu: numeric('budget_mensuel_prevu', { precision: 10, scale: 2 }).default('0'),
  isRevenue: boolean('is_revenue').default(false),
});

// Table des transactions (Dépenses et Revenus)
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  montant: numeric('montant', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  dateTransaction: date('date_transaction').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});