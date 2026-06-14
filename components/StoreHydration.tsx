"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

// Rehydrates the persisted demo state from localStorage after mount, avoiding
// SSR hydration mismatches (store starts from the pristine in-memory seed).
export function StoreHydration() {
  useEffect(() => {
    useStore.persist.rehydrate();
  }, []);
  return null;
}
