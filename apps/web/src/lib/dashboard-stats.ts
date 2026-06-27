import type { UserProfile } from "@/types/profile";
import { WEEKDAYS } from "@/types/profile";
import type { DashboardStats, Workout } from "@/types/workout";
import { getDayLabel } from "@/lib/workouts";

const DAY_INDEX: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

const SUGGESTIONS: Record<UserProfile["goal"], string[]> = {
  bulk: ["Push Day", "Pull Day", "Leg Day", "Upper Hypertrophy"],
  cut: ["Full Body Circuit", "Upper Burn", "Lower Conditioning"],
  recomp: ["Upper / Lower A", "Upper / Lower B", "Full Body Strength"],
  strength: ["Heavy Squat", "Heavy Bench", "Heavy Deadlift"],
  general: ["Full Body", "Cardio + Weights", "Mobility & Strength"],
};

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseDate(dateStr: string): Date {
  return new Date(`${dateStr}T12:00:00`);
}

function isSameWeek(dateStr: string, reference: Date): boolean {
  const date = parseDate(dateStr);
  const weekStart = startOfWeek(reference);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  return date >= weekStart && date < weekEnd;
}

export function countWorkoutsThisWeek(workouts: Workout[], reference = new Date()): number {
  return workouts.filter((w) => isSameWeek(w.date, reference)).length;
}

export function getLatestWorkout(workouts: Workout[]): Workout | null {
  if (workouts.length === 0) return null;
  return [...workouts].sort((a, b) => b.date.localeCompare(a.date))[0];
}

export function calculateStreak(workouts: Workout[], trainingDays: string[]): number {
  if (workouts.length === 0 || trainingDays.length === 0) return 0;

  const workoutDates = new Set(workouts.map((w) => w.date));
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  let streak = 0;
  const cursor = new Date(today);

  for (let i = 0; i < 365; i++) {
    const dayKey = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][cursor.getDay()];

    if (trainingDays.includes(dayKey)) {
      const dateStr = cursor.toISOString().split("T")[0];
      if (workoutDates.has(dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getNextTrainingDay(profile: UserProfile): DashboardStats["nextWorkout"] {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  for (let offset = 0; offset <= 7; offset++) {
    const candidate = new Date(today);
    candidate.setDate(candidate.getDate() + offset);
    const dayKey = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][candidate.getDay()];

    if (profile.trainingDays.includes(dayKey)) {
      const suggestions = SUGGESTIONS[profile.goal];
      const suggestion = suggestions[offset % suggestions.length];
      const dateStr = candidate.toISOString().split("T")[0];

      return {
        day: dayKey,
        dayLabel: getDayLabel(dayKey),
        suggestion,
        date: dateStr,
      };
    }
  }

  return null;
}

export function buildDashboardStats(
  profile: UserProfile,
  workouts: Workout[],
): DashboardStats {
  return {
    workoutsThisWeek: countWorkoutsThisWeek(workouts),
    currentBodyweight: profile.currentWeight,
    targetBodyweight: profile.targetWeight,
    latestWorkout: getLatestWorkout(workouts),
    streak: calculateStreak(workouts, profile.trainingDays),
    nextWorkout: getNextTrainingDay(profile),
  };
}

export function formatRelativeDay(dateStr: string): string {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const target = parseDate(dateStr);
  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return getDayLabel(
    WEEKDAYS.find((d) => DAY_INDEX[d.value] === target.getDay())?.value ?? "mon",
  );
}
