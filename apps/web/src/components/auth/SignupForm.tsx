"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { authErrorMessage } from "@/lib/auth";

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(authErrorMessage("passwords_mismatch"));
      return;
    }

    setIsSubmitting(true);
    const result = signup({ name, email, password });
    if (!result.success) {
      setError(authErrorMessage(result.error!));
      setIsSubmitting(false);
      return;
    }

    router.replace("/onboarding");
  }

  return (
    <AuthGuard mode="guest">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Gym Progress Track
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-50">Create account</h1>
          <p className="mt-2 text-zinc-400">Start tracking your gym progress today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            hint="Minimum 8 characters"
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
            Log in
          </Link>
        </p>
      </div>
    </AuthGuard>
  );
}
