"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  addCustomExercise,
  searchExercises,
} from "@/lib/exercises";
import {
  MUSCLE_GROUPS,
  muscleGroupLabel,
  type MuscleGroup,
} from "@/types/exercise";

interface ExercisePickerProps {
  label: string;
  value: string;
  onChange: (name: string) => void;
}

export function ExercisePicker({ label, value, onChange }: ExercisePickerProps) {
  const [query, setQuery] = useState(value);
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | "all">("all");
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customMuscle, setCustomMuscle] = useState<MuscleGroup>("chest");
  const [customError, setCustomError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = searchExercises(isOpen ? query : value, muscleFilter);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectExercise(name: string) {
    onChange(name);
    setQuery(name);
    setIsOpen(false);
    setShowCustomForm(false);
  }

  function handleSearchChange(text: string) {
    setQuery(text);
    onChange(text);
    setIsOpen(true);
  }

  function handleAddCustom() {
    setCustomError(null);
    const result = addCustomExercise(customName, customMuscle);
    if (!result.success) {
      setCustomError(result.error);
      return;
    }
    selectExercise(result.exercise.name);
    setCustomName("");
    setCustomMuscle("chest");
    setShowCustomForm(false);
  }

  return (
    <div ref={containerRef} className="relative space-y-3">
      <div>
        <label className="block text-sm font-medium text-zinc-300">{label}</label>
        <input
          type="text"
          placeholder="Search exercises..."
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {MUSCLE_GROUPS.map((group) => (
          <button
            key={group.value}
            type="button"
            onClick={() => {
              setMuscleFilter(group.value);
              setIsOpen(true);
            }}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              muscleFilter === group.value
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {group.label}
          </button>
        ))}
      </div>

      {isOpen && !showCustomForm && (
        <div className="absolute left-0 right-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl">
          {results.length > 0 ? (
            results.map((exercise) => (
              <button
                key={exercise.id}
                type="button"
                onClick={() => selectExercise(exercise.name)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-zinc-800 ${
                  exercise.name === value ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-200"
                }`}
              >
                <span>{exercise.name}</span>
                <span className="text-xs text-zinc-500">
                  {muscleGroupLabel(exercise.muscleGroup)}
                  {exercise.isCustom ? " · Custom" : ""}
                </span>
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-zinc-500">No exercises found.</p>
          )}
        </div>
      )}

      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          setShowCustomForm((v) => !v);
          setIsOpen(false);
          setCustomError(null);
        }}
      >
        {showCustomForm ? "Cancel custom" : "+ Add custom exercise"}
      </Button>

      {showCustomForm && (
        <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-4 space-y-3">
          <Input
            label="Exercise name"
            placeholder="e.g. Machine Chest Press"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">Muscle group</label>
            <select
              value={customMuscle}
              onChange={(e) => setCustomMuscle(e.target.value as MuscleGroup)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none focus:border-emerald-500"
            >
              {MUSCLE_GROUPS.filter((g) => g.value !== "all").map((group) => (
                <option key={group.value} value={group.value}>
                  {group.label}
                </option>
              ))}
            </select>
          </div>
          {customError && <p className="text-xs text-red-400">{customError}</p>}
          <Button type="button" onClick={handleAddCustom} fullWidth>
            Save custom exercise
          </Button>
        </div>
      )}
    </div>
  );
}
