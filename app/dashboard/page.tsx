import { 
  getStats, 
  getCategories, 
  getRecentTransactions, 
  getChartData,
  getBudgetStatus,
  addTransaction,
  deleteTransaction // Assurez-vous d'avoir ajouté cette fonction dans vos actions
} from "../db/actions/budget";
import BudgetChart from "@/app/Components/BudgetChart";
import BudgetProgress from "@/app/Components/BudgetProgress";

export default async function Dashboard() {
  // Récupération de toutes les données en parallèle pour une vitesse optimale
  const [solde, categories, lastTransactions, chartData, budgetStatus] = await Promise.all([
    getStats(),
    getCategories(),
    getRecentTransactions(),
    getChartData(),
    getBudgetStatus(),
  ]);
  console.log('chartData', JSON.stringify(chartData, null, 2));

  return (
    <main className="min-h-screen bg-slate-50/50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* EN-TÊTE : TITRE ET SOLDE GLOBAL */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Maîtrise Budget</h1>
            <p className="text-slate-500 font-medium">Suivi en temps réel de vos finances</p>
          </div>
          
          <div className="bg-white border-2 border-slate-100 shadow-sm rounded-3xl p-6 min-w-[280px]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Solde Disponible</p>
            <p className={`text-4xl font-black ${Number(solde) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {Number(solde).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLONNE GAUCHE (4/12) : SAISIE ET ANALYSE VISUELLE */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* FORMULAIRE D'AJOUT */}
            <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-xl text-xl font-light">＋</span>
                Ajouter une opération
              </h2>
              
              <form action={addTransaction} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Montant (€)</label>
                  <input 
                    name="amount" 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-blue-500 focus:ring-0 outline-none transition-all font-semibold text-lg text-slate-900"
                    required 
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Description</label>
                  <input 
                    name="description" 
                    placeholder="Ex: Restaurant" 
                    className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-blue-500 outline-none transition-all text-slate-900" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1 uppercase">Catégorie</label>
                  <select 
                    name="categoryId" 
                    className="w-full border-2 border-slate-100 p-4 rounded-2xl bg-white focus:border-blue-500 outline-none appearance-none cursor-pointer text-slate-900"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nom} {cat.isRevenue ? " (Revenu)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-blue-600 active:scale-95 transition-all shadow-xl shadow-slate-200"
                >
                  Valider l'opération
                </button>
              </form>
            </section>

            {/* GRAPHIQUE DE RÉPARTITION */}
            <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Répartition des dépenses</h2>
              <BudgetChart data={chartData} />
            </section>
          </div>

          {/* COLONNE DROITE (8/12) : MAITRISE ET HISTORIQUE */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* BARRES DE PROGRESSION (OBJECTIFS) */}
            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="bg-amber-100 text-amber-600 p-2 rounded-xl text-sm">🎯</span>
                Objectifs Mensuels
              </h2>
              <BudgetProgress data={budgetStatus} />
            </section>

            {/* TABLEAU DES DERNIÈRES OPÉRATIONS AVEC OPTION DE SUPPRESSION */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 ml-2">
                <span className="bg-slate-900 text-white p-2 rounded-xl text-sm">📋</span>
                Dernières opérations
              </h2>
              
              <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden text-slate-900">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Détails</th>
                      <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Catégorie</th>
                      <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {lastTransactions.map((t) => (
                      <tr key={t.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="p-5">
                          <p className="font-bold text-slate-900">{t.description || "Sans libellé"}</p>
                          <p className="text-xs text-slate-400 font-medium">
                            {new Date(t.date!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </td>
                        <td className="p-5">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500">
                            {t.categoryName}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex flex-col items-end">
                            <span className={`font-black text-lg ${t.isRevenue ? 'text-emerald-500' : 'text-slate-900'}`}>
                              {t.isRevenue ? '+' : '-'}{Math.abs(Number(t.amount)).toFixed(2)} €
                            </span>
                            
                            {/* FORMULAIRE DE SUPPRESSION */}
                            <form action={async () => {
                              "use server";
                              await deleteTransaction(t.id);
                            }}>
                              <button className="text-[10px] text-rose-400 hover:text-rose-600 font-black uppercase tracking-tighter mt-1 md:opacity-0 group-hover:opacity-100 transition-all">
                                ✕ Supprimer
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {lastTransactions.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-20 text-center">
                          <p className="text-slate-300 font-medium italic">Aucun mouvement enregistré pour le moment.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}