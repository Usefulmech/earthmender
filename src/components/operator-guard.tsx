"use client";

import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import React from "react";

export function OperatorGuard({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();

  // If loading or not operator, we don't enforce operator rules
  if (!profile || profile.role !== "operator") {
    return <>{children}</>;
  }

  // Check if profile is complete
  const isComplete = profile.companyName?.trim() && profile.coverageLGA?.trim();

  if (!isComplete) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in-up px-4 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600 shadow-sm border border-red-100">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-8m-6-4h.01M12 9a2 2 0 100-4 2 2 0 000 4zm3 9h-6a2 2 0 01-2-2V9a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2z" />
          </svg>
        </div>
        
        <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Profile Incomplete
        </h2>
        
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">
          As an Operator, you must provide your Company Name and Coverage Zone (LGA) before you can manage and resolve waste reports.
        </p>
        
        <Link
          href="/profile"
          className="btn-primary mt-8 inline-flex items-center gap-2 !px-8 !py-3.5 shadow-md"
        >
          <span>Complete Profile Setup</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
