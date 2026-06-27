"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { getProfile } from "@/lib/storage";
import type { UserProfile } from "@/types/profile";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <AuthGuard mode="dashboard">
      <main className="min-h-full bg-zinc-950 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-50">Dashboard</h1>
              <p className="mt-2 text-zinc-400">
                Welcome back{user?.name ? `, ${user.name}` : ""}. Dashboard overview coming next.
              </p>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              Log out
            </Button>
          </div>

          {profile && (
            <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-sm text-zinc-500">Your goal</p>
              <p className="mt-1 font-semibold capitalize text-zinc-100">{profile.goal}</p>
            </div>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
