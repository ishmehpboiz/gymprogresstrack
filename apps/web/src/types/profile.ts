export type Goal = "bulk" | "cut" | "recomp" | "strength" | "general";

export type Experience = "beginner" | "intermediate" | "advanced";

export type Equipment = "full_gym" | "home_gym" | "minimal" | "bodyweight";

export type WeightUnit = "kg" | "lb";

export interface UserProfile {
  goal: Goal;
  experience: Experience;
  trainingDays: string[];
  currentWeight: number;
  targetWeight: number;
  equipment: Equipment;
  onboardingComplete: boolean;
  height?: number;
  units: WeightUnit;
  injuryNotes?: string;
}

export const GOAL_OPTIONS: { value: Goal; label: string; description: string }[] = [
  { value: "bulk", label: "Build muscle", description: "Gain size and strength with a caloric surplus" },
  { value: "cut", label: "Lose fat", description: "Reduce body fat while preserving muscle" },
  { value: "recomp", label: "Recomposition", description: "Build muscle and lose fat at the same time" },
  { value: "strength", label: "Get stronger", description: "Focus on increasing your lifts" },
  { value: "general", label: "General fitness", description: "Stay active and healthy" },
];

export const EXPERIENCE_OPTIONS: { value: Experience; label: string; description: string }[] = [
  { value: "beginner", label: "Beginner", description: "Less than 1 year of consistent training" },
  { value: "intermediate", label: "Intermediate", description: "1–3 years of consistent training" },
  { value: "advanced", label: "Advanced", description: "3+ years of structured training" },
];

export const EQUIPMENT_OPTIONS: { value: Equipment; label: string; description: string }[] = [
  { value: "full_gym", label: "Full gym", description: "Commercial gym with full equipment" },
  { value: "home_gym", label: "Home gym", description: "Barbell, rack, dumbbells at home" },
  { value: "minimal", label: "Minimal equipment", description: "Dumbbells and resistance bands" },
  { value: "bodyweight", label: "Bodyweight only", description: "No equipment needed" },
];

export const WEEKDAYS = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
];

export const UNIT_OPTIONS: { value: WeightUnit; label: string }[] = [
  { value: "kg", label: "Metric (kg)" },
  { value: "lb", label: "Imperial (lb)" },
];
