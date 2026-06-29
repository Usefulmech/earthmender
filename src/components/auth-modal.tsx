"use client";

import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import type { UserRole, UserProfile } from "@/lib/types";
import { useAuth } from "./auth-provider";
import { authService } from "@/lib/auth-service";
import { useRouter } from "next/navigation";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ROLE_STORAGE_KEY = "earthmender.pending-role";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user, profile, login, refreshProfile } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleCancel() {
    window.sessionStorage.removeItem(ROLE_STORAGE_KEY);
    onClose();
  }

  useEffect(() => {
    if (isOpen) {
      if (user) {
        const savedRole = window.sessionStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null;
        const needsOnboarding = !profile || (savedRole && savedRole !== profile.role);

        if (needsOnboarding) {
          if (savedRole) {
            setSelectedRole(savedRole);
            handleProvisionProfile(savedRole);
          } else if (!profile) {
            setStep(1);
            setSelectedRole(null);
          }
        } else {
          setStep(1);
          setSelectedRole(null);
        }
      } else {
        setStep(1);
        setSelectedRole(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user, profile]);

  if (!isOpen) return null;

  async function handleProvisionProfile(role: UserRole) {
    if (!user) return;
    setIsSubmitting(true);
    try {
      if (profile && profile.$id) {
        await authService.updateProfile(profile.$id, {
          role,
          companyName: role === "operator" ? companyName : undefined,
          coverageLGA: role === "operator" ? coverageLGA : undefined,
        });
      } else {
        const newProfile: Omit<UserProfile, "$id"> = {
          userId: user.$id,
          role,
          trustScore: 50,
        };
        await authService.createProfile(newProfile);
      }
      await refreshProfile();
      window.sessionStorage.removeItem(ROLE_STORAGE_KEY);
      
      // Redirect based on role
      const homeHref = role === "mender" ? "/mender" : "/operator";
      router.push(homeHref);
      onClose();
    } catch (error) {
      console.error("Failed to provision profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSelectRole(role: UserRole) {
    setSelectedRole(role);
    window.sessionStorage.setItem(ROLE_STORAGE_KEY, role);
    
    if (user) {
      if (!profile || role !== profile.role) {
        handleProvisionProfile(role);
      } else {
        // Same role, just close
        window.sessionStorage.removeItem(ROLE_STORAGE_KEY);
        onClose();
      }
    } else {
      setStep(2);
    }
  }

  async function handleSignIn() {
    await login();
  }

  return (
    <div className="modal-overlay">
      <div className="modal-panel max-w-sm">
        {step === 1 && (
          <div className="animate-fade-in-up">
            <div className="flex justify-center mb-6">
               <BrandMark />
            </div>
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--foreground)] text-center">
              Welcome
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)] text-center">
              Select an access role to continue.
            </p>

            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={() => handleSelectRole("mender")}
                className="flex w-full items-center justify-between rounded-xl border border-[var(--border)] p-4 hover:border-[var(--foreground)] transition-colors cursor-pointer group"
              >
                <div className="text-left">
                  <h3 className="font-semibold text-[var(--foreground)] text-sm group-hover:text-[var(--primary)] transition-colors">Mender</h3>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">Capture and report issues.</p>
                </div>
                <div className="h-6 w-6 rounded-full border border-[var(--border)] flex items-center justify-center text-xs group-hover:bg-[var(--foreground)] group-hover:text-white transition-all">&rarr;</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole("operator")}
                className="flex w-full items-center justify-between rounded-xl border border-[var(--border)] p-4 hover:border-[var(--foreground)] transition-colors cursor-pointer group"
              >
                <div className="text-left">
                  <h3 className="font-semibold text-[var(--foreground)] text-sm group-hover:text-[var(--primary)] transition-colors">Operator</h3>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">Manage and resolve reports.</p>
                </div>
                <div className="h-6 w-6 rounded-full border border-[var(--border)] flex items-center justify-center text-xs group-hover:bg-[var(--foreground)] group-hover:text-white transition-all">&rarr;</div>
              </button>
            </div>
            
            {!(user && !profile) && (
              <button onClick={handleCancel} className="mt-6 w-full text-center text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer">
                 Cancel
              </button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up">
            <div className="flex justify-center mb-6">
               <BrandMark />
            </div>
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--foreground)] text-center">
              Sign in
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)] text-center">
              You chose <strong className="capitalize text-[var(--foreground)]">{selectedRole}</strong>. Let&apos;s get you in.
            </p>

            <button
              onClick={handleSignIn}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-white py-3 text-sm font-semibold hover:bg-[var(--border-light)] transition-colors cursor-pointer shadow-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                 <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
            
            <div className="mt-6 flex items-center justify-between px-2">
               <button onClick={() => setStep(1)} className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer">&larr; Back</button>
               {!(user && !profile) && (
                 <button onClick={handleCancel} className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer">Cancel</button>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
