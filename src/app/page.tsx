import Link from "next/link";
import { Logo } from "@/components/logo";
import { TypingHeading } from "@/components/typing-heading";

function GridBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40V0H40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen text-[var(--foreground)] selection:bg-[var(--foreground)] selection:text-white">
      <section className="relative overflow-hidden px-6 pt-0 pb-12 sm:px-8 sm:pt-2 sm:pb-16 flex flex-col items-center justify-start min-h-[50vh]">
        <GridBackground />
        
        {/* Soft centered glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[var(--accent)] opacity-[0.04] blur-[100px] rounded-full pointer-events-none" />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center animate-fade-in-up z-10 w-full mt-2">
          {/* "Live network" badge — pushed flush to top */}
          <div className="eyebrow mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            Live network
          </div>

          <TypingHeading />

          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-[var(--muted)]">
            A vibrant, community-powered platform where every voice matters and every hand helps mend our planet. No noise, just clean action.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/report"
              className="btn-primary w-full sm:w-auto px-8 py-4 text-base"
            >
              Report Now
            </Link>
            <Link
              href="/map"
              className="btn-outline w-full sm:w-auto px-8 py-4 text-base"
            >
              The Map
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[var(--border-light)] px-6 py-12 sm:px-8 sm:py-20 relative">
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Built for precision
            </h2>
            <p className="mt-6 text-lg text-[var(--muted)]">
              Inclusion isn't just a feature. It's our foundation. We believe a cleaner world starts with a clear, connected community.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                title: "Diverse Voices",
                body: "Designed to feel calm, readable, and approachable, so anyone can report and follow progress.",
              },
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>,
                title: "Shared Purpose",
                body: "One queue, one map, one shared view of what needs action, so teams can move together.",
              },
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
                title: "Vibrant Future",
                body: "Every report becomes memory. Every resolved case becomes momentum for the next clean day.",
              },
            ].map((card, index) => (
              <div
                key={card.title}
                className="surface-panel p-8 animate-fade-in-up hover:-translate-y-1 transition-transform"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--foreground)] text-white shadow-lg">
                  {card.icon}
                </div>
                <h3 className="mt-8 text-xl font-bold">
                  {card.title}
                </h3>
                <p className="mt-4 leading-relaxed text-[var(--muted)]">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
