"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppNav } from "@/components/layout/AppNav";
import { StickyLogButton } from "@/components/layout/StickyLogButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  addBodyweightEntry,
  deleteBodyweightEntry,
  getBodyweightEntries,
  seedBodyweightFromProfile,
  validateBodyweight,
} from "@/lib/bodyweight";
import { getBodyweightTrendData } from "@/lib/progress-data";
import { getProfile } from "@/lib/storage";
import type { BodyweightEntry } from "@/types/bodyweight";

export function BodyweightTracker() {
  const [entries, setEntries] = useState<BodyweightEntry[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weight, setWeight] = useState("");
  const [error, setError] = useState<string | null>(null);

  function refresh() {
    setEntries(getBodyweightEntries());
  }

  useEffect(() => {
    const profile = getProfile();
    if (profile) seedBodyweightFromProfile(profile.currentWeight);
    refresh();
  }, []);

  const chartData = getBodyweightTrendData(entries);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const w = parseFloat(weight);
    const validationError = validateBodyweight(w);
    if (validationError) {
      setError(validationError);
      return;
    }
    addBodyweightEntry(date, w);
    setWeight("");
    refresh();
  }

  function handleDelete(id: string) {
    deleteBodyweightEntry(id);
    refresh();
  }

  return (
    <div className="page-container pb-24 sm:pb-8">
      <AppNav />
      <h1 className="text-2xl font-bold text-zinc-50">Bodyweight tracking</h1>
      <p className="mt-1 text-zinc-400">Log your weight and track the trend over time.</p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Input
          label="Weight (kg)"
          type="number"
          step={0.1}
          min={30}
          max={300}
          placeholder="e.g. 75"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
        <div className="flex items-end">
          <Button type="submit" fullWidth>
            Log weight
          </Button>
        </div>
      </form>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Weight trend
        </h2>
        {chartData.length > 0 ? (
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis dataKey="label" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{ background: "#18181b", border: "1px solid #3f3f46" }}
                  labelStyle={{ color: "#a1a1aa" }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">Log your first entry to see the chart.</p>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900">
        <h2 className="border-b border-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-400">
          Recent entries
        </h2>
        {entries.length === 0 ? (
          <p className="p-4 text-sm text-zinc-500">No entries yet.</p>
        ) : (
          <>
            <div className="entry-cards p-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-3"
                >
                  <div>
                    <p className="text-sm text-zinc-300">{entry.date}</p>
                    <p className="font-semibold text-zinc-100">{entry.weight} kg</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    className="text-xs text-red-400"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <div className="entry-table responsive-table">
              <table>
            <thead>
              <tr className="border-b border-zinc-800 text-left text-zinc-500">
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Weight</th>
                <th className="px-4 py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-zinc-800/50">
                  <td className="px-4 py-3 text-zinc-300">{entry.date}</td>
                  <td className="px-4 py-3 text-zinc-100">{entry.weight} kg</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <StickyLogButton />
    </div>
  );
}
