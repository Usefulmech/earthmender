/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useUserRole } from "@/hooks/use-user-role";
import { useAuth } from "@/components/auth-provider";
import { createReport } from "@/lib/cloud-reports";
import type {
  DetectorResponse,
  DetectorStatusResponse,
  WasteSeverity,
} from "@/lib/types";

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], file.name, { type: "image/jpeg" }));
        } else {
          resolve(file);
        }
      }, "image/jpeg", 0.7);
    };
    img.onerror = () => resolve(file);
    img.src = url;
  });
}

type ImpactSignal = {
  id: string;
  label: string;
  weight: number;
};

const impactSignals: ImpactSignal[] = [
  {
    id: "blocked_drain",
    label: "Blocking drain or runoff",
    weight: 2,
  },
  {
    id: "bin_pickup_needed",
    label: "Waste bin is full, pickup needed",
    weight: 1,
  },
  {
    id: "busy_public_area",
    label: "Near homes, market, school, or bus stop",
    weight: 1,
  },
  {
    id: "hazardous_material",
    label: "Sharp, burning, medical, or hazardous waste",
    weight: 3,
  },
  {
    id: "large_visible_pile",
    label: "Large visible pile or repeated dumping",
    weight: 2,
  },
] as const;

function prettySeverity(value: WasteSeverity) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function severityRank(value: WasteSeverity) {
  switch (value) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "moderate":
      return 2;
    default:
      return 1;
  }
}

function maxSeverity(left: WasteSeverity, right: WasteSeverity): WasteSeverity {
  return severityRank(left) >= severityRank(right) ? left : right;
}

function severityFromSignals(selectedSignalIds: string[]): WasteSeverity {
  if (selectedSignalIds.includes("bin_pickup_needed")) {
    return "high";
  }

  const score = impactSignals
    .filter((signal) => selectedSignalIds.includes(signal.id))
    .reduce((total, signal) => total + signal.weight, 0);

  if (score >= 5) {
    return "high";
  }

  if (score >= 2) {
    return "moderate";
  }

  return "low";
}

function buildGuidanceText(response: DetectorResponse | null) {
  if (!response || !response.summary.guidance) {
    return "Provide one or two details including landmarks or obstacles.";
  }

  return response.summary.guidance;
}

function titleFromSeverity(value: WasteSeverity) {
  switch (value) {
    case "critical":
      return "Needs urgent attention";
    case "high":
      return "High priority";
    case "moderate":
      return "Medium priority";
    default:
      return "Low priority";
  }
}

function helperFromSeverity(value: WasteSeverity) {
  switch (value) {
    case "critical":
      return "This looks risky or time-sensitive. Add a landmark description and a clear photo.";
    case "high":
      return "This could spread or cause issues. Quick details help operators handle it.";
    case "moderate":
      return "This should be handled soon. Selected tags route it to the right team.";
    default:
      return "This will be scheduled, though it does not seem urgent currently.";
  }
}

