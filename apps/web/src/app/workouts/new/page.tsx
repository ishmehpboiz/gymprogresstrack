"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { WorkoutForm } from "@/components/workouts/WorkoutForm";
import { createEmptyWorkout } from "@/lib/workout-validation";

function NewWorkoutContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") ?? "";
  const date = searchParams.get("date") ?? undefined;

  return (
    <WorkoutForm
      mode="create"
      initialValues={createEmptyWorkout(name, date)}
    />
  );
}

export default function NewWorkoutPage() {
  return (
    <AuthGuard mode="dashboard">
      <main className="min-h-full bg-zinc-950 pb-24">
        <Suspense
          fallback={
            <div className="flex min-h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
            </div>
          }
        >
          <NewWorkoutContent />
        </Suspense>
      </main>
    </AuthGuard>
  );
}
