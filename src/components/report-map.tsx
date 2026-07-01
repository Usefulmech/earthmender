"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useReports } from "@/hooks/use-reports";
import { useUserRole } from "@/hooks/use-user-role";
import { updateReportStatus } from "@/lib/cloud-reports";
import type { ReportRecord, WasteSeverity } from "@/lib/types";
import { logisticsDirectory } from "@/lib/logistics-directory";

const ReportMapCanvas = dynamic(
  () =>
    import("@/components/report-map-canvas").then((module) => module.ReportMapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
        Loading map...
      </div>
    ),
  },
);

export type ReportGroup = {
  id: string;
  latitude: number;
  longitude: number;
  locationLabel: string;
  count: number;
  mapSeverity: WasteSeverity;
  reports: ReportRecord[];
};

export const severityColors: Record<WasteSeverity, string> = {
  critical: "#ef4444",
  high: "#f97316",
  moderate: "#eab308",
  low: "#10b981",
};

export function getSeverityByCount(count: number): WasteSeverity {
  if (count >= 4) return "critical"; // Red alert for 4+ reports
  if (count === 3) return "high";     // Orange for 3 reports
  if (count === 2) return "moderate"; // Yellow/Amber for 2 reports
  return "low";                       // Green for a single report
}

function hasCoordinates(report: ReportRecord) {
  return (
    typeof report.latitude === "number" &&
    !isNaN(report.latitude) &&
    typeof report.longitude === "number" &&
    !isNaN(report.longitude)
  );
}

function buildReportGroups(reports: ReportRecord[]): ReportGroup[] {
  const grouped = new Map<
    string,
    {
      latitudeTotal: number;
      longitudeTotal: number;
      reports: ReportRecord[];
    }
  >();

  reports.filter(hasCoordinates).forEach((report) => {
    const key = `${report.latitude?.toFixed(3)}:${report.longitude?.toFixed(3)}`;
    const current = grouped.get(key);

    if (current) {
      current.latitudeTotal += report.latitude as number;
      current.longitudeTotal += report.longitude as number;
      current.reports.push(report);
      return;
    }

    grouped.set(key, {
      latitudeTotal: report.latitude as number,
      longitudeTotal: report.longitude as number,
      reports: [report],
    });
  });

  return [...grouped.entries()].map(([key, value]) => {
    const count = value.reports.length;

    return {
      id: key,
      latitude: value.latitudeTotal / count,
      longitude: value.longitudeTotal / count,
      locationLabel: value.reports[0].locationLabel,
      count,
      mapSeverity: getSeverityByCount(count),
      reports: value.reports.sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      ),
    };
  });
}



