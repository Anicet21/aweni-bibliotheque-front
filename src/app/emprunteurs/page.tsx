"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api, type Borrower, getJson } from "@/lib/api";
import { inputClass, panelClass } from "@/lib/ui";

export default function EmprunteursPage() {
  const [items, setItems] = useState<Borrower[]>([]);
  const [form, setForm] = useState({ id: "", fullName: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setItems(await getJson<Borrower[]>("/api/borrowers"));
    setLoading(false);
  };
  useEffect(() => {
    refresh();
  }, []);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`${api}/api/borrowers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setSaving(false);
      return toast.error("Impossible d'ajouter l'emprunteur");
    }
    setForm({ id: "", fullName: "", email: "", phone: "" });
    toast.success("Emprunteur ajoute");
    await refresh();
    setSaving(false);
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">
      <section className={panelClass}>
        <h1 className="text-2xl font-bold">Gestion des emprunteurs</h1>
        <form className="mt-4 grid gap-2 md:grid-cols-5" onSubmit={onCreate}>
          <input className={inputClass} placeholder="ID" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} required />
          <input className={inputClass} placeholder="Nom complet" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          <input className={inputClass} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className={inputClass} placeholder="Telephone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Button type="submit" disabled={saving}>{saving ? "En cours..." : "Ajouter"}</Button>
        </form>
      </section>

      <section className={panelClass}>
        {loading ? <p className="text-sm text-slate-500">Chargement des emprunteurs...</p> : null}
        <div className="space-y-2">
          {items.slice(0, 40).map((x) => (
            <div key={x.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-2 text-sm">
              <span>{x.id} - {x.fullName}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={async () => {
                  const fullName = window.prompt("Nouveau nom", x.fullName);
                  if (!fullName) return;
                  await fetch(`${api}/api/borrowers/${x.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fullName, email: x.email, phone: x.phone }),
                  });
                  toast.success("Emprunteur mis a jour");
                  await refresh();
                }}>Modifier</Button>
                <Button size="sm" variant="outline" onClick={async () => {
                  if (!window.confirm("Supprimer cet emprunteur ?")) return;
                  await fetch(`${api}/api/borrowers/${x.id}`, { method: "DELETE" });
                  toast.success("Emprunteur supprime");
                  await refresh();
                }}>Supprimer</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
