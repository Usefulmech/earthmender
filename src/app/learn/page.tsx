import { LearnStudio } from "@/components/learn-studio";

export default function LearnPage() {
  return (
    <div className="flex flex-col gap-6">
      <section className="surface-panel p-6 sm:p-8">
        <span className="eyebrow">Learn</span>
        <h1 className="mt-4 font-display text-[2.5rem] font-bold leading-[0.98] tracking-[-0.05em] text-[var(--foreground)] sm:text-[3.4rem] animate-fade-in-up">
          Learn the basics.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          Practical only.
        </p>
      </section>

      <LearnStudio />
    </div>
  );
}
