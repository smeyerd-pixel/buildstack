"use client";
import { useEffect, useState } from "react";

type Props = {
  id: string;
  status: "upcoming" | "live" | "final";
  a: { name: string; seed: number };
  b: { name: string; seed: number };
  initial: { a: number; b: number };
  opensLabel?: string;
};

const readVoted = (id: string): "a" | "b" | null => {
  const raw = document.cookie.split(/;\s*/).find((c) => c.startsWith("bs_mm="))?.slice(6);
  if (!raw) return null;
  const hit = decodeURIComponent(raw).split("_").map((p) => p.split(".")).find(([k]) => k === id);
  return hit && (hit[1] === "a" || hit[1] === "b") ? hit[1] : null;
};

export default function VoteButtons({ id, status, a, b, initial, opensLabel }: Props) {
  const [counts, setCounts] = useState(initial);
  const [voted, setVoted] = useState<"a" | "b" | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setVoted(readVoted(id));
    if (status === "upcoming") return;
    fetch(`/api/madness/vote?id=${id}`).then((r) => r.json()).then((j) => j.counts && setCounts(j.counts)).catch(() => {});
  }, [id, status]);

  async function vote(side: "a" | "b") {
    setBusy(true);
    setMsg("");
    try {
      const r = await fetch("/api/madness/vote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, side }) });
      const j = await r.json();
      if (j.counts) setCounts(j.counts);
      if (r.ok || j.side) setVoted(j.side ?? side);
      setMsg(j.message || "");
    } catch {
      setMsg("Something went wrong. Try again.");
    }
    setBusy(false);
  }

  const total = counts.a + counts.b;
  const pa = total ? Math.round((100 * counts.a) / total) : 50;
  const showResults = status !== "upcoming" && (voted !== null || status === "final");
  const canVote = status === "live" && voted === null;

  return (
    <div className="card space-y-4 p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {(["a", "b"] as const).map((s) => {
          const t = s === "a" ? a : b;
          const chosen = voted === s;
          return (
            <button
              key={s}
              onClick={() => vote(s)}
              disabled={!canVote || busy}
              className={`rounded-xl border px-4 py-4 text-left transition ${chosen ? "border-cyan-400 bg-cyan-400/10" : "border-white/10 bg-black/30"} ${canVote ? "hover:border-violet-400 hover:bg-violet-500/10" : "cursor-default opacity-90"}`}
            >
              <div className="text-xs text-gray-500">Seed {t.seed}</div>
              <div className="text-lg font-semibold text-white">{canVote ? `Vote ${t.name}` : t.name}{chosen ? " ✓" : ""}</div>
            </button>
          );
        })}
      </div>
      {showResults ? (
        <div>
          <div className="flex h-3 overflow-hidden rounded-full bg-white/10">
            <div className="bg-gradient-to-r from-violet-500 to-violet-400" style={{ width: `${pa}%` }} />
            <div className="bg-gradient-to-r from-cyan-400 to-cyan-500" style={{ width: `${100 - pa}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-violet-300">{a.name} {pa}%</span>
            <span className="text-gray-500">{total.toLocaleString()} vote{total === 1 ? "" : "s"}</span>
            <span className="text-cyan-300">{100 - pa}% {b.name}</span>
          </div>
        </div>
      ) : status === "upcoming" ? (
        <p className="text-sm text-gray-400">Voting opens {opensLabel ?? "soon"}. Bookmark this page and come back to vote.</p>
      ) : (
        <p className="text-sm text-gray-400">Pick one to see the live results. One vote per matchup, no login needed.</p>
      )}
      {msg && <p className="text-sm text-cyan-300">{msg}</p>}
    </div>
  );
}
