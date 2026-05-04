"use client";

import { useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { type Book } from "@/lib/api";
import { type DuplicatePayload, getJson } from "@/lib/api";
import { panelClass } from "@/lib/ui";

const columns: ColumnDef<Book>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "title", header: "Titre" },
  { accessorKey: "author", header: "Auteur", cell: ({ row }) => row.original.author ?? "-" },
];

export default function DoublonsPage() {
  const [data, setData] = useState<DuplicatePayload>({
    duplicateTitles: 0,
    duplicateCopies: 0,
    books: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJson<DuplicatePayload>("/api/analytics/duplicates")
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-7xl p-6 md:p-8">
      <section className={panelClass}>
        <h1 className="text-2xl font-bold">Detection des doublons</h1>
        <p className="mt-2 text-sm text-slate-600">
          Titres en doublon: <strong>{data.duplicateTitles}</strong> | Exemplaires:{" "}
          <strong>{data.duplicateCopies}</strong>
        </p>
        <div className="mt-3">
          <DataTable columns={columns} data={data.books} isLoading={loading} emptyMessage="Aucun doublon detecte." />
        </div>
      </section>
    </main>
  );
}
