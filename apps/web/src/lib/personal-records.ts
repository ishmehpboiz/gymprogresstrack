import type { Workout } from "@/types/workout";

export interface PersonalRecord {
  exerciseName: string;
  bestWeight: number;
  bestReps: number;
  estimated1RM: number;
  date: string;
}

function estimate1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

export function calculatePersonalRecords(workouts: Workout[]): PersonalRecord[] {
  const byExercise = new Map<string, PersonalRecord>();

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      const name = exercise.name.trim();
      if (!name) continue;

      for (const set of exercise.sets) {
        if (set.reps <= 0) continue;

        const e1rm = estimate1RM(set.weight, set.reps);
        const existing = byExercise.get(name.toLowerCase());

        if (!existing) {
          byExercise.set(name.toLowerCase(), {
            exerciseName: name,
            bestWeight: set.weight,
            bestReps: set.reps,
            estimated1RM: e1rm,
            date: workout.date,
          });
          continue;
        }

        const updated = { ...existing, exerciseName: name };
        let changed = false;

        if (set.weight > existing.bestWeight) {
          updated.bestWeight = set.weight;
          updated.bestReps = set.reps;
          updated.date = workout.date;
          changed = true;
        } else if (set.weight === existing.bestWeight && set.reps > existing.bestReps) {
          updated.bestReps = set.reps;
          updated.date = workout.date;
          changed = true;
        }

        if (e1rm > existing.estimated1RM) {
          updated.estimated1RM = e1rm;
          if (!changed) updated.date = workout.date;
        }

        byExercise.set(name.toLowerCase(), updated);
      }
    }
  }

  return [...byExercise.values()].sort((a, b) =>
    a.exerciseName.localeCompare(b.exerciseName),
  );
}
