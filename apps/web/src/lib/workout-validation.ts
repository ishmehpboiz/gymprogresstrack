import type { Workout, WorkoutExercise } from "@/types/workout";
import { isValidReps, isValidRpe, isValidWeight } from "@/lib/validation";
import { getWorkouts } from "@/lib/workouts";

export interface WorkoutFormValues {
  name: string;
  date: string;
  notes: string;
  exercises: WorkoutExercise[];
}

export function validateWorkout(values: WorkoutFormValues): string | null {
  if (!values.name.trim()) {
    return "Workout name is required.";
  }

  if (!values.date) {
    return "Workout date is required.";
  }

  if (values.exercises.length === 0) {
    return "Add at least one exercise.";
  }

  for (const exercise of values.exercises) {
    if (!exercise.name.trim()) {
      return "Every exercise needs a name.";
    }

    if (exercise.sets.length === 0) {
      return `Add at least one set for ${exercise.name || "each exercise"}.`;
    }

    for (const set of exercise.sets) {
      if (!isValidReps(set.reps)) {
        return `${exercise.name}: reps must be between 1 and 999.`;
      }
      if (!isValidWeight(set.weight)) {
        return `${exercise.name}: weight cannot be negative.`;
      }
      if (!isValidRpe(set.rpe)) {
        return `${exercise.name}: RPE must be between 1 and 10.`;
      }
    }
  }

  return null;
}

export function isDuplicateWorkout(
  values: WorkoutFormValues,
  excludeId?: string,
): boolean {
  const name = values.name.trim().toLowerCase();
  return getWorkouts().some(
    (w) =>
      w.id !== excludeId &&
      w.date === values.date &&
      w.name.trim().toLowerCase() === name,
  );
}

export function createEmptyExercise(): WorkoutExercise {
  return {
    name: "",
    sets: [{ reps: 0, weight: 0 }],
  };
}

export function createEmptyWorkout(defaultName = "", defaultDate?: string): WorkoutFormValues {
  return {
    name: defaultName,
    date: defaultDate ?? new Date().toISOString().split("T")[0],
    notes: "",
    exercises: [createEmptyExercise()],
  };
}

export function workoutToFormValues(workout: Workout): WorkoutFormValues {
  return {
    name: workout.name,
    date: workout.date,
    notes: workout.notes ?? "",
    exercises: workout.exercises.map((ex) => ({
      name: ex.name,
      sets: ex.sets.map((s) => ({ ...s })),
    })),
  };
}

export function formValuesToWorkout(values: WorkoutFormValues): Omit<Workout, "id"> {
  return {
    name: values.name.trim(),
    date: values.date,
    notes: values.notes.trim() || undefined,
    exercises: values.exercises.map((ex) => ({
      name: ex.name.trim(),
      sets: ex.sets.map((s) => ({
        reps: s.reps,
        weight: s.weight,
        ...(s.rpe !== undefined && s.rpe > 0 ? { rpe: s.rpe } : {}),
      })),
    })),
  };
}
