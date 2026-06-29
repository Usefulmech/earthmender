import { Logo } from "@/components/logo";

export function BrandMark() {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Logo className="h-7 w-7 sm:h-9 sm:w-9 shrink-0" />
      <div className="flex flex-col">
        <span className="font-display text-[1.1rem] sm:text-[1.35rem] font-black tracking-tight leading-none">
          <span className="text-[var(--foreground)]">earth</span>
          <span className="text-[var(--accent)]">mender</span>
        </span>
        <span className="mt-[3px] text-[0.55rem] sm:text-[0.62rem] font-semibold uppercase tracking-widest text-[var(--muted)]">
          Community Powered Cleanup
        </span>
      </div>
    </div>
  );
}
