export type WasteSeverity = "low" | "moderate" | "high" | "critical";

export type ReportStatus = "new" | "reviewed" | "scheduled" | "resolved";

export type UserRole = "operator" | "mender";

export type DetectionBox = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type DetectionItem = {
  label: string;
  confidence: number;
  count?: number;
  bbox?: DetectionBox;
};

export type DetectorSummary = {
  dominantLabel: string | null;
  itemCount: number;
  suggestedSeverity: WasteSeverity;
  guidance: string;
};

export type DetectorResponse = {
  configured?: boolean;
  items: DetectionItem[];
  summary: DetectorSummary;
  model?: string;
};

export type DetectorStatusResponse = {
  configured: boolean;
  mode: "fastapi" | "offline";
  message: string;
};

export type ReportRecord = {
  id: string;
  menderId?: string;
  title: string;
  notes: string;
  locationLabel: string;
  latitude: number | null;
  longitude: number | null;
  severity: WasteSeverity;
  status: ReportStatus;
  imageName: string;
  createdAt: string;
  detections: DetectionItem[];
  recommendedAction: string;
  impactSignals?: string[];
};

export type UserProfile = {
  $id?: string;
  userId: string;
  role: UserRole;
  companyName?: string;
  coverageLGA?: string;
  trustScore: number;
};
