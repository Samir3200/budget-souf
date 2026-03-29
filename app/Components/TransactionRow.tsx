"use client";
import { useState } from "react";

type TransactionRowProps = {
  t: any;
  onUpdate: (id: number, newAmount: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export default function TransactionRow({ t, onUpdate, onDelete }: TransactionRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(Number(t.amount).toFixed(2));

  return (
    <tr className="group hover:bg-slate-50/50 transition-colors">
      <td className="p-5">
        <p className="font-bold text-slate-900">{t.description || "Sans libellé"}</p>
        <p className="text-xs text-slate-400 font-medium">
          {new Date(t.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </td>
      <td className="p-5">
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500">
          {t.categoryName}
        </span>
      </td>
      <td className="p-5 text-right">
        <div className="flex flex-col items-end">
          {isEditing ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await onUpdate(t.id, parseFloat(amount));
                setIsEditing(false);
              }}
              className="flex items-center gap-2"
            >
              <input
                name="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-24 border border-slate-200 rounded px-2 py-1 text-right"
                required
              />
              <button type="submit" className="text-xs text-blue-600 font-bold">Valider</button>
              <button type="button" className="text-xs text-slate-400" onClick={() => setIsEditing(false)}>Annuler</button>
            </form>
          ) : (
            <>
              <span className={`font-black text-lg ${t.isRevenue ? 'text-emerald-500' : 'text-slate-900'}`}>
                {t.isRevenue ? '+' : '-'}{Math.abs(Number(t.amount)).toFixed(2)} €
              </span>
              <button
                className="text-[10px] text-blue-400 hover:text-blue-600 font-black uppercase tracking-tighter mt-1 md:opacity-0 group-hover:opacity-100 transition-all"
                onClick={() => setIsEditing(true)}
              >
                ✎ Modifier
              </button>
            </>
          )}
          <button
            onClick={() => onDelete(t.id)}
            className="text-[10px] text-rose-400 hover:text-rose-600 font-black uppercase tracking-tighter mt-1 md:opacity-0 group-hover:opacity-100 transition-all"
          >
            ✕ Supprimer
          </button>
        </div>
      </td>
    </tr>
  );
}
