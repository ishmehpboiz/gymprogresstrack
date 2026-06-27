"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/storage";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const profile = getProfile();
    if (profile?.onboardingComplete) {
      router.replace("/dashboard");
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  return (
    <main className="flex min-h-full items-center justify-center bg-zinc-950">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
    </main>
  );
}
