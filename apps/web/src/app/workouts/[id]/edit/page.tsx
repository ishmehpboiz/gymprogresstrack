"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { WorkoutForm } from "@/components/workouts/WorkoutForm";
import { workoutToFormValues } from "@/lib/workout-validation";
import { getWorkoutById } from "@/lib/workouts";
import type { WorkoutFormValues } from "@/lib/workout-validation";

export default function EditWorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [initialValues, setInitialValues] = useState<WorkoutFormValues | null>(null);

  useEffect(() => {
    const workout = getWorkoutById(id);
    if (!workout) {
      router.replace("/dashboard");
      return;
    }
    setInitialValues(workoutToFormValues(workout));
  }, [id, router]);

  return (
    <AuthGuard mode="dashboard">
      <main className="min-h-full bg-zinc-950 pb-24">
        {initialValues ? (
          <WorkoutForm mode="edit" initialValues={initialValues} workoutId={id} />
        ) : (
          <div className="flex min-h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
