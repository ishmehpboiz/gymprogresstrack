"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExerciseBlock } from "@/components/workouts/ExerciseBlock";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  createEmptyExercise,
  createEmptyWorkout,
  formValuesToWorkout,
  isDuplicateWorkout,
  validateWorkout,
  type WorkoutFormValues,
} from "@/lib/workout-validation";
import { addWorkout, deleteWorkout, updateWorkout } from "@/lib/workouts";

interface WorkoutFormProps {
  mode: "create" | "edit";
  initialValues?: WorkoutFormValues;
  workoutId?: string;
}

export function WorkoutForm({ mode, initialValues, workoutId }: WorkoutFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<WorkoutFormValues>(
    initialValues ?? createEmptyWorkout(),
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSavedHash, setLastSavedHash] = useState<string | null>(null);

  function updateExercise(index: number, exercise: WorkoutFormValues["exercises"][number]) {
    setValues((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => (i === index ? exercise : ex)),
    }));
  }

  function addExercise() {
    setValues((prev) => ({
      ...prev,
      exercises: [...prev.exercises, createEmptyExercise()],
    }));
  }

  function removeExercise(index: number) {
    setValues((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validationError = validateWorkout(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (isDuplicateWorkout(values, workoutId)) {
      setError("A workout with this name already exists on this date.");
      return;
    }

    const payload = formValuesToWorkout(values);
    const payloadHash = JSON.stringify(payload);
    if (payloadHash === lastSavedHash) {
      setError("No changes to save.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    if (mode === "create") {
      addWorkout(payload);
    } else if (workoutId) {
      const updated = updateWorkout(workoutId, payload);
      if (!updated) {
        setError("Workout not found.");
        setIsSubmitting(false);
        return;
      }
    }

    setLastSavedHash(payloadHash);
    router.push("/dashboard");
  }

  function handleDelete() {
    if (!workoutId) return;
    if (!confirm("Delete this workout? This cannot be undone.")) return;
    deleteWorkout(workoutId);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/dashboard"
        className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-300"
      >
        ← Back to dashboard
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-zinc-50 sm:text-3xl">
        {mode === "create" ? "Log workout" : "Edit workout"}
      </h1>
      <p className="mt-1 text-zinc-400">
        Record exercises, sets, reps, weight, and optional RPE.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Workout name"
            placeholder="e.g. Push Day"
            value={values.name}
            onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <Input
            label="Date"
            type="date"
            value={values.date}
            onChange={(e) => setValues((prev) => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Exercises
            </h2>
            <Button type="button" variant="secondary" onClick={addExercise}>
              + Add exercise
            </Button>
          </div>

          {values.exercises.map((exercise, index) => (
            <ExerciseBlock
              key={index}
              exercise={exercise}
              index={index}
              onChange={updateExercise}
              onRemove={removeExercise}
              canRemove={values.exercises.length > 1}
            />
          ))}
        </div>

        <Input
          label="Notes (optional)"
          placeholder="How did the session feel?"
          value={values.notes}
          onChange={(e) => setValues((prev) => ({ ...prev, notes: e.target.value }))}
        />

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Save workout"
                : "Update workout"}
          </Button>
          {mode === "edit" && (
            <Button
              type="button"
              variant="secondary"
              fullWidth
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={handleDelete}
            >
              Delete workout
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