export function ReportMap() {
  const { role } = useUserRole();
  const searchParams = useSearchParams();
  const { reports, hydrated } = useReports();
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "resolved">("all");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [showHubs, setShowHubs] = useState(false);

  const routeToDestination: [number, number] | null = useMemo(() => {
    const routeToParam = searchParams.get("routeTo");
    if (routeToParam) {
      const parts = routeToParam.split(",");
      if (parts.length === 2) {
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
          return [lat, lng];
        }
      }
    }
    return null;
  }, [searchParams]);

  const filteredReports = useMemo(() => {
    if (statusFilter === "all") {
      return reports;
    }

    if (statusFilter === "resolved") {
      return reports.filter((report) => report.status === "resolved");
    }

    return reports.filter((report) => report.status !== "resolved");
  }, [reports, statusFilter]);

  const reportGroups = useMemo(
    () => buildReportGroups(filteredReports),
    [filteredReports],
  );

  const maxGroupCount = useMemo(() => {
    return reportGroups.reduce((max, group) => Math.max(max, group.count), 0);
  }, [reportGroups]);

  const selectedGroup = useMemo(() => {
    return (
      reportGroups.find((group) => group.id === selectedGroupId) ||
      reportGroups[0] ||
      null
    );
  }, [reportGroups, selectedGroupId]);

  const selectedReport = useMemo(() => {
    if (!selectedGroup) {
      return null;
    }

    return (
      selectedGroup.reports.find((report) => report.id === selectedReportId) ||
      selectedGroup.reports[0] ||
      null
    );
  }, [selectedGroup, selectedReportId]);

  if (!hydrated) {
    return (
      <div className="surface-panel p-6 text-sm text-[var(--muted)]">
        Loading the map...
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="surface-panel p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Map</p>
            <h2 className="mt-3 font-display text-[2rem] font-bold tracking-[-0.05em] text-[var(--foreground)]">
              Live density
            </h2>
          </div>
          <span className="rounded-full bg-[var(--border-light)] px-3 py-1 text-xs text-[var(--foreground)]">
            {reportGroups.length} mapped zones
          </span>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all" as const, label: "All" },
              { id: "open" as const, label: "Open" },
              { id: "resolved" as const, label: "Resolved" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setStatusFilter(item.id);
                  setSelectedGroupId(null);
                  setSelectedReportId(null);
                }}
                className={`rounded-full px-4 py-2 text-sm transition-all duration-200 cursor-pointer ${
                  statusFilter === item.id
                    ? "bg-[var(--accent)] text-white shadow-sm"
                    : "bg-[var(--border-light)] text-[var(--foreground)] hover:bg-[var(--border)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          {role !== "operator" && (
            <button
              type="button"
              onClick={() => setShowHubs((prev) => !prev)}
              className={`w-full sm:w-auto rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer border ${
                showHubs
                  ? "border-[#15803d] bg-[#f0fdf4] text-[#166534]"
                  : "border-[var(--border)] bg-transparent text-[var(--muted)] hover:border-[#15803d] hover:text-[#15803d]"
              }`}
            >
              • Collection Points
            </button>
          )}
        </div>



        <div className="map-shell h-[28rem] overflow-hidden rounded-[1.6rem] border border-[var(--border)]">
          {reportGroups.length ? (
            <ReportMapCanvas
              groups={reportGroups}
              selectedGroupId={selectedGroup?.id || null}
              onSelectGroup={(groupId) => {
                setSelectedGroupId(groupId);
                setSelectedReportId(null);
              }}
              showHubs={showHubs}
              routeToDestination={routeToDestination}
            />
          ) : (
            <div className="flex h-full items-center justify-center px-8 text-center text-sm leading-7 text-[var(--muted)]">
              Reports will appear here as soon as they have usable coordinates.
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="surface-panel p-5 sm:p-6">
          <p className="eyebrow">Zone</p>
          {selectedGroup ? (
            <>
              <div className="mt-3 flex flex-col sm:flex-row sm:items-start gap-2">
                <h3 className="font-display text-[1.7rem] font-bold tracking-[-0.05em] text-[var(--foreground)] flex-1">
                  {selectedGroup.locationLabel}
                </h3>
                <span
                  style={{ backgroundColor: severityColors[selectedGroup.mapSeverity] }}
                  className="self-start rounded-full px-3 py-1 text-xs font-semibold text-white whitespace-nowrap"
                >
                  {selectedGroup.count} report{selectedGroup.count > 1 ? "s" : ""}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {selectedGroup.latitude.toFixed(6)}, {selectedGroup.longitude.toFixed(6)}
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              No zone selected.
            </p>
          )}
        </div>

        <div className="surface-panel p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Reports</p>
              <h3 className="mt-3 font-display text-[1.9rem] font-bold tracking-[-0.05em] text-[var(--foreground)]">
                In this zone
              </h3>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {selectedGroup?.reports.length ? (
              selectedGroup.reports.map((report) => {
                const active = report.id === selectedReport?.id;

                return (
                  <div
                    key={report.id}
                    className={`rounded-[1.4rem] border px-4 py-4 transition-all duration-200 ${
                      active
                        ? "border-[var(--accent)] bg-[var(--accent-light)] shadow-sm"
                        : "border-[var(--border)] bg-[var(--accent-surface)] hover:shadow-md"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedReportId(report.id)}
                      className="w-full text-left cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">{report.title}</p>
                          <p className="mt-1 text-sm text-[var(--muted)]">{report.status}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs text-[var(--muted)]">
                          {report.severity}
                        </span>
                      </div>
                    </button>

                    {role === "operator" && report.status !== "resolved" ? (
                      <button
                        type="button"
                        onClick={() => updateReportStatus(report.id, "resolved")}
                        className="btn-primary mt-4 w-full sm:w-auto px-4 py-2 text-sm"
                      >
                        Mark resolved
                      </button>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <p className="text-sm leading-7 text-[var(--muted)]">
                No reports in this view.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
