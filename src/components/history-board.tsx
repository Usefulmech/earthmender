"use client";

import { useEffect } from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useReports } from "@/hooks/use-reports";
import { useUserRole } from "@/hooks/use-user-role";
import { useAuth } from "@/components/auth-provider";
import { updateReportStatus } from "@/lib/cloud-reports";
import type { ReportStatus } from "@/lib/types";
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

const statusOptions: ReportStatus[] = [
  "new",
  "reviewed",
  "scheduled",
  "resolved",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function HistoryBoard() {
  const searchParams = useSearchParams();
  const { role } = useUserRole();
  const { user } = useAuth();
  const { reports, hydrated } = useReports(role === "mender" ? user?.$id : undefined);

  const materialFilter = searchParams.get("material");
  const filteredReports = reports.filter((report) => {
    if (!materialFilter) return true;
    if (materialFilter === "manual_review") return report.detections.length === 0;
    return report.detections.some((d) => d.label === materialFilter);
  });

  useEffect(() => {
    if (hydrated && typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.substring(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-2", "ring-[var(--accent)]", "ring-offset-4", "transition-shadow");
          setTimeout(() => {
            el.classList.remove("ring-2", "ring-[var(--accent)]", "ring-offset-4");
          }, 2000);
        }, 100);
      }
    }
  }, [hydrated]);

  if (!hydrated) {
    return (
      <div className="surface-panel p-6 text-sm text-[var(--muted)]">
        Loading your report history...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Dynamic Role-Based Header */}
      <section className="surface-panel p-6 sm:p-8 animate-fade-in-up">
        <span className="eyebrow">
          {role === "operator" ? "Operator Queue" : "History"}
        </span>
        <h1 className="mt-4 font-display text-[2.5rem] font-bold leading-[0.98] tracking-[-0.05em] text-[var(--foreground)] sm:text-[3.4rem]">
          {role === "operator" ? "Run the queue." : "Your reports."}
        </h1>
        {materialFilter && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-[var(--muted)]">Filtered by material:</span>
            <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-semibold text-[var(--accent)] capitalize">
              {materialFilter.replace(/_/g, " ")}
            </span>
            <Link href="/history" className="text-xs text-[var(--muted)] underline hover:text-[var(--foreground)] ml-2">
              Clear filter
            </Link>
          </div>
        )}
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          {role === "operator"
            ? "Review, resolve, repeat."
            : "Track your submitted reports and check their resolution status."}
        </p>
      </section>

      {searchParams.get("created") === "1" ? (
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--accent-surface)] px-5 py-4 text-sm text-[var(--muted)]">
          Your report is saved locally in this browser now. It is ready to move
          into synced storage whenever you connect Supabase.
        </div>
      ) : null}

      {filteredReports.length === 0 ? (
        <div className="surface-panel flex flex-col gap-4 p-6">
          <h2 className="font-display text-2xl tracking-[-0.04em] text-[var(--foreground)]">
            {materialFilter ? "No reports found for this material" : "No reports yet"}
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">
            {materialFilter 
              ? "There are no reports containing this specific material type. Try clearing the filter."
              : "Start with your first field capture. Once reports exist, this page becomes your running record of what was seen, how urgent it was, and whether action has already happened."}
          </p>
          <Link
            href={materialFilter ? "/history" : (role === "operator" ? "/operator" : "/report")}
            className="btn-primary w-fit"
          >
            {materialFilter ? "Clear Filter" : (role === "operator" ? "Go to operator home" : "Open report studio")}
          </Link>
        </div>
      ) : (
        filteredReports.map((report) => (
          <article
            key={report.id}
            id={report.id}
            className="surface-panel grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow">Report</span>
                <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs text-[var(--foreground)]">
                  {report.severity}
                </span>
              </div>

              {getImageUrl(report.imageName) && (
                <div className="relative w-full h-48 sm:h-56 rounded-[1.25rem] overflow-hidden border border-[var(--border)] mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(report.imageName)!}
                    alt={report.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="font-display text-[1.95rem] tracking-[-0.05em] text-[var(--foreground)]">
                  {report.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  {report.notes || "No extra notes were added to this report."}
                </p>
              </div>

              <div className="grid gap-4 text-sm text-[var(--muted)] sm:grid-cols-2">
                <div className="rounded-[1.3rem] bg-[var(--accent-surface)] px-4 py-3 flex flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-light)]">
                      Place
                    </p>
                    <p className="mt-2">{report.locationLabel}</p>
                  </div>
                  {report.latitude && report.longitude && (
                    <Link
                      href="/map"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View on Map
                    </Link>
                  )}
                </div>
                <div className="rounded-[1.3rem] bg-[var(--accent-surface)] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-light)]">
                    Logged
                  </p>
                  <p className="mt-2">{formatDate(report.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-[1.7rem] border border-[var(--border)] bg-[linear-gradient(180deg,var(--accent-surface),#f1f6ef)] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-light)]">
                    Workflow
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                    {report.status}
                  </p>
                </div>
                {role === "operator" && (
                  <select
                    value={report.status}
                    onChange={(event) =>
                      updateReportStatus(
                        report.id,
                        event.target.value as ReportStatus,
                      )
                    }
                    className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-all duration-200 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/15 cursor-pointer"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {role === "operator" && report.status !== "resolved" ? (
                <button
                  type="button"
                  onClick={() => updateReportStatus(report.id, "resolved")}
                  className="btn-primary w-fit px-4 py-2"
                >
                  Mark resolved
                </button>
              ) : null}

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-light)]">
                  Detection notes
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {report.detections.length ? (
                    report.detections.map((item) => (
                      <span
                        key={`${report.id}-${item.label}-${item.confidence}`}
                        className="rounded-full bg-white px-3 py-1.5 text-sm text-[var(--foreground)]"
                      >
                        {item.label.replace(/_/g, " ")}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-white px-3 py-1.5 text-sm text-[var(--muted)]">
                      Manual review
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-[1.3rem] bg-white/80 px-4 py-3 text-sm leading-7 text-[var(--muted)]">
                {report.recommendedAction}
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
