"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api, getJson } from "@/lib/api";
import { inputClass, panelClass } from "@/lib/ui";

export default function ParametresPage() {
  const [form, setForm] = useState({
    nomBibliotheque: "Bibliotheque AWENI",
    emailContact: "bibliotheque@aweni.com",
    dureeEmprunt: "21",
    alerteRetard: "0",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJson<{
      nomBibliotheque: string;
      emailContact: string;
      dureeEmpruntJours: string;
      alerteRetardJours: string;
    }>("/api/settings")
      .then((s) => {
        setForm({
          nomBibliotheque: s.nomBibliotheque,
          emailContact: s.emailContact,
          dureeEmprunt: s.dureeEmpruntJours,
          alerteRetard: s.alerteRetardJours,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    const res = await fetch(`${api}/api/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nomBibliotheque: form.nomBibliotheque,
        emailContact: form.emailContact,
        dureeEmpruntJours: form.dureeEmprunt,
        alerteRetardJours: form.alerteRetard,
      }),
    });

    if (!res.ok) return toast.error("Impossible de sauvegarder les parametres");
    toast.success("Parametres sauvegardes");
  };

  return (
    <main className="mx-auto max-w-4xl p-6 md:p-8">
      <section className={panelClass}>
        <h1 className="text-2xl font-bold">Parametres</h1>
        <p className="mt-1 text-sm text-slate-500">Configuration de l&apos;application frontend.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input className={inputClass} value={form.nomBibliotheque} onChange={(e) => setForm({ ...form, nomBibliotheque: e.target.value })} placeholder="Nom de la bibliotheque" />
          <input className={inputClass} value={form.emailContact} onChange={(e) => setForm({ ...form, emailContact: e.target.value })} placeholder="Email de contact" />
          <input className={inputClass} value={form.dureeEmprunt} onChange={(e) => setForm({ ...form, dureeEmprunt: e.target.value })} placeholder="Duree emprunt (jours)" />
          <input className={inputClass} value={form.alerteRetard} onChange={(e) => setForm({ ...form, alerteRetard: e.target.value })} placeholder="Alerte retard (jours)" />
        </div>
        <div className="mt-4">
          <Button onClick={save} disabled={loading}>
            {loading ? "Chargement..." : "Enregistrer"}
          </Button>
        </div>
      </section>
    </main>
  );
}
