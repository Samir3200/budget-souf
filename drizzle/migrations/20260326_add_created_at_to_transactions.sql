-- Migration: Ajout de la colonne created_at à la table transactions
ALTER TABLE transactions ADD COLUMN created_at timestamp DEFAULT now();
