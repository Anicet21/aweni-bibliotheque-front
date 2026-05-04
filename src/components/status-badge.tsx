import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  disponible: "bg-emerald-100 text-emerald-700",
  "emprunte": "bg-blue-100 text-blue-700",
  "en cours": "bg-blue-100 text-blue-700",
  "en retard": "bg-red-100 text-red-700",
  perdu: "bg-slate-200 text-slate-700",
  "en reparation": "bg-orange-100 text-orange-700",
  retourne: "bg-emerald-100 text-emerald-700",
};

export function StatusBadge({ value }: { value?: string | null }) {
  const label = value?.trim() || "—";
  const key = label.toLowerCase();
  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 text-xs font-medium",
        map[key] ?? "bg-slate-100 text-slate-700"
      )}
    >
      {label}
    </span>
  );
}
