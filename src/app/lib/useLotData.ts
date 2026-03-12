import { useEffect, useRef, useState, useCallback } from "react";
import type { LotStatus } from "../data/lots";

export interface SheetLot {
  project_id: number;
  lot_id: string;
  lot_number: number;
  status: LotStatus;
  price: number;
  size_m2: number;
  description: string;
  photo_1: string;
  photo_2: string;
  photo_3: string;
  featured: boolean | string;
}

export interface UseLotDataResult {
  lots: SheetLot[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Set via VITE_SHEETS_API_URL in .env.
 * Leave empty to skip fetching and fall back to static data.
 */
const SHEETS_API_URL = import.meta.env.VITE_SHEETS_API_URL ?? "";

const REFRESH_INTERVAL_MS = 30_000;

export function useLotData(projectId: number): UseLotDataResult {
  const [lots, setLots] = useState<SheetLot[]>([]);
  const [loading, setLoading] = useState(!!SHEETS_API_URL);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasFetchedOnce = useRef(false);
  const lastJsonRef = useRef<string>("");

  const fetchLots = useCallback(async () => {
    if (!SHEETS_API_URL) return;

    try {
      // Only show loading spinner on first fetch, not background refreshes
      if (!hasFetchedOnce.current) {
        setLoading(true);
      }
      setError(null);

      const url = `${SHEETS_API_URL}?action=lots&project=${encodeURIComponent(projectId)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch lot data");
      }

      // Only update state if data actually changed — prevents map re-render flicker
      const incoming = JSON.stringify(result.data ?? []);
      if (incoming !== lastJsonRef.current) {
        lastJsonRef.current = incoming;
        setLots(result.data ?? []);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.warn("[useLotData] Fetch failed, static fallback active:", message);
    } finally {
      hasFetchedOnce.current = true;
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (!SHEETS_API_URL) {
      setLoading(false);
      return;
    }

    fetchLots();

    intervalRef.current = setInterval(fetchLots, REFRESH_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchLots]);

  return { lots, loading, error, refresh: fetchLots };
}
