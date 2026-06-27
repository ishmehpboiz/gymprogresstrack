"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/storage";
import type { UserProfile } from "@/types/profile";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const stored = getProfile();
    if (!stored?.onboardingComplete) {
      router.replace("/onboarding");
      return;
    }
    setProfile(stored);
  }, [router]);

  if (!profile) {
    return (
      <main className="flex min-h-full items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
      </main>
    );
  }

  return (
    <main className="min-h-full bg-zinc-950 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-zinc-50">Dashboard</h1>
        <p className="mt-2 text-zinc-400">
          Onboarding complete. Dashboard overview coming next.
        </p>
      </div>
    </main>
  );
}
