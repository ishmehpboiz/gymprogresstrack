import { AuthGuard } from "@/components/auth/AuthGuard";
import { BodyweightTracker } from "@/components/bodyweight/BodyweightTracker";

export default function BodyweightPage() {
  return (
    <AuthGuard mode="dashboard">
      <main className="min-h-full bg-zinc-950">
        <BodyweightTracker />
      </main>
    </AuthGuard>
  );
}
