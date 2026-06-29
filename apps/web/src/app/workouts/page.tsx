import { AuthGuard } from "@/components/auth/AuthGuard";
import { WorkoutHistory } from "@/components/workouts/WorkoutHistory";

export default function WorkoutsPage() {
  return (
    <AuthGuard mode="dashboard">
      <main className="min-h-full bg-zinc-950">
        <WorkoutHistory />
      </main>
    </AuthGuard>
  );
}
