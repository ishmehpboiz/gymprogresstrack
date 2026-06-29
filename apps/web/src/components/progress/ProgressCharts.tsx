"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppNav } from "@/components/layout/AppNav";
import { getBodyweightEntries } from "@/lib/bodyweight";
import {
  getBodyweightTrendData,
  getExercisePRData,
  getTopExercises,
  getWeeklyVolumeData,
} from "@/lib/progress-data";
import { getWorkouts } from "@/lib/workouts";

const chartTooltipStyle = {
  contentStyle: { background: "#18181b", border: "1px solid #3f3f46" },
  labelStyle: { color: "#a1a1aa" },
};

export function ProgressCharts() {
  const [selectedExercise, setSelectedExercise] = useState("");

  const workouts = getWorkouts();
  const bodyweightEntries = getBodyweightEntries();
  const topExercises = getTopExercises(workouts);
  const exercise = selectedExercise || topExercises[0] || "";

  useEffect(() => {
    if (!selectedExercise && topExercises[0]) {
      setSelectedExercise(topExercises[0]);
    }
  }, [selectedExercise, topExercises]);

  const volumeData = getWeeklyVolumeData(workouts);
  const prData = exercise ? getExercisePRData(workouts, exercise) : [];
  const bodyweightData = getBodyweightTrendData(bodyweightEntries);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <AppNav />
      <h1 className="text-2xl font-bold text-zinc-50">Progress charts</h1>
      <p className="mt-1 text-zinc-400">Visualize strength, volume, and bodyweight trends.</p>

      <div className="mt-8 space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Weekly training volume
          </h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis dataKey="week" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="volume" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Exercise PR trend
            </h2>
            {topExercises.length > 0 && (
              <select
                value={exercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200"
              >
                {topExercises.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            )}
          </div>
          {prData.length > 0 ? (
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                  <XAxis dataKey="label" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} unit=" kg" />
                  <Tooltip {...chartTooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: "#f59e0b" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">
              Log workouts with this exercise to see PR trends.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Bodyweight trend
          </h2>
          {bodyweightData.length > 0 ? (
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bodyweightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                  <XAxis dataKey="label" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} domain={["auto", "auto"]} />
                  <Tooltip {...chartTooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#60a5fa"
                    strokeWidth={2}
                    dot={{ fill: "#60a5fa" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">
              Add bodyweight entries on the Bodyweight page to see this chart.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
