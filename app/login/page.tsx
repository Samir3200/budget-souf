import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md border border-slate-100">
        <h1 className="text-2xl font-black text-slate-900 mb-6 text-center">Connexion</h1>
        <form method="post" action="/api/login" className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Identifiant</label>
            <input
              name="username"
              type="text"
              required
              className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-blue-500 outline-none transition-all text-slate-900"
              placeholder="Votre identifiant"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Mot de passe</label>
            <input
              name="password"
              type="password"
              required
              className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-blue-500 outline-none transition-all text-slate-900"
              placeholder="Votre mot de passe"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-blue-600 active:scale-95 transition-all shadow-xl shadow-slate-200"
          >
            Se connecter
          </button>
        </form>
      </div>
    </main>
  );
}
