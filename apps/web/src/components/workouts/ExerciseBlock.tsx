"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ExercisePicker } from "@/components/exercises/ExercisePicker";
import type { WorkoutExercise } from "@/types/workout";

interface ExerciseBlockProps {
  exercise: WorkoutExercise;
  index: number;
  onChange: (index: number, exercise: WorkoutExercise) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export function ExerciseBlock({
  exercise,
  index,
  onChange,
  onRemove,
  canRemove,
}: ExerciseBlockProps) {
  function updateSet(setIndex: number, field: "reps" | "weight" | "rpe", value: string) {
    const sets = exercise.sets.map((set, i) => {
      if (i !== setIndex) return set;
      if (field === "rpe") {
        const rpe = value === "" ? undefined : parseFloat(value);
        return { ...set, rpe };
      }
      return { ...set, [field]: value === "" ? 0 : parseFloat(value) };
    });
    onChange(index, { ...exercise, sets });
  }

  function addSet() {
    onChange(index, {
      ...exercise,
      sets: [...exercise.sets, { reps: 0, weight: 0 }],
    });
  }

  function removeSet(setIndex: number) {
    if (exercise.sets.length <= 1) return;
    onChange(index, {
      ...exercise,
      sets: exercise.sets.filter((_, i) => i !== setIndex),
    });
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <ExercisePicker
            label={`Exercise ${index + 1}`}
            value={exercise.name}
            onChange={(name) => onChange(index, { ...exercise, name })}
          />
        </div>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            className="mt-7 shrink-0 text-red-400 hover:text-red-300"
            onClick={() => onRemove(index)}
          >
            Remove
          </Button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Sets</p>
        {exercise.sets.map((set, setIndex) => (
          <div key={setIndex} className="grid grid-cols-4 gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <Input
              label={setIndex === 0 ? "Reps" : ""}
              type="number"
              min={1}
              inputMode="numeric"
              placeholder="8"
              value={set.reps || ""}
              onChange={(e) => updateSet(setIndex, "reps", e.target.value)}
            />
            <Input
              label={setIndex === 0 ? "Weight (kg)" : ""}
              type="number"
              min={0}
              step={0.5}
              inputMode="decimal"
              placeholder="60"
              value={set.weight || ""}
              onChange={(e) => updateSet(setIndex, "weight", e.target.value)}
            />
            <Input
              label={setIndex === 0 ? "RPE (opt.)" : ""}
              type="number"
              min={1}
              max={10}
              step={0.5}
              inputMode="decimal"
              placeholder="8"
              value={set.rpe ?? ""}
              onChange={(e) => updateSet(setIndex, "rpe", e.target.value)}
            />
            {exercise.sets.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                className={`text-zinc-500 ${setIndex === 0 ? "mt-7" : ""}`}
                onClick={() => removeSet(setIndex)}
              >
                ×
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={addSet}>
          + Add set
        </Button>
      </div>
    </div>
  );
}
