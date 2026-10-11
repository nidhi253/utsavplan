"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type Ctx = {
  shortlist: number[];
  toggleShortlist: (id: number) => void;
  myEvents: string[];
  addMyEvent: (id: string) => void;
  toast: (m: string) => void;
};
const C = createContext<Ctx>(null as unknown as Ctx);
export const useApp = () => useContext(C);

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {}
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [shortlist, setShortlist] = useState<number[]>([]);
  const [myEvents, setMyEvents] = useState<string[]>([]);
  const [msg, setMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setShortlist(load("shortlist", []));
    setMyEvents(load("myEvents", []));
  }, []);

  const toast = useCallback((m: string) => {
    setMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(""), 1800);
  }, []);

  const toggleShortlist = useCallback(
    (id: number) => {
      setShortlist((cur) => {
        const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
        save("shortlist", next);
        return next;
      });
      toast("Shortlist updated");
    },
    [toast]
  );
  const addMyEvent = useCallback((id: string) => {
    setMyEvents((cur) => {
      if (cur.includes(id)) return cur;
      const next = [id, ...cur];
      save("myEvents", next);
      return next;
    });
  }, []);

  return (
    <C.Provider value={{ shortlist, toggleShortlist, myEvents, addMyEvent, toast }}>
      {children}
      <div className={`toast ${msg ? "show" : ""}`}>{msg}</div>
    </C.Provider>
  );
}
