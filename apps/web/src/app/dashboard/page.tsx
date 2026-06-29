import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

export default function DashboardPage() {
  return (
    <AuthGuard mode="dashboard">
      <main className="min-h-full bg-zinc-950 pb-24 sm:pb-0">
        <DashboardOverview />
      </main>
    </AuthGuard>
  );
}
