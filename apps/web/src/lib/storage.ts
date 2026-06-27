import type { UserProfile } from "@/types/profile";
import { getSession } from "@/lib/auth";

const PROFILE_PREFIX = "gym_profile_";

function profileKey(userId?: string): string {
  const session = getSession();
  const id = userId ?? session?.user.id;
  if (!id) return "gym_profile";
  return `${PROFILE_PREFIX}${id}`;
}

export function getProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(profileKey());
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  const session = getSession();
  const key = profileKey(session?.user.id);
  localStorage.setItem(key, JSON.stringify(profile));
}

export function clearProfile(): void {
  localStorage.removeItem(profileKey());
}

export function isOnboardingComplete(): boolean {
  return getProfile()?.onboardingComplete === true;
}
