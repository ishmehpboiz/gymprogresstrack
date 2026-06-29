import type { BodyweightEntry } from "@/types/bodyweight";
import type { Workout } from "@/types/workout";
import { getTotalVolume } from "@/lib/workouts";

export interface WeeklyVolumePoint {
  week: string;
  volume: number;
}

export interface ExercisePRPoint {
  date: string;
  label: string;
  weight: number;
}

export interface BodyweightPoint {
  date: string;
  label: string;
  weight: number;
}

function parseDate(dateStr: string): Date {
  return new Date(`${dateStr}T12:00:00`);
}

function formatShortDate(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
  });
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function weekLabel(date: Date): string {
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}

export function getWeeklyVolumeData(workouts: Workout[], weeks = 8): WeeklyVolumePoint[] {
  const now = new Date();
  const points: WeeklyVolumePoint[] = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const ref = new Date(now);
    ref.setDate(ref.getDate() - i * 7);
    const weekStart = startOfWeek(ref);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const volume = workouts
      .filter((w) => {
        const d = parseDate(w.date);
        return d >= weekStart && d < weekEnd;
      })
      .reduce((sum, w) => sum + getTotalVolume(w), 0);

    points.push({ week: weekLabel(weekStart), volume: Math.round(volume) });
  }

  return points;
}

export function getExercisePRData(
  workouts: Workout[],
  exerciseName: string,
): ExercisePRPoint[] {
  const prByDate = new Map<string, number>();

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      if (exercise.name.toLowerCase() !== exerciseName.toLowerCase()) continue;
      const bestSet = Math.max(...exercise.sets.map((s) => s.weight), 0);
      const existing = prByDate.get(workout.date) ?? 0;
      if (bestSet > existing) prByDate.set(workout.date, bestSet);
    }
  }

  return [...prByDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, weight]) => ({
      date,
      label: formatShortDate(date),
      weight,
    }));
}

export function getTopExercises(workouts: Workout[], limit = 5): string[] {
  const counts = new Map<string, number>();
  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      const name = exercise.name.trim();
      if (!name) continue;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name);
}

export function getBodyweightTrendData(entries: BodyweightEntry[]): BodyweightPoint[] {
  return [...entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({
      date: e.date,
      label: formatShortDate(e.date),
      weight: e.weight,
    }));
}

export function filterWorkouts(
  workouts: Workout[],
  dateFrom: string,
  dateTo: string,
  exerciseFilter: string,
): Workout[] {
  return workouts
    .filter((w) => {
      if (dateFrom && w.date < dateFrom) return false;
      if (dateTo && w.date > dateTo) return false;
      if (exerciseFilter) {
        return w.exercises.some((e) =>
          e.name.toLowerCase().includes(exerciseFilter.toLowerCase()),
        );
      }
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getUniqueExerciseNames(workouts: Workout[]): string[] {
  const names = new Set<string>();
  for (const w of workouts) {
    for (const e of w.exercises) {
      if (e.name.trim()) names.add(e.name.trim());
    }
  }
  return [...names].sort();
}
