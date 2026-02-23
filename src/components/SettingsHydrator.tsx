"use client";

import { useHydrateSettings } from "@/hooks/useHydrateSettings";
import { ReactNode } from "react";

interface SettingsHydratorProps {
  children: ReactNode;
}

/**
 * Component that hydrates Redux state from database when user is authenticated.
 * This should be placed inside both StoreProvider and AuthProvider.
 */
export default function SettingsHydrator({ children }: SettingsHydratorProps) {
  useHydrateSettings();
  
  return <>{children}</>;
}
