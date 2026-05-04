"use client";

import { useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { type Overdue, getJson } from "@/lib/api";
import { panelClass } from "@/lib/ui";

const columns: ColumnDef<Overdue>[] = [
  { id: "book", header: "Livre", cell: ({ row }) => row.original.book?.title ?? row.original.bookId },
  {
    id: "borrower",
    header: "Emprunteur",
    cell: ({ row }) => row.original.borrower?.fullName ?? row.original.borrowerId,
  },
  {
    accessorKey: "dueAt",
    header: "Retour prevu",
    cell: ({ row }) => (row.original.dueAt ? row.original.dueAt.slice(0, 10) : "-"),
  },
  {
    id: "lateDays",
    header: "Jours de retard",
    cell: ({ row }) => {
      if (!row.original.dueAt) return "-";
      const due = new Date(row.original.dueAt);
      const days = Math.max(
        0,
        Math.floor((Date.now() - due.getTime()) / (1000 * 60 * 60 * 24))
      );
      return <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">{days}</span>;
    },
  },
];

export default function RetardsPage() {
  const [rows, setRows] = useState<Overdue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJson<Overdue[]>("/api/analytics/overdues")
      .then(setRows)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-7xl p-6 md:p-8">
      <section className={panelClass}>
        <h1 className="text-2xl font-bold text-red-700">Retards & relances</h1>
        <div className="mt-3">
          <DataTable columns={columns} data={rows} isLoading={loading} emptyMessage="Aucun retard actuellement." />
        </div>
      </section>
    </main>
  );
}
