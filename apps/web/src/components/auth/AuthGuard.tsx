"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isOnboardingComplete } from "@/lib/storage";

type AuthGuardMode = "auth" | "guest" | "onboarding" | "dashboard";

interface AuthGuardProps {
  children: ReactNode;
  mode: AuthGuardMode;
}

export function AuthGuard({ children, mode }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const onboardingComplete = isOnboardingComplete();

    if (mode === "guest" && isAuthenticated) {
      router.replace(onboardingComplete ? "/dashboard" : "/onboarding");
      return;
    }

    if (mode === "auth" && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (mode === "onboarding") {
      if (!isAuthenticated) {
        router.replace("/login");
        return;
      }
      if (onboardingComplete) {
        router.replace("/dashboard");
      }
    }

    if (mode === "dashboard") {
      if (!isAuthenticated) {
        router.replace("/login");
        return;
      }
      if (!onboardingComplete) {
        router.replace("/onboarding");
      }
    }
  }, [isLoading, isAuthenticated, mode, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
      </div>
    );
  }

  if (mode === "guest" && isAuthenticated) return null;
  if (mode === "auth" && !isAuthenticated) return null;
  if (mode === "onboarding" && (!isAuthenticated || isOnboardingComplete())) return null;
  if (mode === "dashboard" && (!isAuthenticated || !isOnboardingComplete())) return null;

  return <>{children}</>;
}
