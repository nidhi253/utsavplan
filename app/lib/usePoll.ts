"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// Fetches a JSON endpoint now and every `ms` — this is the "live" family view.
export function usePoll<T>(url: string | null, ms = 2000) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(false);
  const alive = useRef(true);

  const refresh = useCallback(async () => {
    if (!url) return;
    try {
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) throw new Error(String(r.status));
      const j = (await r.json()) as T;
      if (alive.current) {
        setData(j);
        setError(false);
      }
    } catch {
      if (alive.current) setError(true);
    }
  }, [url]);

  useEffect(() => {
    alive.current = true;
    refresh();
    const t = setInterval(refresh, ms);
    return () => {
      alive.current = false;
      clearInterval(t);
    };
  }, [refresh, ms]);

  return { data, error, refresh, setData };
}
