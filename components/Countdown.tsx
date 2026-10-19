"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

export default function Countdown({ target, label }: { target: string; label: string }) {
  const router = useRouter();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const left = now === null ? null : Date.parse(target) - now;
  useEffect(() => {
    if (left !== null && left <= 0 && left > -2000) router.refresh();
  }, [left, router]);
  const p = parts(left ?? 0);
  const cells: [number, string][] = [[p.d, "days"], [p.h, "hrs"], [p.m, "min"], [p.s, "sec"]];
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-400">{label}</div>
      <div className="mt-1 flex gap-2" suppressHydrationWarning>
        {cells.map(([v, l]) => (
          <div key={l} className="min-w-14 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-center">
            <div className="text-xl font-bold tabular-nums text-white">{left === null ? "–" : String(v).padStart(2, "0")}</div>
            <div className="text-[10px] uppercase text-gray-500">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
