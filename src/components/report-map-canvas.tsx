"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  ZoomControl,
  Polyline,
} from "react-leaflet";
import { divIcon, type LatLngExpression } from "leaflet";

import { type ReportGroup, severityColors } from "@/components/report-map";
import { logisticsDirectory } from "@/lib/logistics-directory";
import type { WasteSeverity } from "@/lib/types";

type ReportMapCanvasProps = {
  groups: ReportGroup[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
  showHubs?: boolean;
};

// --- Custom Hub Marker ---
function getHubIcon() {
  return divIcon({
    className: "",
    html: `
      <div style="
        width:24px;height:24px;border-radius:50%;
        background:#15803d; border:2px solid #fff;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 3px 8px rgba(0,0,0,0.25);
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function markerIcon(group: ReportGroup) {
  const color = severityColors[group.mapSeverity] || "#10b981";
  const size = Math.min(40, 26 + group.count * 2);
  const half = size / 2;

  // Radiating ring animation — severity determines how many rings pulse
  const rings = group.mapSeverity === "critical" ? 3 : group.mapSeverity === "high" ? 2 : 1;
  const ringHtml = Array.from({ length: rings })
    .map(
      (_, i) => `
        <div style="
          position:absolute;
          top:50%;left:50%;
          width:${size + 12 + i * 8}px;height:${size + 12 + i * 8}px;
          transform:translate(-50%,-50%);
          border-radius:50%;
          background:${color};
          opacity:${0.22 - i * 0.06};
          animation:radiating-pulse 2s ease-out ${i * 0.45}s infinite;
        "></div>`,
    )
    .join("");

  return divIcon({
    className: "",
    html: `
      <style>
        @keyframes radiating-pulse {
          0%   { transform:translate(-50%,-50%) scale(0.8); opacity:0.25; }
          70%  { opacity:0.08; }
          100% { transform:translate(-50%,-50%) scale(2); opacity:0; }
        }
      </style>
      <div style="position:relative;width:${size}px;height:${size}px;">
        ${ringHtml}
        <div style="
          position:absolute;top:50%;left:50%;
          transform:translate(-50%,-50%);
          width:${size}px;height:${size}px;border-radius:50%;
          background:${color};
          border:2.5px solid rgba(255,255,255,0.9);
          color:#fff;font-size:0.7rem;font-weight:700;line-height:1;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 4px 14px rgba(0,0,0,0.2);
        ">${group.count}</div>
      </div>`,
    iconSize: [size, size],
    iconAnchor: [half, half],
  });
}

function FocusMarker({ selected }: { selected: ReportGroup | null }) {
  const map = useMap();

  useEffect(() => {
    if (!selected) return;
    map.flyTo([selected.latitude, selected.longitude], 15, { duration: 0.8 });
  }, [map, selected]);

  return null;
}

export function ReportMapCanvas({
  groups,
  selectedGroupId,
  onSelectGroup,
  showHubs = false,
}: ReportMapCanvasProps) {
  const selected = useMemo(
    () => groups.find((g) => g.id === selectedGroupId) || groups[0] || null,
    [groups, selectedGroupId],
  );

  const [routePath, setRoutePath] = useState<[number, number][] | null>(null);
  const [routingState, setRoutingState] = useState<"idle" | "loading" | "error">("idle");
  const [routingError, setRoutingError] = useState<string | null>(null);

  const handleGetDirections = (destLat: number, destLon: number) => {
    if (!navigator.geolocation) {
      setRoutingState("error");
      setRoutingError("Geolocation is not supported by your browser.");
      return;
    }
    
    setRoutingState("loading");
    setRoutingError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        
        try {
          const res = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${userLon},${userLat};${destLon},${destLat}?overview=full&geometries=geojson`
          );
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const coordinates = data.routes[0].geometry.coordinates;
            // GeoJSON gives [lng, lat], Leaflet Polyline needs [lat, lng]
            const latLngs = coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
            setRoutePath(latLngs as [number, number][]);
            setRoutingState("idle");
          } else {
            setRoutingState("error");
            setRoutingError("Could not find a route.");
          }
        } catch (error) {
          console.error("Routing error:", error);
          setRoutingState("error");
          setRoutingError("Failed to fetch route.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setRoutingState("error");
        setRoutingError("Could not get your location.");
      }
    );
  };

  const initialCenter: LatLngExpression = selected
    ? [selected.latitude, selected.longitude]
    : [6.5244, 3.3792];

  return (
    <MapContainer
      center={initialCenter}
      zoom={13}
      zoomControl={false}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      <FocusMarker selected={selected} />
      
      {routePath && (
        <Polyline positions={routePath} color="#15803d" weight={5} opacity={0.8} />
      )}

      {groups.map((group) => (
        <Marker
          key={`${group.id}-${group.count}-${group.mapSeverity}`}
          position={[group.latitude, group.longitude]}
          icon={markerIcon(group)}
          eventHandlers={{ click: () => onSelectGroup(group.id) }}
        >
          <Popup>
            <div className="space-y-2 py-1 min-w-[140px]">
              <div>
                <p className="font-semibold">{group.locationLabel}</p>
                <p className="text-sm" style={{ color: "#666" }}>
                  {group.count} report{group.count > 1 ? "s" : ""} in zone
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGetDirections(group.latitude, group.longitude);
                }}
                className="btn-outline w-full px-3 py-1.5 text-xs rounded-full border-[var(--border)] mt-2"
                disabled={routingState === "loading"}
              >
                {routingState === "loading" ? "Routing..." : "Get Directions"}
              </button>
              {routingError && <p className="text-xs text-red-500 mt-1">{routingError}</p>}
            </div>
          </Popup>
        </Marker>
      ))}

      {showHubs &&
        logisticsDirectory
          .filter((hub) => hub.coordinates)
          .map((hub) => (
            <Marker
              key={hub.id}
              position={hub.coordinates!}
              icon={getHubIcon()}
            >
              <Popup>
                <div className="space-y-1 py-1 min-w-[140px]">
                  <p className="font-bold text-[var(--foreground)] leading-tight">{hub.companyName}</p>
                  <p className="text-xs font-medium text-[var(--accent)]">{hub.serviceType}</p>
                  <div className="mt-2 text-xs text-[var(--muted)] flex flex-wrap gap-1">
                    {hub.wasteCategories.map((cat) => (
                      <span key={cat} className="inline-block bg-[var(--border-light)] px-1.5 py-0.5 rounded-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGetDirections(hub.coordinates![0], hub.coordinates![1]);
                    }}
                    className="btn-outline w-full px-3 py-1.5 text-xs rounded-full border-[var(--border)] mt-3"
                    disabled={routingState === "loading"}
                  >
                    {routingState === "loading" ? "Routing..." : "Get Directions"}
                  </button>
                  {routingError && <p className="text-xs text-red-500 mt-1">{routingError}</p>}
                </div>
              </Popup>
            </Marker>
          ))}
    </MapContainer>
  );
}
