"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { authService } from "@/lib/auth-service";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  
  const [companyName, setCompanyName] = useState("");
  const [coverageLGA, setCoverageLGA] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!user) {
      // Not logged in
      router.push("/");
    } else if (profile) {
      setCompanyName(profile.companyName || "");
      setCoverageLGA(profile.coverageLGA || "");
      setName(profile.name || "");
      setPhoneNumber(profile.phoneNumber || "");
      setAddress(profile.address || "");
    }
  }, [user, profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.$id) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      await authService.updateProfile(profile.$id, {
        companyName,
        coverageLGA,
        name,
        phoneNumber,
        address,
      });
      await refreshProfile();
      setMessage({ type: "success", text: "Profile updated successfully." });
      
      // If operator and they just filled it out, redirect them back to operator dashboard
      if (profile.role === "operator" && companyName.trim() !== "" && coverageLGA.trim() !== "") {
        setTimeout(() => {
           router.push("/operator");
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-[var(--muted)] animate-pulse">Loading profile...</p>
      </div>
    );
  }

  const isOperator = profile.role === "operator";
  const isComplete = isOperator ? (companyName.trim() !== "" && coverageLGA.trim() !== "") : true;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 animate-fade-in-up">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)]">
            Your Profile
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Manage your account settings and preferences.
          </p>
        </div>
        {isComplete && (
          <button 
            onClick={() => router.push(isOperator ? "/operator" : "/mender")}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--background)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border-light)] transition-colors"
            title="Close Profile"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="surface-panel p-6 sm:p-8">
        {isOperator && !isComplete && (
           <div className="mb-6 rounded-[1rem] bg-amber-50 border border-amber-200 p-4">
             <div className="flex items-start gap-3">
               <svg className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
               <div>
                 <h3 className="font-semibold text-amber-800">Action Required</h3>
                 <p className="mt-1 text-sm text-amber-700">
                   As an Operator, you must provide your Company Name and Coverage Zone (LGA) before you can manage and resolve waste reports in the queue.
                 </p>
               </div>
             </div>
           </div>
        )}

        <div className="mb-8 flex items-center gap-4 border-b border-[var(--border)] pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-light)] text-2xl font-bold text-[var(--accent)] uppercase shadow-sm">
            {profile.role.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
               <span className="font-medium text-[var(--foreground)] capitalize">{profile.role} Account</span>
               <span className="rounded-full bg-[var(--background)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted)] border border-[var(--border)]">
                 Trust Score: {profile.trustScore}
               </span>
            </div>
            <p className="text-sm text-[var(--muted)]">User ID: {profile.userId}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isOperator ? (
            <>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--foreground)] transition-colors"
                  placeholder="e.g. EarthKeepers Inc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Coverage Zone (LGA) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={coverageLGA}
                  onChange={(e) => setCoverageLGA(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--foreground)] transition-colors"
                  placeholder="e.g. Lagos Mainland"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Full Name
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--foreground)] transition-colors"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--foreground)] transition-colors"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Address
                </label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--foreground)] transition-colors"
                  placeholder="Optional"
                />
              </div>
            </>
          )}

          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <div className="pt-4 border-t border-[var(--border)]">
            <button
              type="submit"
              disabled={isSubmitting || (isOperator && (!companyName.trim() || !coverageLGA.trim()))}
              className="btn-primary w-full sm:w-auto"
            >
              {isSubmitting ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
