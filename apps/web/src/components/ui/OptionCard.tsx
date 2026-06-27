interface OptionCardProps {
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

export function OptionCard({ label, description, selected, onSelect }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border p-4 text-left transition-colors ${
        selected
          ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/30"
          : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
      }`}
    >
      <p className={`font-semibold ${selected ? "text-emerald-400" : "text-zinc-100"}`}>
        {label}
      </p>
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
    </button>
  );
}
