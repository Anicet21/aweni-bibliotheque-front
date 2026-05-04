"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api, type Book, getJson } from "@/lib/api";
import { inputClass, panelClass } from "@/lib/ui";

export default function LivresPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState({ id: "", title: "", author: "", status: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setBooks(await getJson<Book[]>("/api/books"));
    setLoading(false);
  };
  useEffect(() => {
    refresh();
  }, []);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`${api}/api/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setSaving(false);
      return toast.error("Impossible d'ajouter le livre");
    }
    setForm({ id: "", title: "", author: "", status: "" });
    toast.success("Livre ajoute");
    await refresh();
    setSaving(false);
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">
      <section className={panelClass}>
        <h1 className="text-2xl font-bold">Gestion des livres</h1>
        <form className="mt-4 grid gap-2 md:grid-cols-5" onSubmit={onCreate}>
          <input className={inputClass} placeholder="ID" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} required />
          <input className={inputClass} placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className={inputClass} placeholder="Auteur" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <input className={inputClass} placeholder="Statut" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
          <Button type="submit" disabled={saving}>{saving ? "En cours..." : "Ajouter"}</Button>
        </form>
      </section>

      <section className={panelClass}>
        {loading ? <p className="text-sm text-slate-500">Chargement des livres...</p> : null}
        <div className="space-y-2">
          {books.slice(0, 40).map((book) => (
            <div key={book.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-2 text-sm">
              <span>{book.id} - {book.title}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={async () => {
                  const title = window.prompt("Nouveau titre", book.title);
                  if (!title) return;
                  await fetch(`${api}/api/books/${book.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, author: book.author, status: book.status }),
                  });
                  toast.success("Livre mis a jour");
                  await refresh();
                }}>Modifier</Button>
                <Button size="sm" variant="outline" onClick={async () => {
                  if (!window.confirm("Supprimer ce livre ?")) return;
                  await fetch(`${api}/api/books/${book.id}`, { method: "DELETE" });
                  toast.success("Livre supprime");
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
