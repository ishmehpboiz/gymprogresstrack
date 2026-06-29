import { getSession } from "@/lib/auth";
import type { BodyweightEntry } from "@/types/bodyweight";

const PREFIX = "gym_bodyweight_";

function storageKey(userId?: string): string {
  const session = getSession();
  const id = userId ?? session?.user.id;
  if (!id) return "gym_bodyweight";
  return `${PREFIX}${id}`;
}

export function getBodyweightEntries(): BodyweightEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(storageKey());
  if (!raw) return [];
  try {
    return (JSON.parse(raw) as BodyweightEntry[]).sort((a, b) =>
      b.date.localeCompare(a.date),
    );
  } catch {
    return [];
  }
}

function saveEntries(entries: BodyweightEntry[]): void {
  localStorage.setItem(storageKey(), JSON.stringify(entries));
}

export function addBodyweightEntry(date: string, weight: number): BodyweightEntry {
  const entries = getBodyweightEntries().filter((e) => e.date !== date);
  const entry: BodyweightEntry = { id: crypto.randomUUID(), date, weight };
  saveEntries([...entries, entry].sort((a, b) => b.date.localeCompare(a.date)));
  return entry;
}

export function deleteBodyweightEntry(id: string): boolean {
  const entries = getBodyweightEntries();
  const filtered = entries.filter((e) => e.id !== id);
  if (filtered.length === entries.length) return false;
  saveEntries(filtered);
  return true;
}

export function getLatestBodyweight(): number | null {
  const entries = getBodyweightEntries();
  return entries.length > 0 ? entries[0].weight : null;
}

export function seedBodyweightFromProfile(currentWeight: number): void {
  if (getBodyweightEntries().length > 0) return;
  const today = new Date().toISOString().split("T")[0];
  addBodyweightEntry(today, currentWeight);
}

export function validateBodyweight(weight: number): string | null {
  if (isNaN(weight) || weight <= 0) return "Enter a valid weight.";
  if (weight < 30 || weight > 300) return "Weight must be between 30 and 300 kg.";
  return null;
}
