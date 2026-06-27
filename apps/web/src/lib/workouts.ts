import { getSession } from "@/lib/auth";
import type { Workout } from "@/types/workout";
import type { Goal, UserProfile } from "@/types/profile";
import { WEEKDAYS } from "@/types/profile";

const WORKOUTS_PREFIX = "gym_workouts_";

function workoutsKey(userId?: string): string {
  const session = getSession();
  const id = userId ?? session?.user.id;
  if (!id) return "gym_workouts";
  return `${WORKOUTS_PREFIX}${id}`;
}

export function getWorkouts(): Workout[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(workoutsKey());
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Workout[];
  } catch {
    return [];
  }
}

export function saveWorkouts(workouts: Workout[]): void {
  localStorage.setItem(workoutsKey(), JSON.stringify(workouts));
}

export function getWorkoutById(id: string): Workout | null {
  return getWorkouts().find((w) => w.id === id) ?? null;
}

export function addWorkout(data: Omit<Workout, "id">): Workout {
  const workout: Workout = { ...data, id: crypto.randomUUID() };
  saveWorkouts([...getWorkouts(), workout]);
  return workout;
}

export function updateWorkout(id: string, data: Omit<Workout, "id">): boolean {
  const workouts = getWorkouts();
  const index = workouts.findIndex((w) => w.id === id);
  if (index === -1) return false;
  workouts[index] = { ...data, id };
  saveWorkouts(workouts);
  return true;
}

export function deleteWorkout(id: string): boolean {
  const workouts = getWorkouts();
  const filtered = workouts.filter((w) => w.id !== id);
  if (filtered.length === workouts.length) return false;
  saveWorkouts(filtered);
  return true;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

function pickTrainingDates(profile: UserProfile, count: number): string[] {
  const dayMap: Record<number, string> = {
    0: "sun",
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
    6: "sat",
  };

  const dates: string[] = [];
  const cursor = new Date();

  while (dates.length < count) {
    const key = dayMap[cursor.getDay()];
    if (profile.trainingDays.includes(key)) {
      dates.push(cursor.toISOString().split("T")[0]);
    }
    cursor.setDate(cursor.getDate() - 1);
  }

  return dates.reverse();
}

const WORKOUT_TEMPLATES: Record<Goal, { name: string; exercises: Workout["exercises"] }[]> = {
  bulk: [
    {
      name: "Push Day",
      exercises: [
        { name: "Bench Press", sets: [{ reps: 8, weight: 60 }, { reps: 8, weight: 60 }, { reps: 6, weight: 62.5 }] },
        { name: "Overhead Press", sets: [{ reps: 10, weight: 35 }, { reps: 8, weight: 37.5 }] },
        { name: "Tricep Pushdown", sets: [{ reps: 12, weight: 25 }, { reps: 12, weight: 25 }] },
      ],
    },
    {
      name: "Pull Day",
      exercises: [
        { name: "Barbell Row", sets: [{ reps: 8, weight: 50 }, { reps: 8, weight: 52.5 }] },
        { name: "Lat Pulldown", sets: [{ reps: 10, weight: 45 }, { reps: 10, weight: 45 }] },
        { name: "Bicep Curl", sets: [{ reps: 12, weight: 12.5 }, { reps: 10, weight: 14 }] },
      ],
    },
    {
      name: "Leg Day",
      exercises: [
        { name: "Squat", sets: [{ reps: 6, weight: 80 }, { reps: 6, weight: 80 }, { reps: 5, weight: 82.5 }] },
        { name: "Romanian Deadlift", sets: [{ reps: 10, weight: 60 }, { reps: 8, weight: 62.5 }] },
        { name: "Leg Press", sets: [{ reps: 12, weight: 100 }, { reps: 10, weight: 110 }] },
      ],
    },
  ],
  cut: [
    {
      name: "Full Body Circuit",
      exercises: [
        { name: "Goblet Squat", sets: [{ reps: 15, weight: 20 }, { reps: 15, weight: 20 }] },
        { name: "Dumbbell Press", sets: [{ reps: 12, weight: 22.5 }, { reps: 12, weight: 22.5 }] },
        { name: "Row", sets: [{ reps: 12, weight: 30 }, { reps: 12, weight: 30 }] },
      ],
    },
    {
      name: "Upper Burn",
      exercises: [
        { name: "Incline Press", sets: [{ reps: 12, weight: 25 }, { reps: 10, weight: 27.5 }] },
        { name: "Lateral Raise", sets: [{ reps: 15, weight: 8 }, { reps: 15, weight: 8 }] },
      ],
    },
  ],
  recomp: [
    {
      name: "Upper / Lower A",
      exercises: [
        { name: "Bench Press", sets: [{ reps: 8, weight: 55 }, { reps: 8, weight: 55 }] },
        { name: "Squat", sets: [{ reps: 8, weight: 70 }, { reps: 8, weight: 70 }] },
      ],
    },
    {
      name: "Upper / Lower B",
      exercises: [
        { name: "Deadlift", sets: [{ reps: 5, weight: 90 }, { reps: 5, weight: 90 }] },
        { name: "Pull-ups", sets: [{ reps: 8, weight: 0 }, { reps: 6, weight: 0 }] },
      ],
    },
  ],
  strength: [
    {
      name: "Heavy Squat",
      exercises: [
        { name: "Squat", sets: [{ reps: 5, weight: 100 }, { reps: 3, weight: 105 }, { reps: 2, weight: 110 }] },
        { name: "Front Squat", sets: [{ reps: 6, weight: 70 }] },
      ],
    },
    {
      name: "Heavy Bench",
      exercises: [
        { name: "Bench Press", sets: [{ reps: 5, weight: 80 }, { reps: 3, weight: 85 }, { reps: 2, weight: 87.5 }] },
        { name: "Close Grip Bench", sets: [{ reps: 8, weight: 60 }] },
      ],
    },
  ],
  general: [
    {
      name: "Full Body",
      exercises: [
        { name: "Leg Press", sets: [{ reps: 12, weight: 80 }] },
        { name: "Cable Row", sets: [{ reps: 12, weight: 40 }] },
        { name: "Shoulder Press", sets: [{ reps: 10, weight: 25 }] },
      ],
    },
  ],
};

export function seedMockWorkouts(profile: UserProfile): Workout[] {
  const existing = getWorkouts();
  if (existing.length > 0) return existing;

  const templates = WORKOUT_TEMPLATES[profile.goal];
  const dates = pickTrainingDates(profile, Math.min(templates.length + 1, 5));

  const workouts: Workout[] = dates.map((date, i) => {
    const template = templates[i % templates.length];
    return {
      id: crypto.randomUUID(),
      name: template.name,
      date,
      exercises: template.exercises,
      notes: i === dates.length - 1 ? "Felt strong today." : undefined,
    };
  });

  // Ensure at least one workout in the current week
  const today = new Date().toISOString().split("T")[0];
  if (!workouts.some((w) => w.date === today) && workouts.length > 0) {
    workouts[workouts.length - 1] = { ...workouts[workouts.length - 1], date: daysAgo(1) };
  }

  saveWorkouts(workouts);
  return workouts;
}

export function formatWorkoutDate(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function getDayLabel(dayValue: string): string {
  return WEEKDAYS.find((d) => d.value === dayValue)?.label ?? dayValue;
}

export function getTotalVolume(workout: Workout): number {
  return workout.exercises.reduce(
    (total, ex) => total + ex.sets.reduce((s, set) => s + set.reps * set.weight, 0),
    0,
  );
}

export function getExerciseCount(workout: Workout): number {
  return workout.exercises.length;
}
