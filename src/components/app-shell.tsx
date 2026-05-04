"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { Toaster } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { getJson } from "@/lib/api";

const labels: Record<string, string> = {
  dashboard: "Dashboard",
  catalogue: "Catalogue",
  recherche: "Recherche",
  livres: "Livres",
  emprunteurs: "Emprunteurs",
  emprunts: "Emprunts",
  retards: "Retards",
  doublons: "Doublons",
  parametres: "Parametres",
  login: "Connexion",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [lateLoans, setLateLoans] = useState(0);

  useEffect(() => {
    getJson<{ lateLoans: number }>("/api/dashboard")
      .then((d) => setLateLoans(d.lateLoans ?? 0))
      .catch(() => setLateLoans(0));
  }, [pathname]);

  const crumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    const built: Array<{ href: string; label: string }> = [];
    parts.forEach((part, idx) => {
      const href = `/${parts.slice(0, idx + 1).join("/")}`;
      built.push({ href, label: labels[part] ?? part });
    });
    return built;
  }, [pathname]);

  const submitQuickSearch = () => {
    const value = q.trim();
    router.push(value ? `/recherche?keyword=${encodeURIComponent(value)}` : "/recherche");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <AppSidebar className="relative z-50" onNavigate={() => setOpen(false)} />
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 md:px-8">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200/70 bg-slate-50 px-3">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                className="h-10 w-full bg-transparent text-sm outline-none"
                placeholder="Recherche rapide (titre, auteur...)"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitQuickSearch()}
              />
            </div>
            <Button onClick={submitQuickSearch}>Chercher</Button>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200/70 px-3 py-2 text-xs">
              <Bell className="h-4 w-4 text-red-600" />
              <span>{lateLoans} retards</span>
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-4 pb-3 text-xs text-slate-500 md:px-8">
            <Link href="/dashboard">Accueil</Link>
            {crumbs.map((c) => (
              <span key={c.href} className="flex items-center gap-2">
                <span>/</span>
                <Link href={c.href}>{c.label}</Link>
              </span>
            ))}
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="border-t border-slate-200/70 bg-white">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 text-xs text-slate-500 md:px-8">
            <p>Bibliotheque AWENI</p>
          </div>
        </footer>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
