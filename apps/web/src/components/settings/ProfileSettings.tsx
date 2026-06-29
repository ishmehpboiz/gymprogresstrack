"use client";

import { useEffect, useState } from "react";
import { AppNav } from "@/components/layout/AppNav";
import { StickyLogButton } from "@/components/layout/StickyLogButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { OptionCard } from "@/components/ui/OptionCard";
import { useAuth } from "@/context/AuthContext";
import { updateUserName } from "@/lib/auth";
import { getProfile, saveProfile } from "@/lib/storage";
import { isValidHeightCm, isValidWeight } from "@/lib/validation";
import {
  EQUIPMENT_OPTIONS,
  EXPERIENCE_OPTIONS,
  GOAL_OPTIONS,
  UNIT_OPTIONS,
  WEEKDAYS,
  type Equipment,
  type Experience,
  type Goal,
  type UserProfile,
  type WeightUnit,
} from "@/types/profile";

export function ProfileSettings() {
  const { user, refreshSession } = useAuth();
  const [name, setName] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [height, setHeight] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [injuryNotes, setInjuryNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = getProfile();
    if (!stored) return;
    setProfile(stored);
    setName(user?.name ?? "");
    setHeight(stored.height?.toString() ?? "");
    setCurrentWeight(stored.currentWeight.toString());
    setTargetWeight(stored.targetWeight.toString());
    setInjuryNotes(stored.injuryNotes ?? "");
  }, [user?.name]);

  if (!profile) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
      </div>
    );
  }

  function updateProfile(patch: Partial<UserProfile>) {
    setProfile((prev) => (prev ? { ...prev, ...patch } : prev));
    setSaved(false);
  }

  function toggleDay(day: string) {
    if (!profile) return;
    const days = profile.trainingDays.includes(day)
      ? profile.trainingDays.filter((d) => d !== day)
      : [...profile.trainingDays, day];
    updateProfile({ trainingDays: days });
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!profile) return;

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (profile.trainingDays.length === 0) {
      setError("Select at least one training day.");
      return;
    }

    const cw = parseFloat(currentWeight);
    const tw = parseFloat(targetWeight);
    if (!isValidWeight(cw, 30, 300)) {
      setError("Current weight must be between 30 and 300.");
      return;
    }
    if (!isValidWeight(tw, 30, 300)) {
      setError("Target weight must be between 30 and 300.");
      return;
    }

    const h = height ? parseFloat(height) : undefined;
    if (h !== undefined && !isValidHeightCm(h)) {
      setError("Height must be between 100 and 250 cm.");
      return;
    }

    updateUserName(name);
    saveProfile({
      ...profile,
      currentWeight: cw,
      targetWeight: tw,
      height: h,
      injuryNotes: injuryNotes.trim() || undefined,
    });
    refreshSession();
    setSaved(true);
  }

  return (
    <div className="page-container">
      <AppNav />
      <h1 className="text-2xl font-bold text-zinc-50 sm:text-3xl">Profile & settings</h1>
      <p className="mt-1 text-zinc-400">Update your preferences and training context.</p>

      <form onSubmit={handleSave} className="mt-8 space-y-8">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Account
          </h2>
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <p className="text-sm text-zinc-500">Email: {user?.email}</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Goal</h2>
          {GOAL_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={profile.goal === opt.value}
              onSelect={() => updateProfile({ goal: opt.value as Goal })}
            />
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Experience
          </h2>
          {EXPERIENCE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={profile.experience === opt.value}
              onSelect={() => updateProfile({ experience: opt.value as Experience })}
            />
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Training days
          </h2>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {WEEKDAYS.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={`rounded-xl border py-2.5 text-sm font-semibold ${
                  profile.trainingDays.includes(day.value)
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Input
            label={`Current weight (${profile.units})`}
            type="number"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
          />
          <Input
            label={`Target weight (${profile.units})`}
            type="number"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
          />
          <Input
            label="Height (cm, optional)"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">Units</label>
            <select
              value={profile.units}
              onChange={(e) => updateProfile({ units: e.target.value as WeightUnit })}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100"
            >
              {UNIT_OPTIONS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Equipment
          </h2>
          {EQUIPMENT_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={profile.equipment === opt.value}
              onSelect={() => updateProfile({ equipment: opt.value as Equipment })}
            />
          ))}
        </section>

        <Input
          label="Injury notes (optional)"
          placeholder="e.g. Avoid heavy overhead pressing"
          value={injuryNotes}
          onChange={(e) => setInjuryNotes(e.target.value)}
        />

        {error && <p className="text-sm text-red-400">{error}</p>}
        {saved && <p className="text-sm text-emerald-400">Settings saved.</p>}

        <Button type="submit" fullWidth>
          Save settings
        </Button>
      </form>
      <StickyLogButton />
    </div>
  );
}
