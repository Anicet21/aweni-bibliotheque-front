import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl p-6 md:p-8">
      <div className="rounded-2xl border border-slate-200/70 bg-white p-6">
        <Spinner label="Chargement de la page..." />
      </div>
    </main>
  );
}
