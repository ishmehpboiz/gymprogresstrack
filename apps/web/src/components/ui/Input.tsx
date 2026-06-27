import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-xl border bg-zinc-900 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 ${error ? "border-red-500" : "border-zinc-700"} ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
