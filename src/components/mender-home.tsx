"use client";

import { useEffect } from "react";
import Link from "next/link";

import { useReports } from "@/hooks/use-reports";
import { useAuth } from "@/components/auth-provider";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function MenderHome() {
  const { user, profile, refreshProfile } = useAuth();
  const { reports, hydrated } = useReports(user?.$id);

  useEffect(() => {
    refreshProfile().catch((err) => console.error("Failed to refresh profile:", err));
  }, [reports, refreshProfile]);

  const recentReports = reports.slice(0, 3);
  const mappedCount = reports.filter(
    (report) =>
      typeof report.latitude === "number" &&
      !isNaN(report.latitude) &&
      typeof report.longitude === "number" &&
      !isNaN(report.longitude),
  ).length;
  const openCount = reports.filter((report) => report.status !== "resolved").length;
  const resolvedCount = reports.filter(
    (report) => report.status === "resolved",
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-panel p-6 sm:p-8 animate-fade-in-up">
          <span className="eyebrow">Mender</span>
          <h1 className="mt-4 max-w-3xl font-display text-[2.7rem] leading-[0.96] tracking-[-0.06em] text-[var(--foreground)] sm:text-[4rem]">
            Report it fast.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            Add the image, place, and notes. earthmender keeps the proof and
            assigns the priority.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/report" className="btn-primary">
              Report
            </Link>
            <Link href="/map" className="btn-outline">
              Map
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Trust Score", value: profile?.trustScore ?? 50 },
            { label: "Sent", value: reports.length },
            { label: "Open", value: openCount },
            { label: "Mapped", value: mappedCount },
          ].map((item, index) => (
            <div key={item.label} className={`surface-panel p-5 animate-fade-in-up animate-delay-${(index + 1) * 100}`}>
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

      <div className="surface-panel p-5">
        <span className="eyebrow">Status</span>
        <h2 className="mt-4 font-display text-[1.8rem] tracking-[-0.05em] text-[var(--foreground)]">
          Your flow
        </h2>
        <div className="mt-5 flex gap-3">
          <div className="flex-1 rounded-[1.4rem] bg-[var(--accent-surface)] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-light)]">
              Open
            </p>
            <p className="mt-2 font-display text-4xl tracking-[-0.05em] text-[var(--foreground)]">
              {hydrated ? openCount : "..."}
            </p>
          </div>
          <div className="flex-1 rounded-[1.4rem] bg-[var(--accent-surface)] px-4 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-light)]">
              Resolved
            </p>
            <p className="mt-2 font-display text-4xl tracking-[-0.05em] text-[var(--foreground)]">
              {hydrated ? resolvedCount : "..."}
            </p>
          </div>
        </div>
      </div>

      <section className="surface-panel p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="eyebrow">Recent</span>
            <h2 className="mt-4 font-display text-[2rem] tracking-[-0.05em] text-[var(--foreground)] sm:text-[2.7rem]">
              Latest
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {hydrated && recentReports.length ? (
            recentReports.map((report) => (
              <div
                key={report.id}
                className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--accent-surface)] px-5 py-5 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs text-[var(--foreground)]">
                    {report.severity}
                  </span>
                  <span className="rounded-full bg-[var(--accent-surface)] px-3 py-1 text-xs text-[var(--muted)]">
                    {report.status}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-[var(--muted)]">
                    {formatDate(report.createdAt)}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[1.8rem] tracking-[-0.05em] text-[var(--foreground)]">
                  {report.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  {report.locationLabel}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-[var(--border)] bg-[var(--accent-surface)] px-5 py-8 text-sm leading-7 text-[var(--muted)]">
              Your reports will show here.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
