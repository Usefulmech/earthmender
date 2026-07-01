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
      <section className="relative overflow-hidden px-6 pt-0 pb-8 sm:px-8 sm:pt-2 sm:pb-12 flex flex-col items-center justify-start min-h-[50vh]">
        
        {/* Background Image & Gradient Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.35] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')" }} 
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[var(--background)]/20 via-[var(--background)]/50 to-[var(--background)] pointer-events-none" />
        
        <GridBackground />
        
        {/* Soft centered glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[var(--accent)] opacity-[0.08] blur-[100px] rounded-full pointer-events-none" />

        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center animate-fade-in-up z-10 w-full mt-2">
          {/* "Live network" badge — pushed flush to top */}
          <div className="eyebrow mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            Live network
          </div>

          <TypingHeading />

          <p className="mt-8 max-w-4xl text-xl leading-relaxed text-[var(--foreground)] font-medium bg-white/40 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/50 shadow-sm">
            An AI-powered community platform to report, track, and resolve environmental waste. <br className="hidden sm:block" /> Snap a photo, let our AI prioritize the cleanup, and watch your local environment mend.
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

      <section className="bg-[var(--border-light)] px-6 py-8 sm:px-8 sm:py-16 relative">
        <div className="mx-auto w-full relative z-10">
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
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>,
                title: "AI-Powered Reporting",
                body: "Simply snap a photo of a waste hotspot. Our AI instantly analyzes the image to classify the waste and assign priority, routing it to the right cleanup operators.",
                image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800",
              },
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>,
                title: "Live Action Map",
                body: "One real-time, interactive map of all reported hotspots. Track cleanup progress from initial report to final resolution, ensuring nothing is missed.",
                image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800",
              },
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
                title: "Community Momentum",
                body: "Every resolved case creates momentum. Together, citizens and operators build a cleaner, greener environment for the future.",
                image: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&q=80&w=800",
              },
            ].map((card, index) => (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-[1.5rem] surface-panel min-h-[360px] animate-fade-in-up transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-end border border-[var(--border)]"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${card.image}')` }}
                />
                
                {/* Gradient Overlay for Text Legibility */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/90 to-transparent opacity-90" />
                
                {/* Content */}
                <div className="relative z-20 p-8 flex flex-col items-start text-left mt-auto">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-lg mb-6">
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--foreground)]">
                    {card.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-[var(--muted)] font-medium">
                    {card.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
