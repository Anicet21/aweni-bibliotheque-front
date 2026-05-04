"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api, type Loan, getJson } from "@/lib/api";
import { inputClass, panelClass } from "@/lib/ui";

export default function EmpruntsPage() {
  const [items, setItems] = useState<Loan[]>([]);
  const [form, setForm] = useState({
    bookId: "",
    borrowerId: "",
    borrowedAt: "",
    dueAt: "",
    returnedAt: "",
    status: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const loans = await getJson<Loan[]>("/api/loans");
    setItems(
      loans.map((x) => ({
        ...x,
        borrowedAt: x.borrowedAt ? x.borrowedAt.slice(0, 10) : null,
        dueAt: x.dueAt ? x.dueAt.slice(0, 10) : null,
        returnedAt: x.returnedAt ? x.returnedAt.slice(0, 10) : null,
      }))
    );
    setLoading(false);
  };
  useEffect(() => {
    refresh();
  }, []);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`${api}/api/loans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        borrowedAt: form.borrowedAt || null,
        dueAt: form.dueAt || null,
        returnedAt: form.returnedAt || null,
      }),
    });
    if (!res.ok) {
      setSaving(false);
      return toast.error("Impossible de creer l'emprunt");
    }
    setForm({
      bookId: "",
      borrowerId: "",
      borrowedAt: "",
      dueAt: "",
      returnedAt: "",
      status: "",
      notes: "",
    });
    toast.success("Emprunt ajoute");
    await refresh();
    setSaving(false);
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">
      <section className={panelClass}>
        <h1 className="text-2xl font-bold">Gestion des emprunts</h1>
        <form className="mt-4 grid gap-2 md:grid-cols-4" onSubmit={onCreate}>
          <input className={inputClass} placeholder="ID Livre" value={form.bookId} onChange={(e) => setForm({ ...form, bookId: e.target.value })} required />
          <input className={inputClass} placeholder="ID Emprunteur" value={form.borrowerId} onChange={(e) => setForm({ ...form, borrowerId: e.target.value })} required />
          <input className={inputClass} type="date" value={form.borrowedAt} onChange={(e) => setForm({ ...form, borrowedAt: e.target.value })} />
          <input className={inputClass} type="date" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} />
          <input className={inputClass} type="date" value={form.returnedAt} onChange={(e) => setForm({ ...form, returnedAt: e.target.value })} />
          <input className={inputClass} placeholder="Statut" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
          <input className={inputClass} placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <Button type="submit" disabled={saving}>{saving ? "En cours..." : "Ajouter"}</Button>
        </form>
      </section>

      <section className={panelClass}>
        {loading ? <p className="text-sm text-slate-500">Chargement des emprunts...</p> : null}
        <div className="space-y-2">
          {items.slice(0, 40).map((x) => (
            <div key={x.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-2 text-sm">
              <span>#{x.id} - Livre {x.bookId} / Emprunteur {x.borrowerId}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={async () => {
                  const status = window.prompt("Nouveau statut", x.status ?? "");
                  if (status === null) return;
                  await fetch(`${api}/api/loans/${x.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      bookId: x.bookId,
                      borrowerId: x.borrowerId,
                      borrowedAt: x.borrowedAt,
                      dueAt: x.dueAt,
                      returnedAt: x.returnedAt,
                      status,
                      notes: x.notes,
                    }),
                  });
                  toast.success("Emprunt mis a jour");
                  await refresh();
                }}>Modifier</Button>
                <Button size="sm" variant="outline" onClick={async () => {
                  if (!window.confirm("Supprimer cet emprunt ?")) return;
                  await fetch(`${api}/api/loans/${x.id}`, { method: "DELETE" });
                  toast.success("Emprunt supprime");
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
