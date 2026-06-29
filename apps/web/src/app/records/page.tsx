import { AuthGuard } from "@/components/auth/AuthGuard";
import { PersonalRecords } from "@/components/records/PersonalRecords";

export default function RecordsPage() {
  return (
    <AuthGuard mode="dashboard">
      <main className="min-h-full bg-zinc-950 pb-24 sm:pb-8">
        <PersonalRecords />
      </main>
    </AuthGuard>
  );
}
