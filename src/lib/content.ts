import type { UserRole } from "@/lib/types";

export type NavIconName =
  | "home"
  | "report"
  | "map"
  | "insights"
  | "history"
  | "learn";

export type NavItem = {
  href: string;
  label: string;
  icon: NavIconName;
};

export const baseNavItems: NavItem[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/report", label: "Report", icon: "report" },
  { href: "/map", label: "Map", icon: "map" },
];

export const navItemsByRole: Record<UserRole, NavItem[]> = {
  mender: [
    { href: "/mender", label: "Home", icon: "home" },
    { href: "/report", label: "Report", icon: "report" },
    { href: "/history", label: "History", icon: "history" },
    { href: "/map", label: "Map", icon: "map" },
    { href: "/learn", label: "Learn", icon: "learn" },
  ],
  operator: [
    { href: "/operator", label: "Home", icon: "home" },
    { href: "/history", label: "Queue", icon: "history" },
    { href: "/map", label: "Map", icon: "map" },
    { href: "/insights", label: "Insights", icon: "insights" },
  ],
};

export const pillars = [
  {
    title: "Report With Proof",
    body: "Keep field capture simple enough for citizens to use and clear enough for operators to trust.",
  },
  {
    title: "See The Territory",
    body: "Actual coordinates and markers keep pressure visible instead of hiding it inside a list.",
  },
  {
    title: "Close The Loop",
    body: "The value is not only detecting waste. It is knowing what was seen, who acted, and what is still open.",
  },
] as const;

export const educationCards = [
  {
    material: "Plastic Bottles",
    action: "Rinse, separate, and send to recycling or deposit programs where available.",
  },
  {
    material: "Water Sachets",
    action: "Bag sachets together so they can be aggregated instead of flowing into drains.",
  },
  {
    material: "Polythene Bags",
    action: "Keep them dry and contained. Where reuse is possible, keep them out of open burning streams.",
  },
  {
    material: "Mixed Disposable Waste",
    action: "Handle mixed disposable waste carefully, and keep sharp or hazardous items isolated.",
  },
] as const;

export const quizCards = [
  {
    prompt: "Repeated reports from the same place are useful because they reveal pressure points early.",
    answer: true,
    note: "Repeated sightings help operators understand where waste keeps returning.",
  },
  {
    prompt: "If the detector is offline, a citizen should avoid reporting until AI becomes available.",
    answer: false,
    note: "earthmender is designed to keep reporting useful even when the AI layer is unavailable.",
  },
  {
    prompt: "Coordinates and a short location label make reports much easier to verify and map.",
    answer: true,
    note: "Location clarity is one of the strongest signals in the whole workflow.",
  },
] as const;
