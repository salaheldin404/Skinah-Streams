"use client";

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { setSyncStatus, resetSync } from "@/lib/store/slices/sync-slice";
import { useCallback } from "react";

/**
 * Custom hook for interacting with sync state
 * Provides optimistic sync status and helper methods
 */
export function useSyncStatus() {
  const dispatch = useAppDispatch();
  const syncState = useAppSelector((state) => state.sync);

  const resetSyncState = useCallback(() => {
    dispatch(resetSync());
  }, [dispatch]);

  const markAsSynced = useCallback(() => {
    dispatch(setSyncStatus("synced"));
  }, [dispatch]);

  const markAsSyncing = useCallback(() => {
    dispatch(setSyncStatus("syncing"));
  }, [dispatch]);

  return {
    ...syncState,
    resetSyncState,
    markAsSynced,
    markAsSyncing,
    isSyncing: syncState.status === "syncing",
    isPending: syncState.status === "pending",
    hasError: syncState.status === "error",
    isSynced: syncState.status === "synced",
  };
}
