"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { inputClass, panelClass } from "@/lib/ui";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center p-6">
      <section className={`w-full ${panelClass}`}>
        <h1 className="text-2xl font-bold">Connexion</h1>
        <p className="mt-1 text-sm text-slate-500">Acces interface Bibliotheque AWENI</p>
        <div className="mt-4 space-y-3">
          <input className={inputClass} placeholder="Email" />
          <input className={inputClass} type="password" placeholder="Mot de passe" />
          <Button className="w-full" onClick={() => router.push("/dashboard")}>
            Se connecter
          </Button>
        </div>
      </section>
    </main>
  );
}
