"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/dashboard/StatCard";
import { AppNav } from "@/components/layout/AppNav";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { buildDashboardStats, formatRelativeDay } from "@/lib/dashboard-stats";
import { getLatestBodyweight, seedBodyweightFromProfile } from "@/lib/bodyweight";
import { getProfile } from "@/lib/storage";
import {
  formatWorkoutDate,
  getExerciseCount,
  getTotalVolume,
  getWorkouts,
  seedMockWorkouts,
} from "@/lib/workouts";
import type { UserProfile } from "@/types/profile";
import type { DashboardStats } from "@/types/workout";

export function DashboardOverview() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const storedProfile = getProfile();
    if (!storedProfile) return;

    const workouts = seedMockWorkouts(storedProfile);
    seedBodyweightFromProfile(storedProfile.currentWeight);
    const latestWeight = getLatestBodyweight() ?? storedProfile.currentWeight;
    setProfile(storedProfile);
    setStats({
      ...buildDashboardStats(storedProfile, workouts),
      currentBodyweight: latestWeight,
    });
  }, []);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (!profile || !stats) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
      </div>
    );
  }

  const weightDelta = stats.targetBodyweight - stats.currentBodyweight;
  const weightHint =
    weightDelta === 0
      ? "At target weight"
      : weightDelta > 0
        ? `${weightDelta.toFixed(1)} kg to gain`
        : `${Math.abs(weightDelta).toFixed(1)} kg to lose`;

  function logWorkoutUrl(name?: string, date?: string): string {
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (date) params.set("date", date);
    const query = params.toString();
    return query ? `/workouts/new?${query}` : "/workouts/new";
  }

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-6 pb-28 sm:px-6 sm:py-8 sm:pb-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Overview
          </p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-50 sm:text-3xl">
            Hey, {user?.name?.split(" ")[0] ?? "there"}
          </h1>
          <p className="mt-1 text-zinc-400">Here&apos;s where you stand this week.</p>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          Log out
        </Button>
      </header>

      <AppNav />

      <section className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Workouts this week"
          value={stats.workoutsThisWeek}
          hint={`${profile.trainingDays.length} days planned`}
          accent="emerald"
        />
        <StatCard
          label="Current weight"
          value={`${stats.currentBodyweight} kg`}
          hint={weightHint}
          accent="zinc"
        />
        <StatCard
          label="Training streak"
          value={`${stats.streak} ${stats.streak === 1 ? "day" : "days"}`}
          hint="Scheduled days hit in a row"
          accent="amber"
        />
        <StatCard
          label="Target weight"
          value={`${stats.targetBodyweight} kg`}
          hint="From onboarding"
          accent="zinc"
        />
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm font-medium text-zinc-500">Latest session</p>
          {stats.latestWorkout ? (
            <>
              <Link
                href={`/workouts/${stats.latestWorkout.id}/edit`}
                className="group mt-2 block"
              >
                <h2 className="text-xl font-bold text-zinc-50 group-hover:text-emerald-400">
                  {stats.latestWorkout.name}
                </h2>
              </Link>
              <p className="mt-1 text-sm text-zinc-400">
                {formatWorkoutDate(stats.latestWorkout.date)}
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <span className="rounded-lg bg-zinc-800 px-3 py-1.5 text-zinc-300">
                  {getExerciseCount(stats.latestWorkout)} exercises
                </span>
                <span className="rounded-lg bg-zinc-800 px-3 py-1.5 text-zinc-300">
                  {getTotalVolume(stats.latestWorkout).toLocaleString()} kg volume
                </span>
              </div>
              {stats.latestWorkout.notes && (
                <p className="mt-4 text-sm italic text-zinc-500">
                  &ldquo;{stats.latestWorkout.notes}&rdquo;
                </p>
              )}
            </>
          ) : (
            <p className="mt-4 text-zinc-500">No workouts logged yet.</p>
          )}
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="text-sm font-medium text-emerald-400/80">Next suggested workout</p>
          {stats.nextWorkout ? (
            <>
              <h2 className="mt-2 text-xl font-bold text-zinc-50">
                {stats.nextWorkout.suggestion}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                {formatRelativeDay(stats.nextWorkout.date)} &middot; {stats.nextWorkout.dayLabel}
              </p>
              <p className="mt-4 text-sm text-zinc-500">
                Based on your {profile.goal} goal and {profile.trainingDays.length}-day schedule.
              </p>
              <Button
                className="mt-5"
                fullWidth
                onClick={() =>
                  router.push(
                    logWorkoutUrl(
                      stats.nextWorkout!.suggestion,
                      stats.nextWorkout!.date,
                    ),
                  )
                }
              >
                Log workout
              </Button>
            </>
          ) : (
            <p className="mt-4 text-zinc-500">Add training days in your profile.</p>
          )}
        </div>
      </section>

      <div className="fixed bottom-6 left-1/2 z-10 -translate-x-1/2 sm:hidden">
        <Button
          className="shadow-lg shadow-emerald-500/20"
          onClick={() => router.push(logWorkoutUrl())}
        >
          + Log workout
        </Button>
      </div>
    </div>
  );
}
