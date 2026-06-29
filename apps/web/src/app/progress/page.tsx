import { AuthGuard } from "@/components/auth/AuthGuard";
import { ProgressCharts } from "@/components/progress/ProgressCharts";

export default function ProgressPage() {
  return (
    <AuthGuard mode="dashboard">
      <main className="min-h-full bg-zinc-950">
        <ProgressCharts />
      </main>
    </AuthGuard>
  );
}
