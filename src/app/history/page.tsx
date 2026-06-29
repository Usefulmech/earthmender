import { Suspense } from "react";
import { HistoryBoard } from "@/components/history-board";
import { OperatorGuard } from "@/components/operator-guard";

export default function HistoryPage() {
  return (
    <OperatorGuard>
      <Suspense
        fallback={
          <div className="surface-panel p-6 text-sm text-[var(--muted)]">
            Loading your report history...
          </div>
        }
      >
        <HistoryBoard />
      </Suspense>
    </OperatorGuard>
  );
}
