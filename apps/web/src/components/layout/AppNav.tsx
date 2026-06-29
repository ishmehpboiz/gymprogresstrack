"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workouts", label: "History" },
  { href: "/bodyweight", label: "Bodyweight" },
  { href: "/progress", label: "Progress" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex flex-wrap gap-2 border-b border-zinc-800 pb-4">
      {links.map((link) => {
        const active =
          pathname === link.href ||
          (link.href === "/workouts" && pathname.startsWith("/workouts"));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
