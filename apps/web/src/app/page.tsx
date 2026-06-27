"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isOnboardingComplete } from "@/lib/storage";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    router.replace(isOnboardingComplete() ? "/dashboard" : "/onboarding");
  }, [isLoading, isAuthenticated, router]);

  return (
    <main className="flex min-h-full items-center justify-center bg-zinc-950">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
    </main>
  );
}
