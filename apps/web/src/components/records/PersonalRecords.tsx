"use client";

import { AppNav } from "@/components/layout/AppNav";
import { StickyLogButton } from "@/components/layout/StickyLogButton";
import { calculatePersonalRecords } from "@/lib/personal-records";
import { formatWorkoutDate } from "@/lib/workouts";
import { getWorkouts } from "@/lib/workouts";

export function PersonalRecords() {
  const records = calculatePersonalRecords(getWorkouts());

  return (
    <div className="page-container pb-24 sm:pb-8">
      <AppNav />
      <h1 className="text-2xl font-bold text-zinc-50 sm:text-3xl">Personal records</h1>
      <p className="mt-1 text-zinc-400">Best lifts calculated from your logged workouts.</p>

      {records.length === 0 ? (
        <p className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-500">
          Log workouts to see your personal records.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {records.map((record) => (
            <div
              key={record.exerciseName}
              className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5"
            >
              <h2 className="font-semibold text-zinc-50">{record.exerciseName}</h2>
              <p className="mt-1 text-xs text-zinc-500">
                Achieved {formatWorkoutDate(record.date)}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-zinc-900/80 p-3">
                  <p className="text-zinc-500">Best weight</p>
                  <p className="mt-1 text-lg font-bold text-zinc-100">
                    {record.bestWeight} kg
                  </p>
                </div>
                <div className="rounded-lg bg-zinc-900/80 p-3">
                  <p className="text-zinc-500">Best reps</p>
                  <p className="mt-1 text-lg font-bold text-zinc-100">{record.bestReps}</p>
                </div>
                <div className="col-span-2 rounded-lg bg-zinc-900/80 p-3">
                  <p className="text-zinc-500">Estimated 1RM</p>
                  <p className="mt-1 text-lg font-bold text-amber-400">
                    {record.estimated1RM} kg
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <StickyLogButton />
    </div>
  );
}
