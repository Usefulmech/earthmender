import { Suspense } from "react";

import { HistoryBoard } from "@/components/history-board";

export default function HistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="surface-panel p-6 text-sm text-[var(--muted)]">
          Loading your report history...
        </div>
      }
    >
      <HistoryBoard />
    </Suspense>
  );
}
