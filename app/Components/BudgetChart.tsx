"use client"; // CRUCIAL pour Recharts
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'];

export default function BudgetChart({ data }: { data: any[] }) {
  // Si aucune donnée, on affiche un message plutôt qu'un graphique vide
  if (!data || data.length === 0 || data.every(d => d.value === 0)) {
    return (
      <div className="h-[300px] flex items-center justify-center text-slate-400 italic text-sm border-2 border-dashed border-slate-100 rounded-2xl">
        Ajoutez des dépenses pour voir le graphique
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full"> {/* Hauteur fixe obligatoire */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
         <Pie
    data={data}
    dataKey="value" // Doit correspondre exactement au nom dans ta requête SQL
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={80}
    paddingAngle={5}
>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
          />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}