"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function StickyLogButton() {
  const router = useRouter();

  return (
    <div className="fixed bottom-4 left-4 right-4 z-20 sm:hidden">
      <Button
        fullWidth
        className="shadow-lg shadow-emerald-500/25"
        onClick={() => router.push("/workouts/new")}
      >
        + Log workout
      </Button>
    </div>
  );
}
