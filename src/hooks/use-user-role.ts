"use client";

import { useAuth } from "@/components/auth-provider";

export function useUserRole() {
  const { profile, isLoading } = useAuth();

  return { 
    role: profile?.role || null, 
    hydrated: !isLoading 
  };
}
