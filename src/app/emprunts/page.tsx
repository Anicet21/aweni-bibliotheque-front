"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/searchable-select";
import { api, type Book, type Borrower, type Loan, getJson } from "@/lib/api";
import { inputClass, panelClass } from "@/lib/ui";

export default function EmpruntsPage() {
  const [items, setItems] = useState<Loan[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
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
    const [loans, bks, brs] = await Promise.all([
      getJson<Loan[]>("/api/loans"),
      getJson<Book[]>("/api/books"),
      getJson<Borrower[]>("/api/borrowers"),
    ]);
    setBooks(bks);
    setBorrowers(brs);
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
    if (!form.bookId || !form.borrowerId) {
      return toast.error("Selectionne un livre et un emprunteur.");
    }
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
        <form
          className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          onSubmit={onCreate}
        >
          <div className="flex min-w-0 flex-col gap-1">
            <label htmlFor="loan-book" className="text-xs font-medium text-slate-600">
              Livre
            </label>
            <div className="min-w-0">
              <SearchableSelect
                id="loan-book"
                value={form.bookId}
                onChange={(value) => setForm({ ...form, bookId: value })}
                placeholder="Selectionner un livre"
                searchPlaceholder="Rechercher un livre..."
                options={books.map((book) => ({
                  value: book.id,
                  label: `${book.title} (${book.id})`,
                }))}
              />
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <label htmlFor="loan-borrower" className="text-xs font-medium text-slate-600">
              Emprunteur
            </label>
            <div className="min-w-0">
              <SearchableSelect
                id="loan-borrower"
                value={form.borrowerId}
                onChange={(value) => setForm({ ...form, borrowerId: value })}
                placeholder="Selectionner un emprunteur"
                searchPlaceholder="Rechercher un emprunteur..."
                options={borrowers.map((b) => ({
                  value: b.id,
                  label: `${b.fullName} (${b.id})`,
                }))}
              />
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <label htmlFor="loan-borrowed-at" className="text-xs font-medium text-slate-600">
              Date d&apos;emprunt
            </label>
            <input
              id="loan-borrowed-at"
              className={`${inputClass} w-full min-w-0`}
              type="date"
              value={form.borrowedAt}
              onChange={(e) => setForm({ ...form, borrowedAt: e.target.value })}
            />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <label htmlFor="loan-due-at" className="text-xs font-medium text-slate-600">
              Date retour prevue
            </label>
            <input
              id="loan-due-at"
              className={`${inputClass} w-full min-w-0`}
              type="date"
              value={form.dueAt}
              onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
            />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <label htmlFor="loan-returned-at" className="text-xs font-medium text-slate-600">
              Date retour effective
            </label>
            <input
              id="loan-returned-at"
              className={`${inputClass} w-full min-w-0`}
              type="date"
              value={form.returnedAt}
              onChange={(e) => setForm({ ...form, returnedAt: e.target.value })}
            />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <label htmlFor="loan-status" className="text-xs font-medium text-slate-600">
              Statut
            </label>
            <input
              id="loan-status"
              className={`${inputClass} w-full min-w-0`}
              placeholder="En cours / En retard / Retourne..."
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <label htmlFor="loan-notes" className="text-xs font-medium text-slate-600">
              Notes
            </label>
            <input
              id="loan-notes"
              className={`${inputClass} w-full min-w-0`}
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="flex min-w-0 flex-col gap-1 justify-end">
            <span className="text-xs font-medium text-transparent select-none" aria-hidden>
              Action
            </span>
            <Button type="submit" className="w-full sm:w-auto" disabled={saving}>
              {saving ? "En cours..." : "Ajouter"}
            </Button>
          </div>
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
