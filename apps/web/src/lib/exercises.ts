import { getSession } from "@/lib/auth";
import type { ExerciseDefinition, MuscleGroup } from "@/types/exercise";

const CUSTOM_PREFIX = "gym_custom_exercises_";

export const DEFAULT_EXERCISES: ExerciseDefinition[] = [
  { id: "bench-press", name: "Bench Press", muscleGroup: "chest" },
  { id: "incline-bench", name: "Incline Bench Press", muscleGroup: "chest" },
  { id: "dumbbell-press", name: "Dumbbell Press", muscleGroup: "chest" },
  { id: "cable-fly", name: "Cable Fly", muscleGroup: "chest" },
  { id: "push-up", name: "Push-up", muscleGroup: "chest" },
  { id: "barbell-row", name: "Barbell Row", muscleGroup: "back" },
  { id: "lat-pulldown", name: "Lat Pulldown", muscleGroup: "back" },
  { id: "pull-up", name: "Pull-up", muscleGroup: "back" },
  { id: "cable-row", name: "Cable Row", muscleGroup: "back" },
  { id: "deadlift", name: "Deadlift", muscleGroup: "back" },
  { id: "overhead-press", name: "Overhead Press", muscleGroup: "shoulders" },
  { id: "lateral-raise", name: "Lateral Raise", muscleGroup: "shoulders" },
  { id: "face-pull", name: "Face Pull", muscleGroup: "shoulders" },
  { id: "barbell-curl", name: "Barbell Curl", muscleGroup: "arms" },
  { id: "hammer-curl", name: "Hammer Curl", muscleGroup: "arms" },
  { id: "tricep-pushdown", name: "Tricep Pushdown", muscleGroup: "arms" },
  { id: "skull-crusher", name: "Skull Crusher", muscleGroup: "arms" },
  { id: "squat", name: "Squat", muscleGroup: "legs" },
  { id: "leg-press", name: "Leg Press", muscleGroup: "legs" },
  { id: "romanian-deadlift", name: "Romanian Deadlift", muscleGroup: "legs" },
  { id: "lunges", name: "Lunges", muscleGroup: "legs" },
  { id: "leg-curl", name: "Leg Curl", muscleGroup: "legs" },
  { id: "calf-raise", name: "Calf Raise", muscleGroup: "legs" },
  { id: "plank", name: "Plank", muscleGroup: "core" },
  { id: "cable-crunch", name: "Cable Crunch", muscleGroup: "core" },
  { id: "hanging-leg-raise", name: "Hanging Leg Raise", muscleGroup: "core" },
  { id: "treadmill", name: "Treadmill", muscleGroup: "cardio" },
  { id: "rowing-machine", name: "Rowing Machine", muscleGroup: "cardio" },
  { id: "bike", name: "Stationary Bike", muscleGroup: "cardio" },
  { id: "burpees", name: "Burpees", muscleGroup: "full_body" },
  { id: "kettlebell-swing", name: "Kettlebell Swing", muscleGroup: "full_body" },
];

function customKey(userId?: string): string {
  const session = getSession();
  const id = userId ?? session?.user.id;
  if (!id) return "gym_custom_exercises";
  return `${CUSTOM_PREFIX}${id}`;
}

export function getCustomExercises(): ExerciseDefinition[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(customKey());
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ExerciseDefinition[];
  } catch {
    return [];
  }
}

function saveCustomExercises(exercises: ExerciseDefinition[]): void {
  localStorage.setItem(customKey(), JSON.stringify(exercises));
}

export function getAllExercises(): ExerciseDefinition[] {
  return [...DEFAULT_EXERCISES, ...getCustomExercises()];
}

export function searchExercises(
  query: string,
  muscleGroup: MuscleGroup | "all" = "all",
): ExerciseDefinition[] {
  const normalized = query.trim().toLowerCase();

  return getAllExercises().filter((exercise) => {
    const matchesGroup = muscleGroup === "all" || exercise.muscleGroup === muscleGroup;
    const matchesQuery =
      !normalized || exercise.name.toLowerCase().includes(normalized);
    return matchesGroup && matchesQuery;
  });
}

export function exerciseNameExists(name: string): boolean {
  const normalized = name.trim().toLowerCase();
  return getAllExercises().some((e) => e.name.toLowerCase() === normalized);
}

export function addCustomExercise(
  name: string,
  muscleGroup: MuscleGroup,
): { success: true; exercise: ExerciseDefinition } | { success: false; error: string } {
  const trimmed = name.trim();
  if (!trimmed) return { success: false, error: "Exercise name is required." };
  if (exerciseNameExists(trimmed)) {
    return { success: false, error: "An exercise with this name already exists." };
  }

  const exercise: ExerciseDefinition = {
    id: `custom-${crypto.randomUUID()}`,
    name: trimmed,
    muscleGroup,
    isCustom: true,
  };

  saveCustomExercises([...getCustomExercises(), exercise]);
  return { success: true, exercise };
}

export function deleteCustomExercise(id: string): boolean {
  const custom = getCustomExercises();
  const filtered = custom.filter((e) => e.id !== id);
  if (filtered.length === custom.length) return false;
  saveCustomExercises(filtered);
  return true;
}
