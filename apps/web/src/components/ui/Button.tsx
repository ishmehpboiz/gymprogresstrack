import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500",
  secondary:
    "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700 disabled:opacity-50",
  ghost: "bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50",
};

export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-colors ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
