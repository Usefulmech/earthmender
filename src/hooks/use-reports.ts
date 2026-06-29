"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchReports } from "@/lib/cloud-reports";
import type { ReportRecord } from "@/lib/types";
import { client, databaseId, collectionId } from "@/lib/appwrite";

export function useReports(menderId?: string) {
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const loadAll = useCallback(async () => {
    const data = await fetchReports(menderId);
    setReports(data);
    setHydrated(true);
  }, [menderId]);

  useEffect(() => {
    loadAll();

    // Subscribe to Appwrite Realtime events
    if (!databaseId || !collectionId) return;
    
    // The channel string for a whole collection
    const channel = `databases.${databaseId}.collections.${collectionId}.documents`;
    
    const unsubscribe = client.subscribe(channel, (response) => {
      // response.events contains what happened (*.create, *.update, *.delete)
      // For simplicity, we just reload everything if something changed, 
      // or we could optimistically update the state. Let's just reload.
      loadAll();
    });

    return () => {
      unsubscribe();
    };
  }, [loadAll]);

  return { reports, hydrated };
}
