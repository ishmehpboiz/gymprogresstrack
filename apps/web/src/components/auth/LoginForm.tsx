"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { authErrorMessage } from "@/lib/auth";
import { isOnboardingComplete } from "@/lib/storage";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = login({ email, password });
    if (!result.success) {
      setError(authErrorMessage(result.error!));
      setIsSubmitting(false);
      return;
    }

    router.replace(isOnboardingComplete() ? "/dashboard" : "/onboarding");
  }

  return (
    <AuthGuard mode="guest">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Gym Progress Track
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-50">Welcome back</h1>
          <p className="mt-2 text-zinc-400">Log in to continue tracking your progress.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-emerald-400 hover:text-emerald-300">
            Sign up
          </Link>
        </p>
      </div>
    </AuthGuard>
  );
}
