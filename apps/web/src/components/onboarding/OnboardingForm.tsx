"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { OptionCard } from "@/components/ui/OptionCard";
import { saveProfile } from "@/lib/storage";
import {
  EQUIPMENT_OPTIONS,
  EXPERIENCE_OPTIONS,
  GOAL_OPTIONS,
  WEEKDAYS,
  type Equipment,
  type Experience,
  type Goal,
  type UserProfile,
} from "@/types/profile";

const STEPS = [
  { id: "goal", title: "What's your goal?", subtitle: "We'll tailor your experience around this." },
  { id: "experience", title: "Training experience", subtitle: "Helps us set the right expectations." },
  { id: "schedule", title: "Training days", subtitle: "Which days do you usually train?" },
  { id: "weight", title: "Bodyweight", subtitle: "Current and target weight in kg." },
  { id: "equipment", title: "Equipment access", subtitle: "What do you have available?" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

interface FormState {
  goal: Goal | null;
  experience: Experience | null;
  trainingDays: string[];
  currentWeight: string;
  targetWeight: string;
  equipment: Equipment | null;
}

export function OnboardingForm() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    goal: null,
    experience: null,
    trainingDays: [],
    currentWeight: "",
    targetWeight: "",
    equipment: null,
  });

  const currentStep = STEPS[stepIndex];
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  function validateStep(stepId: StepId): string | null {
    switch (stepId) {
      case "goal":
        return form.goal ? null : "Select a goal to continue.";
      case "experience":
        return form.experience ? null : "Select your experience level.";
      case "schedule":
        return form.trainingDays.length > 0 ? null : "Pick at least one training day.";
      case "weight": {
        const current = parseFloat(form.currentWeight);
        const target = parseFloat(form.targetWeight);
        if (!form.currentWeight || isNaN(current) || current <= 0) {
          return "Enter a valid current weight.";
        }
        if (!form.targetWeight || isNaN(target) || target <= 0) {
          return "Enter a valid target weight.";
        }
        if (current < 30 || current > 300) return "Current weight must be between 30 and 300 kg.";
        if (target < 30 || target > 300) return "Target weight must be between 30 and 300 kg.";
        return null;
      }
      case "equipment":
        return form.equipment ? null : "Select your equipment access.";
      default:
        return null;
    }
  }

  function handleNext() {
    const validationError = validateStep(currentStep.id);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      handleSubmit();
    }
  }

  function handleBack() {
    setError(null);
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  function toggleDay(day: string) {
    setForm((prev) => ({
      ...prev,
      trainingDays: prev.trainingDays.includes(day)
        ? prev.trainingDays.filter((d) => d !== day)
        : [...prev.trainingDays, day],
    }));
  }

  function handleSubmit() {
    const validationError = validateStep("equipment");
    if (validationError) {
      setError(validationError);
      return;
    }

    const profile: UserProfile = {
      goal: form.goal!,
      experience: form.experience!,
      trainingDays: form.trainingDays,
      currentWeight: parseFloat(form.currentWeight),
      targetWeight: parseFloat(form.targetWeight),
      equipment: form.equipment!,
      onboardingComplete: true,
    };

    saveProfile(profile);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-medium text-emerald-400">
          Step {stepIndex + 1} of {STEPS.length}
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
          {currentStep.title}
        </h1>
        <p className="mt-2 text-zinc-400">{currentStep.subtitle}</p>

        <div className="mt-8 space-y-3">
          {currentStep.id === "goal" &&
            GOAL_OPTIONS.map((option) => (
              <OptionCard
                key={option.value}
                label={option.label}
                description={option.description}
                selected={form.goal === option.value}
                onSelect={() => setForm((prev) => ({ ...prev, goal: option.value }))}
              />
            ))}

          {currentStep.id === "experience" &&
            EXPERIENCE_OPTIONS.map((option) => (
              <OptionCard
                key={option.value}
                label={option.label}
                description={option.description}
                selected={form.experience === option.value}
                onSelect={() => setForm((prev) => ({ ...prev, experience: option.value }))}
              />
            ))}

          {currentStep.id === "schedule" && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {WEEKDAYS.map((day) => {
                const selected = form.trainingDays.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`rounded-xl border py-3 text-sm font-semibold transition-colors ${
                      selected
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          )}

          {currentStep.id === "weight" && (
            <div className="space-y-4">
              <Input
                label="Current weight (kg)"
                type="number"
                inputMode="decimal"
                min={30}
                max={300}
                step={0.1}
                placeholder="e.g. 75"
                value={form.currentWeight}
                onChange={(e) => setForm((prev) => ({ ...prev, currentWeight: e.target.value }))}
              />
              <Input
                label="Target weight (kg)"
                type="number"
                inputMode="decimal"
                min={30}
                max={300}
                step={0.1}
                placeholder="e.g. 80"
                value={form.targetWeight}
                onChange={(e) => setForm((prev) => ({ ...prev, targetWeight: e.target.value }))}
              />
            </div>
          )}

          {currentStep.id === "equipment" &&
            EQUIPMENT_OPTIONS.map((option) => (
              <OptionCard
                key={option.value}
                label={option.label}
                description={option.description}
                selected={form.equipment === option.value}
                onSelect={() => setForm((prev) => ({ ...prev, equipment: option.value }))}
              />
            ))}
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>

      <div className="mt-10 flex gap-3">
        {stepIndex > 0 && (
          <Button variant="secondary" onClick={handleBack} className="flex-1">
            Back
          </Button>
        )}
        <Button onClick={handleNext} fullWidth={stepIndex === 0} className="flex-1">
          {stepIndex === STEPS.length - 1 ? "Finish setup" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
