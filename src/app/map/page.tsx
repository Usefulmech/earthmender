import { Suspense } from "react";
import { ReportMap } from "@/components/report-map";

export default function MapPage() {
  return (
    <div className="flex flex-col gap-6">
      <section className="surface-panel p-6 sm:p-8">
        <span className="eyebrow">Live Map</span>
        <h1 className="mt-4 font-display text-[2.5rem] font-bold leading-[0.98] tracking-[-0.05em] text-[var(--foreground)] sm:text-[3.4rem] animate-fade-in-up">
          See it on the map.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          Real coordinates. Real density.
        </p>
      </section>

      <Suspense fallback={<div className="surface-panel p-6 text-sm text-[var(--muted)]">Loading map...</div>}>
        <ReportMap />
      </Suspense>
    </div>
  );
}
