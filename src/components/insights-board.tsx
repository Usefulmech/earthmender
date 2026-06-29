"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { useReports } from "@/hooks/use-reports";

function toTitle(value: string) {
  return value.replace(/_/g, " ");
}

export function InsightsBoard() {
  const router = useRouter();
  const { reports, hydrated } = useReports();

  const metrics = useMemo(() => {
    const statusCounts = {
      open: reports.filter((report) => report.status !== "resolved").length,
      resolved: reports.filter((report) => report.status === "resolved").length,
      critical: reports.filter((report) => report.severity === "critical").length,
      repeat: new Set(
        reports
          .map((report) => report.locationLabel.trim().toLowerCase())
          .filter(Boolean),
      ).size,
    };

    const materialCounts = reports.flatMap((report) =>
      report.detections.length
        ? report.detections.map((item) => item.label)
        : ["manual_review"],
    );

    const groupedMaterials = Object.entries(
      materialCounts.reduce<Record<string, number>>((accumulator, label) => {
        accumulator[label] = (accumulator[label] || 0) + 1;
        return accumulator;
      }, {}),
    )
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5);

    const groupedLocations = Object.entries(
      reports.reduce<Record<string, number>>((accumulator, report) => {
        const key = report.locationLabel || "Unlabelled";
        accumulator[key] = (accumulator[key] || 0) + 1;
        return accumulator;
      }, {}),
    )
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5);

    return { statusCounts, groupedMaterials, groupedLocations };
  }, [reports]);

  if (!hydrated) {
    return (
      <div className="surface-panel p-6 text-sm text-[var(--muted)]">
        Loading your insights...
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Reports logged",
            value: reports.length,
          },
          {
            label: "Open pressure",
            value: metrics.statusCounts.open,
          },
          {
            label: "Resolved",
            value: metrics.statusCounts.resolved,
          },
          {
            label: "Critical cases",
            value: metrics.statusCounts.critical,
          },
        ].map((item) => (
          <div key={item.label} className="surface-panel p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-light)]">
              {item.label}
            </p>
            <p className="mt-3 font-display text-4xl tracking-[-0.05em] text-[var(--foreground)]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="surface-panel p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Material Pressure</p>
              <h2 className="mt-2 font-display text-3xl tracking-[-0.05em] text-[var(--foreground)]">
                What keeps showing up
              </h2>
            </div>
            <span className="shrink-0 mt-1 rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs text-[var(--foreground)]">
              Top labels
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {metrics.groupedMaterials.length ? (
              metrics.groupedMaterials.map(([label, count], idx) => {
                const width = Math.max(
                  15,
                  (count / metrics.groupedMaterials[0][1]) * 100,
                );

                // Use slightly different colors based on rank
                const fillColors = idx === 0 
                  ? "from-[#fca5a5]/30 to-[#fef2f2]" // red-ish for top
                  : idx === 1 
                  ? "from-[#fcd34d]/30 to-[#fffbeb]" // yellow-ish for second
                  : "from-[var(--accent-light)] to-[#f4f6f0]"; // green/earth for rest

                const iconColors = idx === 0 ? "text-red-600 bg-red-50 border-red-100" 
                  : idx === 1 ? "text-amber-600 bg-amber-50 border-amber-100" 
                  : "text-[var(--accent)] bg-[var(--accent-light)] border-[var(--border-light)]";

                return (
                  <div 
                    key={label} 
                    onClick={() => router.push(`/history?material=${label}`)}
                    className="relative overflow-hidden rounded-[1rem] border border-[var(--border)] bg-white p-3 sm:p-4 shadow-sm transition-transform hover:scale-[1.01] hover:shadow-md cursor-pointer"
                  >
                    {/* Background fill representing intensity */}
                    <div 
                      className={`absolute left-0 top-0 bottom-0 z-0 bg-gradient-to-r ${fillColors}`} 
                      style={{ width: `${width}%` }} 
                    />
                    
                    {/* Content on top of fill */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-sm ${iconColors}`}>
                          <span className="text-sm font-bold uppercase">{label.charAt(0)}</span>
                        </div>
                        <span className="font-semibold text-[var(--foreground)] tracking-tight">{toTitle(label)}</span>
                      </div>
                      <div className="flex flex-col items-end sm:flex-row sm:items-center sm:gap-2">
                         <span className="font-display text-xl font-bold tracking-tight text-[var(--foreground)]">{count}</span>
                         <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">Reports</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm leading-7 text-[var(--muted)]">
                Once reports are captured, EarthMender will show the materials
                that keep resurfacing most often.
              </p>
            )}
          </div>
        </div>

        <div className="surface-panel p-5 sm:p-6">
          <div>
            <p className="eyebrow">Repeat Zones</p>
            <h2 className="mt-2 font-display text-3xl tracking-[-0.05em] text-[var(--foreground)]">
              Locations worth revisiting
            </h2>
          </div>

          <div className="mt-6 space-y-3">
            {metrics.groupedLocations.length ? (
              metrics.groupedLocations.map(([location, count], index) => (
                <div
                  key={location}
                  className="flex items-center justify-between rounded-[1.4rem] bg-[var(--accent-surface)] px-4 py-4 text-sm text-[var(--muted)] transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--border)] text-xs font-semibold text-[var(--foreground)]">
                      0{index + 1}
                    </span>
                    <span>{location}</span>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-[var(--muted)]">
                    {count} report{count > 1 ? "s" : ""}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-[var(--muted)]">
                The territory list fills up as soon as your first reports start
                accumulating.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