export function ReportStudio() {
  const router = useRouter();
  const { role } = useUserRole();
  const { user } = useAuth();

  // Inline camera states
  const [showCameraFeed, setShowCameraFeed] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [detectorStatus, setDetectorStatus] =
    useState<DetectorStatusResponse | null>(null);
  const [detectorResult, setDetectorResult] = useState<DetectorResponse | null>(
    null,
  );
  const [detecting, setDetecting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [showFormManual, setShowFormManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Stop camera tracks on unmount or state change
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const startCamera = async (mode: "user" | "environment" = "environment") => {
    setCameraError(null);
    setShowCameraFeed(true);

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.error("Video play failed:", e));
      }
    } catch (err: any) {
      console.error("Camera access failed, falling back to input capture:", err);
      setCameraError("Could not access camera. Falling back to default camera app.");
      setTimeout(() => {
        cameraInputRef.current?.click();
        setShowCameraFeed(false);
      }, 1500);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCameraFeed(false);
    setCameraError(null);
  };

  const switchCamera = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        if (blob) {
          let capturedFile = new File([blob], `camera-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          capturedFile = await compressImage(capturedFile);
          setFile(capturedFile);

          if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
            setCameraStream(null);
          }
          setShowCameraFeed(false);
        }
      }, "image/jpeg", 0.85);
    }
  };



  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/detect", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as DetectorStatusResponse;
        setDetectorStatus(payload);
      })
      .catch(() => {
        setDetectorStatus({
          configured: false,
          mode: "offline",
          message: "Detector service is not connected yet.",
        });
      });
  }, []);

  const fetchLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setMessage("This device does not support browser geolocation.");
      return;
    }

    setLocating(true);
    setGpsAccuracy(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const nextLatitude = position.coords.latitude.toFixed(6);
        const nextLongitude = position.coords.longitude.toFixed(6);
        const accuracy = Math.round(position.coords.accuracy);

        setLatitude(nextLatitude);
        setLongitude(nextLongitude);
        setGpsAccuracy(accuracy);

        let addressLabel = `GPS Geolocated Spot (within ${accuracy}m)`;

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${nextLatitude}&lon=${nextLongitude}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.display_name) {
              // Limit to first 3 parts of the address for readability
              const parts = data.display_name.split(", ");
              addressLabel = parts.slice(0, 3).join(", ");
            }
          }
        } catch (err) {
          console.error("Reverse geocoding failed", err);
        }

        setLocationLabel((current) => {
          if (
            !current ||
            current === "Current device location" ||
            current.startsWith("GPS Geolocated Spot")
          ) {
            return addressLabel;
          }
          return current;
        });
        setLocating(false);
      },
      (error) => {
        const nextMessage =
          error.code === error.PERMISSION_DENIED
            ? "Location access denied. Enable GPS permissions for precise reporting."
            : "Unable to retrieve precise coordinates. Please verify your GPS signal.";
        setMessage(nextMessage);
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  async function runDetectionForFile(fileObj: File) {
    setDetecting(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", fileObj);

    try {
      const response = await fetch("/api/detect", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as DetectorResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          payload.error ||
          "The detector could not complete this scan right now.",
        );
      }

      setDetectorResult(payload);
      setMessage("AI scan completed. Priority was updated using the detector.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Detector service is unavailable right now.",
      );
    } finally {
      setDetecting(false);
    }
  }

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      setDetectorResult(null);
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl(nextUrl);

    runDetectionForFile(file);
    fetchLocation();

    return () => {
      URL.revokeObjectURL(nextUrl);
    };
  }, [file]);

  const signalSeverity = useMemo(
    () => severityFromSignals(selectedSignals),
    [selectedSignals],
  );

  const assignedSeverity = useMemo(() => {
    if (!detectorResult) {
      return signalSeverity;
    }

    return maxSeverity(
      signalSeverity,
      detectorResult.summary.suggestedSeverity,
    );
  }, [detectorResult, signalSeverity]);

  const activeImpactLabels = useMemo(() => {
    if (!selectedSignals.length) {
      return [];
    }

    const labelById = new Map(
      impactSignals.map((signal) => [signal.id, signal.label]),
    );
    return selectedSignals.map((id) => labelById.get(id) || id);
  }, [selectedSignals]);

  function toggleSignal(signalId: string) {
    setSelectedSignals((current) =>
      current.includes(signalId)
        ? current.filter((item) => item !== signalId)
        : [...current, signalId],
    );
  }

  function prettyLabel(label: string) {
    return label
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);

    const finalTitle = title.trim()
      ? title.trim()
      : detectorResult?.summary.dominantLabel
        ? `${prettyLabel(detectorResult.summary.dominantLabel)} Sighting`
        : "Waste Sighting";

    const finalLocationLabel = locationLabel.trim()
      ? locationLabel.trim()
      : latitude && longitude
        ? `GPS Geolocated Spot (within ${gpsAccuracy ? gpsAccuracy + "m" : "15m"})`
        : "Standard Area";

    const result = await createReport({
      id: crypto.randomUUID(),
      title: finalTitle,
      notes,
      locationLabel: finalLocationLabel,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      severity: assignedSeverity,
      status: "new",
      imageName: file?.name || "direct-entry",
      createdAt: new Date().toISOString(),
      detections: detectorResult?.items || [],
      recommendedAction: buildGuidanceText(detectorResult),
      impactSignals: selectedSignals,
      menderId: user?.$id || "",
    }, file);

    if (result) {
      router.push(role === "operator" ? "/history?created=1" : "/mender");
    } else {
      setMessage("Failed to save report to the cloud database.");
      setSaving(false);
    }
  }

  const inputClasses =
    "rounded-[1.25rem] border border-[var(--border)] bg-[var(--accent-surface)] px-4 py-3 outline-none transition-all duration-200 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/15";

  if (showCameraFeed) {
    return (
      <div className="max-w-2xl mx-auto w-full animate-fade-in">
        <div className="text-center mb-6">
          <span className="eyebrow">Viewfinder</span>
          <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--foreground)] mt-2">
            Align the target area
          </h2>
        </div>

        <div className="surface-panel overflow-hidden relative aspect-[4/3] bg-black rounded-[1.6rem] border border-[var(--border)] shadow-xl flex flex-col justify-between">
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          {!cameraStream && !cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white z-10">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-white border-t-transparent mb-2"></div>
              <span className="text-sm font-semibold">Starting camera...</span>
            </div>
          )}

          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-6 text-center z-10">
              <svg className="h-10 w-10 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-semibold">{cameraError}</p>
            </div>
          )}

          <div className="relative z-10 p-4 flex justify-end">
            <button
              type="button"
              onClick={stopCamera}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative z-10 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between gap-4">
            <div className="w-12 h-12" />

            <button
              type="button"
              onClick={capturePhoto}
              disabled={!cameraStream}
              className="h-16 w-16 rounded-full bg-white border-4 border-gray-300 active:scale-95 transition-transform shadow-lg flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              <div className="h-12 w-12 rounded-full bg-[var(--accent)] active:bg-[var(--accent-hover)]" />
            </button>

            <button
              type="button"
              onClick={switchCamera}
              disabled={!cameraStream}
              className="h-12 w-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const compressed = await compressImage(selectedFile);
      setFile(compressed);
    }
  };

  return (
    <div className="w-full">
      {/* Unified inputs mounted exactly once, visually hidden but natively layout-rendered */}
      <input
        ref={cameraInputRef}
        id="camera-capture-input"
        type="file"
        accept="image/*"
        capture="environment"
        className="absolute opacity-0 pointer-events-none w-px h-px overflow-hidden"
        onChange={handleFileSelect}
      />
      <input
        ref={fileInputRef}
        id="file-choose-input"
        type="file"
        accept="image/*"
        className="absolute opacity-0 pointer-events-none w-px h-px overflow-hidden"
        onChange={handleFileSelect}
      />

      {!file && !showFormManual ? (
        <div className="max-w-2xl mx-auto w-full animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="flex justify-center gap-3 items-center mb-4">
              <span className="eyebrow">Citizen Reporter</span>
              <span
                className={`rounded-full px-3 py-1 text-xs transition-colors ${detectorStatus?.configured
                  ? "bg-[var(--accent-light)] text-[var(--foreground)]"
                  : "bg-[#f3ece2] text-[#8c5e2d]"
                  }`}
              >
                {detectorStatus?.configured
                  ? "AI Detector connected"
                  : "Standard reporting"}
              </span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-[-0.04em] text-[var(--foreground)]">
              Report what you see in one clean pass.
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)] sm:text-base max-w-lg mx-auto">
              Take a photo of the waste hotspot. The AI will automatically analyze
              it, set the priority, and log the precise coordinates.
            </p>
          </div>

          <div className="surface-panel flex flex-col items-center justify-center p-8 sm:p-12 text-center border-dashed border-2 border-[var(--border)] bg-[var(--accent-surface)] rounded-[1.6rem] transition-all duration-300 hover:border-[var(--accent)]/50">
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent-light)] text-[var(--accent)]">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)]/10 opacity-75"></span>
              <svg
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>

            <h3 className="font-display text-2xl font-bold text-[var(--foreground)] tracking-[-0.03em]">
              Add photo to begin
            </h3>
            <p className="mt-2 max-w-sm text-sm text-[var(--muted)] leading-relaxed">
              Snap a new photo or select one from your library to start the report.
            </p>


          </div>

          <div className="mt-6 flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => startCamera("environment")}
              className="btn-primary flex items-center justify-center gap-2 px-6 py-3.5 rounded-full cursor-pointer"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Open Camera
            </button>
            <label
              htmlFor="file-choose-input"
              className="btn-outline flex items-center justify-center gap-2 px-6 py-3.5 rounded-full cursor-pointer"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Choose Photo
            </label>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowFormManual(true);
              fetchLocation();
            }}
            className="btn-outline mt-8 w-full sm:w-auto mx-auto !py-3 !px-6 text-sm flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-[var(--accent-surface)] hover:text-[var(--foreground)]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Report manually without photo
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleSubmit}
            className="surface-panel flex flex-col gap-5 p-5 sm:p-7"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow">Citizen Report</span>
              <span
                className={`rounded-full px-3 py-1 text-xs transition-colors ${detectorStatus?.configured
                  ? "bg-[var(--accent-light)] text-[var(--foreground)]"
                  : "bg-[#f3ece2] text-[#8c5e2d]"
                  }`}
              >
                {detectorStatus?.configured
                  ? "AI Detector connected"
                  : "Standard reporting"}
              </span>
            </div>

            <div>
              <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--foreground)]">
                Report what you see in one clean pass.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Select standard tags below to route the report quickly. Priority is
                set using tags plus the AI scan.
              </p>
            </div>

            {/* Form Image Preview Block (Camera-First placement) */}
            {file && (
              <div className="relative rounded-[1.25rem] border border-[var(--border)] bg-[var(--accent-surface)] overflow-hidden">
                <div className="relative h-60 w-full overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Sighted waste"
                    className="h-full w-full object-cover"
                  />
                  {detecting && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px] text-white">
                      <div className="h-7 w-7 animate-spin rounded-full border-3 border-white border-t-transparent mb-2"></div>
                      <span className="text-xs font-semibold tracking-wide">
                        Scanning image...
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3 border-t border-[var(--border)] flex justify-between items-center bg-white">
                  <span className="text-xs text-[var(--muted)] font-medium truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startCamera("environment")}
                      className="text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors px-2 py-1 cursor-pointer bg-transparent border-none"
                    >
                      Retake
                    </button>
                    <label
                      htmlFor="file-choose-input"
                      className="text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors px-2 py-1 cursor-pointer"
                    >
                      Change Photo
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* GPS Accuracy Status Banner */}
            <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--accent-surface)] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-[var(--muted)] font-semibold">
                  Location Coordinates
                </span>
                <span className="text-sm font-mono text-[var(--foreground)]">
                  {latitude && longitude
                    ? `${latitude}, ${longitude}`
                    : "Acquiring precise location..."}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {locating ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[var(--accent-light)] text-[var(--foreground)] font-medium">
                    <svg
                      className="animate-spin h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Precise GPS search...
                  </span>
                ) : gpsAccuracy !== null ? (
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${gpsAccuracy <= 15
                      ? "bg-[#ecfdf5] text-[#047857]"
                      : gpsAccuracy <= 100
                        ? "bg-[#fffbeb] text-[#d97706]"
                        : "bg-[#fef2f2] text-[#b91c1c]"
                      }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${gpsAccuracy <= 15
                        ? "bg-[#10b981]"
                        : gpsAccuracy <= 100
                          ? "bg-[#f59e0b]"
                          : "bg-[#ef4444]"
                        }`}
                    />
                    {gpsAccuracy <= 15
                      ? `GPS Accurate (within ${gpsAccuracy}m)`
                      : gpsAccuracy <= 100
                        ? `GPS Coarse (within ${gpsAccuracy}m)`
                        : `Weak GPS (within ${gpsAccuracy}m)`}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-[var(--border-light)] text-[var(--muted)] font-medium">
                    Location offline
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => fetchLocation()}
                  disabled={locating}
                  className="text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors underline cursor-pointer disabled:opacity-50"
                >
                  Refresh
                </button>
              </div>
            </div>

            {!file && (
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => startCamera("environment")}
                  className="btn-outline flex items-center justify-center gap-2 px-4 py-2.5 text-xs rounded-full cursor-pointer animate-fade-in-up"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Add Camera Photo
                </button>
                <label
                  htmlFor="file-choose-input"
                  className="btn-outline flex items-center justify-center gap-2 px-4 py-2.5 text-xs rounded-full cursor-pointer animate-fade-in-up"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Choose Photo File
                </label>
              </div>
            )}

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-[var(--foreground)]">
                Report title{" "}
                <span className="text-xs font-normal text-[var(--muted)]">
                  (optional, auto-generated)
                </span>
              </span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={
                  detectorResult?.summary.dominantLabel
                    ? `${prettyLabel(detectorResult.summary.dominantLabel)} Sighting (AI suggested)`
                    : "e.g. Waste pile blocking market drainage"
                }
                className={inputClasses}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-[var(--foreground)]">
                Location landmarks{" "}
                <span className="text-xs font-normal text-[var(--muted)]">
                  (optional)
                </span>
              </span>
              <input
                value={locationLabel}
                onChange={(event) => setLocationLabel(event.target.value)}
                placeholder="e.g. Near the market entrance"
                className={inputClasses}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[var(--foreground)]">
                  Latitude
                </span>
                <input
                  value={latitude}
                  onChange={(event) => setLatitude(event.target.value)}
                  placeholder="6.5244"
                  className={inputClasses}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[var(--foreground)]">
                  Longitude
                </span>
                <input
                  value={longitude}
                  onChange={(event) => setLongitude(event.target.value)}
                  placeholder="3.3792"
                  className={inputClasses}
                />
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-[var(--foreground)]">
                Description notes
              </span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Enter any additional details about the sighted waste..."
                rows={4}
                className={inputClasses}
              />
            </label>

            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    Impact tags
                  </span>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                    Select matching cues to route this report quickly.
                  </p>
                </div>
                <span className="rounded-full border border-[var(--border)] bg-[var(--accent-surface)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  {prettySeverity(assignedSeverity)}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {impactSignals.map((signal) => {
                  const active = selectedSignals.includes(signal.id);

                  return (
                    <button
                      key={signal.id}
                      type="button"
                      onClick={() => toggleSignal(signal.id)}
                      className={`rounded-full border px-4 py-2 text-sm transition-all duration-200 cursor-pointer ${active
                        ? "border-[var(--foreground)] bg-[var(--foreground)] text-white shadow-sm"
                        : "border-[var(--border)] bg-white text-[var(--muted)] hover:border-[var(--accent)]/50"
                        }`}
                    >
                      {signal.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button
                type="submit"
                disabled={saving || detecting}
                className="btn-primary w-full text-center"
              >
                {saving
                  ? "Saving report..."
                  : detecting
                    ? "Scanning image..."
                    : "Submit report"}
              </button>
            </div>

            {message ? (
              <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--accent-surface)] px-4 py-3 text-sm text-[var(--muted)]">
                {message}
              </div>
            ) : null}
          </form>

          <div className="flex flex-col gap-5">
            <div className="surface-panel p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Priority Level</p>
                  <h3 className="mt-2 font-display text-2xl tracking-[-0.04em] text-[var(--foreground)]">
                    {titleFromSeverity(assignedSeverity)}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--muted)]">
                    {helperFromSeverity(assignedSeverity)}
                  </p>
                </div>
                <span className="rounded-full border border-[var(--border)] bg-[var(--accent-surface)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  {prettySeverity(assignedSeverity)}
                </span>
              </div>

              <div className="mt-5 grid gap-4">
                {file && (
                  <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--accent-surface)] px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-light)]">
                      AI Detection Results
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(detectorResult?.items.length
                        ? detectorResult.items
                        : [{ label: "manual_review", confidence: 1 }]
                      ).map((item) => (
                        <span
                          key={`${item.label}-${item.confidence}`}
                          className="rounded-full bg-white px-3 py-1.5 text-sm text-[var(--foreground)] border border-[var(--border)]"
                        >
                          {(() => {
                            try {
                              const parsed = JSON.parse(item.label.replace(/'/g, '"'));
                              const labelName = parsed.name || parsed.class || item.label;
                              return labelName.replace(/_/g, " ");
                            } catch (e) {
                              return item.label.replace(/_/g, " ");
                            }
                          })()}
                          {item.label === "manual_review" || (item as any).label === '{"manual_review"}'
                            ? ""
                            : ` · ${Math.round(item.confidence * 100)}%`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--accent-surface)] px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-light)]">
                    Selected Tags
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeImpactLabels.length ? (
                      activeImpactLabels.map((label) => (
                        <span
                          key={label}
                          className="rounded-full bg-[var(--accent-light)] px-3 py-1.5 text-sm text-[var(--foreground)]"
                        >
                          {label}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full bg-white px-3 py-1.5 text-sm text-[var(--muted)]">
                        Select impact tags above
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
