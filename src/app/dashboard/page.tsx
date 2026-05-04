"use client";

import { useEffect, useState } from "react";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type Book, type Dashboard, type Loan, getJson } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { panelClass } from "@/lib/ui";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getJson<Dashboard>("/api/dashboard").then(setDashboard),
      getJson<Book[]>("/api/books").then(setBooks),
      getJson<Loan[]>("/api/loans").then(setLoans),
    ]).finally(() => setLoading(false));
  }, []);

  const byTheme = Object.entries(
    books.reduce<Record<string, number>>((acc, b) => {
      const key = b.theme || "Autre";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .slice(0, 6);

  const byMonth = Object.entries(
    loans.reduce<Record<string, number>>((acc, loan) => {
      const src = loan.borrowedAt ?? "";
      const month = src ? src.slice(0, 7) : "Date manquante";
      acc[month] = (acc[month] ?? 0) + 1;
      return acc;
    }, {})
  )
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-8);

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">
      <section className={panelClass}>
        <h1 className="text-3xl font-bold text-slate-900">Tableau de bord AWENI</h1>
        <p className="mt-1 text-sm text-slate-500">
          Vue d&apos;ensemble des ressources et activites de la bibliotheque.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <Metric title="Ressources" value={dashboard?.books ?? 0} loading={loading} />
          <Metric title="Emprunteurs" value={dashboard?.borrowers ?? 0} loading={loading} />
          <Metric title="Emprunts actifs" value={dashboard?.activeLoans ?? 0} loading={loading} />
          <Metric title="Retards" value={dashboard?.lateLoans ?? 0} accent="text-red-600" loading={loading} />
          <Metric
            title="Disponibles"
            value={dashboard?.availableBooks ?? 0}
            accent="text-emerald-700"
            loading={loading}
          />
          <Metric title="Empruntes" value={dashboard?.borrowedBooks ?? 0} loading={loading} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className={panelClass}>
          <h2 className="text-lg font-semibold">Emprunts par mois</h2>
          <div className="mt-4 h-72">
            {loading ? (
              <Spinner label="Chargement graphique..." />
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byMonth}>
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1E3A5F" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            )}
          </div>
        </article>

        <article className={panelClass}>
          <h2 className="text-lg font-semibold">Repartition par theme</h2>
          <div className="mt-4 h-72">
            {loading ? (
              <Spinner label="Chargement graphique..." />
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byTheme} dataKey="value" nameKey="name" outerRadius={95}>
                  {byTheme.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={["#1E3A5F", "#2980B9", "#27AE60", "#E74C3C", "#F59E0B", "#6366F1"][index % 6]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}

function Metric({
  title,
  value,
  accent,
  loading,
}: {
  title: string;
  value: number;
  accent?: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{title}</p>
      <p className={`text-xl font-semibold ${accent ?? ""}`}>{loading ? "..." : value}</p>
    </div>
  );
}
