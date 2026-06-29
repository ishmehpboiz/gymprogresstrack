"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workouts", label: "History" },
  { href: "/bodyweight", label: "Weight" },
  { href: "/progress", label: "Progress" },
  { href: "/records", label: "PRs" },
  { href: "/settings", label: "Settings" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="-mx-1 mb-6 overflow-x-auto border-b border-zinc-800 pb-3 sm:mb-8 sm:pb-4">
      <div className="flex min-w-max gap-1 px-1 sm:flex-wrap">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href === "/workouts" && pathname.startsWith("/workouts"));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
