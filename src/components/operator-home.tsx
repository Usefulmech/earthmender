"use client";

import Link from "next/link";

import { useReports } from "@/hooks/use-reports";
import { storage } from "@/lib/appwrite";

const getImageUrl = (imageName: string) => {
  if (!imageName || imageName === "direct-entry") return null;
  try {
    return storage.getFileView("reports-images", imageName).toString();
  } catch (error) {
    console.error("Failed to get image preview URL:", error);
    return null;
  }
};

export function OperatorHome() {
  const { reports, hydrated } = useReports();

  const openReports = reports.filter((report) => report.status !== "resolved");
  const resolvedReports = reports.filter(
    (report) => report.status === "resolved",
  );
  const hotspotCount = Object.values(
    reports.reduce<Record<string, number>>((accumulator, report) => {
      const key = report.locationLabel || "Unknown";
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {}),
  ).filter((count) => count >= 2).length;

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-panel p-6 sm:p-8 animate-fade-in-up">
          <span className="eyebrow">Operator</span>
          <h1 className="mt-4 max-w-3xl font-display text-[2.7rem] leading-[0.96] tracking-[-0.06em] text-[var(--foreground)] sm:text-[4rem]">
            Run the queue.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            Review reports, watch hot zones, and close cases fast.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/history" className="btn-primary">
              Open Queue
            </Link>
            <Link href="/insights" className="btn-outline">
              Insights
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Open", value: openReports.length, span: false },
            { label: "Resolved", value: resolvedReports.length, span: false },
            { label: "Hot zones", value: hotspotCount, span: true },
          ].map((item, index) => (
            <div key={item.label} className={`surface-panel p-5 animate-fade-in-up animate-delay-${(index + 1) * 100} ${item.span ? 'col-span-2' : ''}`}>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-light)]">
                {item.label}
              </p>
              <p className="mt-3 font-display text-5xl tracking-[-0.06em] text-[var(--foreground)]">
                {hydrated ? item.value : "..."}
              </p>
            </div>
          ))}
        </div>
      </section>



      <section className="surface-panel p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="eyebrow">Queue</span>
            <h2 className="mt-4 font-display text-[2rem] tracking-[-0.05em] text-[var(--foreground)] sm:text-[2.7rem]">
              Needs action
            </h2>
          </div>
          <Link
            href="/map"
            className="hidden sm:inline-flex btn-outline rounded-full px-4 py-2 text-sm"
          >
            Map
          </Link>
        </div>

        <div className="mt-6 grid gap-4">
          {hydrated && openReports.length ? (
            openReports.slice(0, 4).map((report) => (
              <div
                key={report.id}
                className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--accent-surface)] p-5 transition-all duration-200 hover:shadow-md flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
              >
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs text-[var(--foreground)]">
                      {report.status}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs text-[var(--muted)]">
                      {report.severity}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-[1.8rem] tracking-[-0.05em] text-[var(--foreground)]">
                    {report.title}
                  </h3>
                  <p className="text-sm leading-7 text-[var(--muted)]">
                    {report.locationLabel}
                  </p>
                  {report.latitude && report.longitude && (
                    <Link
                      href="/map"
                      className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View on Map
                    </Link>
                  )}
                </div>
                {getImageUrl(report.imageName) && (
                  <div className="relative w-full md:w-32 h-32 md:h-24 rounded-[1rem] overflow-hidden border border-[var(--border)] shrink-0 self-stretch md:self-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(report.imageName)!}
                      alt={report.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-[var(--border)] bg-[var(--accent-surface)] px-5 py-8 text-sm leading-7 text-[var(--muted)]">
              New reports will show here.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
