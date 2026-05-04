"use client";

import { FormEvent, useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { type Book, getJson } from "@/lib/api";
import { inputClass, panelClass } from "@/lib/ui";

const columns: ColumnDef<Book>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "title", header: "Titre" },
  { accessorKey: "author", header: "Auteur", cell: ({ row }) => row.original.author ?? "-" },
  { accessorKey: "status", header: "Statut", cell: ({ row }) => <StatusBadge value={row.original.status} /> },
];

export default function RecherchePage() {
  const [catalog, setCatalog] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState({
    keyword: "",
    language: "",
    location: "",
    status: "",
    theme: "",
  });

  const onSearchCatalog = async (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(search).forEach(([k, v]) => {
      if (v.trim()) params.set(k, v.trim());
    });
    setLoading(true);
    setCatalog(await getJson<Book[]>(`/api/catalog/search?${params.toString()}`));
    setLoading(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get("keyword") ?? "";
    if (keyword) {
      setSearch((prev) => ({ ...prev, keyword }));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const params = new URLSearchParams();
      Object.entries(search).forEach(([k, v]) => {
        if (v.trim()) params.set(k, v.trim());
      });
      setLoading(true);
      setCatalog(await getJson<Book[]>(`/api/catalog/search?${params.toString()}`));
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">
      <section className={panelClass}>
        <h1 className="text-2xl font-bold">Moteur de recherche</h1>
        <form className="mt-4 grid gap-2 md:grid-cols-6" onSubmit={onSearchCatalog}>
          <input className={inputClass} placeholder="Mot-cle" value={search.keyword} onChange={(e) => setSearch({ ...search, keyword: e.target.value })} />
          <input className={inputClass} placeholder="Langue" value={search.language} onChange={(e) => setSearch({ ...search, language: e.target.value })} />
          <input className={inputClass} placeholder="Emplacement" value={search.location} onChange={(e) => setSearch({ ...search, location: e.target.value })} />
          <input className={inputClass} placeholder="Statut" value={search.status} onChange={(e) => setSearch({ ...search, status: e.target.value })} />
          <input className={inputClass} placeholder="Theme" value={search.theme} onChange={(e) => setSearch({ ...search, theme: e.target.value })} />
          <Button type="submit">Rechercher</Button>
        </form>
      </section>

      <section className={panelClass}>
        <h2 className="text-lg font-semibold">Resultats ({catalog.length})</h2>
        <div className="mt-3">
          <DataTable columns={columns} data={catalog} isLoading={loading} emptyMessage="Lance une recherche pour voir des resultats." />
        </div>
      </section>
    </main>
  );
}
