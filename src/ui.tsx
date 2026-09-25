import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { api } from "../convex/_generated/api";

export function errMsg(e: unknown): string {
  if (e instanceof ConvexError) return String(e.data);
  return "Something went wrong — check your connection and try again.";
}

export function fmtClock(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// "960000" -> "₹9,60,000". Leaves already-formatted text alone.
export function inr(value: string | number): string {
  const n = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  if (!Number.isFinite(n)) return String(value);
  return "₹" + n.toLocaleString("en-IN");
}

// State that survives a page refresh (stored in this browser only).
export function useLocalState<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked — keep in memory */
    }
  }, [key, value]);
  return [value, setValue];
}

// How far this laptop's clock is from the server, so every team sees the same countdown.
export function useServerOffset(): number {
  const serverTime = useMutation(api.event.serverTime);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const t0 = Date.now();
    serverTime({})
      .then((server) => {
        if (!cancelled) setOffset(server - (t0 + Date.now()) / 2);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [serverTime]);
  return offset;
}

export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export function Label({ children }: { children: ReactNode }) {
  return <div className="label">{children}</div>;
}

export function Badge({ children, tone = "red" }: { children: ReactNode; tone?: "red" | "gold" | "moss" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function KV({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="kv">
      <span className="k">{k}</span>
      <span className="v">{v}</span>
    </div>
  );
}

// "unitPrice" -> "Unit Price"
export function humanize(key: string): string {
  const spaced = key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());
  return spaced.replace(/\bPo\b/, "PO");
}
    