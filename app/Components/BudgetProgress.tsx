export default function BudgetProgress({ data }: { data: any[] }) {
  return (
    <div className="space-y-6">
      {data.map((item) => {
        const actuel = Number(item.actuel) || 0;
        const limite = Number(item.limite) || 0;
        const pourcentage = Math.min((actuel / limite) * 100, 100);
        
        // Couleur dynamique : Vert -> Orange (80%) -> Rouge (100%)
        let colorClass = "bg-emerald-500";
        if (pourcentage >= 100) colorClass = "bg-rose-500";
        else if (pourcentage >= 80) colorClass = "bg-amber-500";

        return (
          <div key={item.nom} className="space-y-2">
            <div className="flex justify-between text-sm font-bold text-slate-700">
              <span>{item.nom}</span>
              <span>{actuel.toFixed(0)} € / {limite} €</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div 
                className={`h-full transition-all duration-500 ${colorClass}`} 
                style={{ width: `${pourcentage}%` }}
              ></div>
            </div>
            {actuel > limite && (
              <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">
                Budget dépassé de {(actuel - limite).toFixed(2)} €
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}