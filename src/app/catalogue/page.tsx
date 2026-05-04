"use client";

import { useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/status-badge";
import { type Book, getJson } from "@/lib/api";
import { panelClass } from "@/lib/ui";

const columns: ColumnDef<Book>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "title", header: "Titre" },
  { accessorKey: "author", header: "Auteur", cell: ({ row }) => row.original.author ?? "-" },
  { accessorKey: "language", header: "Langue", cell: ({ row }) => row.original.language ?? "-" },
  { accessorKey: "theme", header: "Theme", cell: ({ row }) => row.original.theme ?? "-" },
  { accessorKey: "location", header: "Emplacement", cell: ({ row }) => row.original.location ?? "-" },
  { accessorKey: "status", header: "Statut", cell: ({ row }) => <StatusBadge value={row.original.status} /> },
];

export default function CataloguePage() {
  const [catalog, setCatalog] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJson<Book[]>("/api/books")
      .then(setCatalog)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-7xl p-6 md:p-8">
      <section className={panelClass}>
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Catalogue des ressources</h1>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
            {catalog.length} resultats
          </span>
        </div>
        <DataTable columns={columns} data={catalog} isLoading={loading} emptyMessage="Aucun livre dans le catalogue." />
      </section>
    </main>
  );
}
