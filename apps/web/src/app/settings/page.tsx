import { AuthGuard } from "@/components/auth/AuthGuard";
import { ProfileSettings } from "@/components/settings/ProfileSettings";

export default function SettingsPage() {
  return (
    <AuthGuard mode="dashboard">
      <main className="min-h-full bg-zinc-950 pb-24 sm:pb-8">
        <ProfileSettings />
      </main>
    </AuthGuard>
  );
}
