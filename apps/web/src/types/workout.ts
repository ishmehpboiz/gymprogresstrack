export interface WorkoutSet {
  reps: number;
  weight: number;
}

export interface WorkoutExercise {
  name: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  exercises: WorkoutExercise[];
  notes?: string;
}

export interface DashboardStats {
  workoutsThisWeek: number;
  currentBodyweight: number;
  targetBodyweight: number;
  latestWorkout: Workout | null;
  streak: number;
  nextWorkout: {
    day: string;
    dayLabel: string;
    suggestion: string;
    date: string;
  } | null;
}
