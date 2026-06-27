import { type ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  accent?: "emerald" | "zinc" | "amber";
}

const accentStyles = {
  emerald: "border-emerald-500/20 bg-emerald-500/5",
  zinc: "border-zinc-800 bg-zinc-900",
  amber: "border-amber-500/20 bg-amber-500/5",
};

export function StatCard({ label, value, hint, icon, accent = "zinc" }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-4 ${accentStyles[accent]}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-zinc-500">{label}</p>
        {icon && <span className="text-zinc-600">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-bold text-zinc-50">{value}</p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}
