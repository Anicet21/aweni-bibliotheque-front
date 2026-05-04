"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookCopy, BookOpen, LayoutDashboard, Repeat, Search, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Catalogue", href: "/catalogue", icon: BookCopy },
  { label: "Recherche", href: "/recherche", icon: Search },
  { label: "Livres", href: "/livres", icon: BookOpen },
  { label: "Emprunteurs", href: "/emprunteurs", icon: Users },
  { label: "Emprunts", href: "/emprunts", icon: Repeat },
  { label: "Retards", href: "/retards", icon: Repeat },
  { label: "Doublons", href: "/doublons", icon: LayoutDashboard },
  { label: "Parametres", href: "/parametres", icon: Settings },
];

export function AppSidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className={cn("sticky top-0 h-screen w-72 shrink-0 bg-slate-950 px-4 py-6 text-slate-100", className)}>
      <p className="mb-1 text-xl font-semibold tracking-wide">AWENI</p>
      <p className="mb-6 text-xs text-slate-400">Bibliotheque Dashboard</p>
      <nav className="space-y-2">
        {items.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className={cn(
              "w-full justify-start text-slate-200 hover:bg-slate-800 hover:text-white",
              pathname === item.href && "bg-slate-800 text-white"
            )}
            asChild
          >
            <Link href={item.href} onClick={onNavigate}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
}
