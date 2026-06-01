import { InsightsBoard } from "@/components/insights-board";

export default function InsightsPage() {
  return (
    <div className="flex flex-col gap-6">
      <section className="surface-panel p-6 sm:p-8">
        <span className="eyebrow">Operations View</span>
        <h1 className="mt-4 font-display text-[2.5rem] font-bold leading-[0.98] tracking-[-0.05em] text-[var(--foreground)] sm:text-[3.4rem] animate-fade-in-up">
          Read the pattern.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          Open issues, hot zones, repeat waste.
        </p>
      </section>

      <InsightsBoard />
    </div>
  );
}
