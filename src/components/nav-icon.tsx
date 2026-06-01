import type { NavIconName } from "@/lib/content";

type NavIconProps = {
  name: NavIconName;
  className?: string;
};

export function NavIcon({ name, className = "h-5 w-5" }: NavIconProps) {
  switch (name) {
    case "report":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
          <path d="M8 4.5h8l4 4v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2Z" />
          <path d="M14 4.5v4h4" />
          <path d="M9 12h6" />
          <path d="M9 16h4" />
        </svg>
      );
    case "map":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
          <path d="m3.5 6.5 5-2 7 2 5-2v13l-5 2-7-2-5 2v-13Z" />
          <path d="M8.5 4.5v13" />
          <path d="M15.5 6.5v13" />
        </svg>
      );
    case "insights":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
          <path d="M4 19V9" />
          <path d="M10 19V5" />
          <path d="M16 19v-8" />
          <path d="M22 19v-4" />
        </svg>
      );
    case "history":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
          <path d="M12 7v5l3 2" />
          <path d="M5.5 6.5V3.5" />
          <path d="M5.5 3.5H2.5" />
          <path d="M4.5 11a8 8 0 1 1 2.3 5.7L5.5 15.5" />
        </svg>
      );
    case "learn":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
          <path d="M4 5.5a2.5 2.5 0 0 1 2.5-2.5H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
          <path d="M6.5 18A2.5 2.5 0 0 0 4 20.5" />
          <path d="M8 7h7" />
          <path d="M8 11h8" />
        </svg>
      );
    case "home":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.8">
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5.5 9.5v10.5h13V9.5" />
        </svg>
      );
  }
}
