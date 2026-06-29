"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppNav } from "@/components/layout/AppNav";
import { StickyLogButton } from "@/components/layout/StickyLogButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { filterWorkouts, getUniqueExerciseNames } from "@/lib/progress-data";
import {
  formatWorkoutDate,
  getExerciseCount,
  getTotalVolume,
  getWorkouts,
} from "@/lib/workouts";
import type { Workout } from "@/types/workout";

function WorkoutCard({ workout }: { workout: Workout }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start justify-between gap-4 p-4 text-left"
      >
        <div>
          <h3 className="font-semibold text-zinc-50">{workout.name}</h3>
          <p className="mt-1 text-sm text-zinc-400">{formatWorkoutDate(workout.date)}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-md bg-zinc-800 px-2 py-1 text-zinc-400">
              {getExerciseCount(workout)} exercises
            </span>
            <span className="rounded-md bg-zinc-800 px-2 py-1 text-zinc-400">
              {getTotalVolume(workout).toLocaleString()} kg vol
            </span>
          </div>
        </div>
        <span className="text-zinc-500">{expanded ? "−" : "+"}</span>
      </button>

      {expanded && (
        <div className="border-t border-zinc-800 px-4 pb-4 pt-3">
          {workout.exercises.map((exercise, i) => (
            <div key={i} className="mt-3 first:mt-0">
              <p className="font-medium text-zinc-200">{exercise.name}</p>
              <div className="mt-1 space-y-1">
                {exercise.sets.map((set, j) => (
                  <p key={j} className="text-sm text-zinc-500">
                    Set {j + 1}: {set.reps} reps × {set.weight} kg
                    {set.rpe ? ` @ RPE ${set.rpe}` : ""}
                  </p>
                ))}
              </div>
            </div>
          ))}
          {workout.notes && (
            <p className="mt-3 text-sm italic text-zinc-500">&ldquo;{workout.notes}&rdquo;</p>
          )}
          <Link href={`/workouts/${workout.id}/edit`}>
            <Button variant="secondary" className="mt-4">
              Edit workout
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export function WorkoutHistory() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [exerciseFilter, setExerciseFilter] = useState("");

  useEffect(() => {
    setWorkouts(getWorkouts());
  }, []);

  const exerciseNames = useMemo(() => getUniqueExerciseNames(workouts), [workouts]);

  const filtered = useMemo(
    () => filterWorkouts(workouts, dateFrom, dateTo, exerciseFilter),
    [workouts, dateFrom, dateTo, exerciseFilter],
  );

  return (
    <div className="page-container pb-24 sm:pb-8">
      <AppNav />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Workout history</h1>
          <p className="mt-1 text-zinc-400">{filtered.length} workouts</p>
        </div>
        <Link href="/workouts/new">
          <Button>+ Log workout</Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Input
          label="From date"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <Input
          label="To date"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-300">Exercise</label>
          <select
            value={exerciseFilter}
            onChange={(e) => setExerciseFilter(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-emerald-500"
          >
            <option value="">All exercises</option>
            {exerciseNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <p className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-500">
            No workouts match your filters.
          </p>
        ) : (
          filtered.map((workout) => <WorkoutCard key={workout.id} workout={workout} />)
        )}
      </div>
      <StickyLogButton />
    </div>
  );
}
