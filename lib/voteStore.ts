// Vote storage with three backends, picked automatically:
// 1. Upstash Redis (free tier) if KV_REST_API_URL/KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL/TOKEN are set
//    (that's what Vercel → Storage → Upstash for Redis injects). Recommended.
// 2. Abacus (abacus.jasoncameron.dev), a free no-signup counter API. Works with zero setup.
// 3. In-memory (per server instance) if both of the above are unreachable, so the UI never breaks.
import { finalIds, nowMs } from "@/lib/madness";

const REDIS_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "").trim();
const REDIS_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "").trim();
const ABACUS = "https://abacus.jasoncameron.dev";
const NS = (process.env.MADNESS_NS || "buildstack-fawn-madness-2026").replace(/[^A-Za-z0-9_.-]/g, "");
export const MAX_VOTES_PER_IP = 3; // per matchup; allows a few people sharing one network

export type Side = "a" | "b";
export type Backend = "upstash" | "abacus" | "memory";
export const configuredBackend = (): Backend => (REDIS_URL && REDIS_TOKEN ? "upstash" : "abacus");

const voteKey = (id: string, side: Side) => `v-${id}-${side}`;
const ipKey = (id: string, ipHash: string) => `ip-${id}-${ipHash.slice(0, 20)}`;

// ---------- memory fallback ----------
const g = globalThis as unknown as { __bsVotes?: Map<string, number> };
const mem = (g.__bsVotes ??= new Map<string, number>());
const memIncr = (k: string) => {
  const v = (mem.get(k) ?? 0) + 1;
  mem.set(k, v);
  return v;
};

// ---------- upstash ----------
async function redis(commands: (string | number)[][]): Promise<unknown[]> {
  const r = await fetch(`${REDIS_URL.replace(/\/$/, "")}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`redis ${r.status}`);
  const j = (await r.json()) as { result?: unknown; error?: string }[];
  return j.map((x) => {
    if (x.error) throw new Error(x.error);
    return x.result;
  });
}

// ---------- abacus ----------
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function abacus(path: string, init: RequestInit & { next?: { revalidate: number } }, tries = 5): Promise<number> {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(`${ABACUS}${path}`, init);
    if (r.status === 404) return 0;
    if (r.status === 429) {
      // Abacus allows 30 requests / 10s per IP. Wait as long as it asks (seconds or ms), capped at 4s.
      const ra = Number(r.headers.get("retry-after")) || 0;
      const reset = Number(r.headers.get("ratelimit-reset")) || 0;
      const wait = Math.max(ra < 100 ? ra * 1000 : ra, reset ? reset * 1000 - Date.now() : 0, 1000);
      await sleep(Math.min(wait, 10000) + 150);
      continue;
    }
    if (!r.ok) throw new Error(`abacus ${r.status}`);
    const j = (await r.json()) as { value?: number };
    return Number(j.value ?? 0);
  }
  throw new Error("abacus rate limited");
}

async function pool<T, R>(items: T[], n: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const k = i++;
        out[k] = await fn(items[k]);
      }
    }),
  );
  return out;
}

export type CountsResult = { counts: Record<string, { a: number; b: number }>; backend: Backend; degraded: boolean };

// During `next build`, every /madness page reads the same counts. Share one in-flight read per build worker
// so prerendering ~40 pages doesn't fire hundreds of Abacus requests and trip its 30 req / 10s limit.
const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";
const gb = globalThis as unknown as { __bsBuildCounts?: Map<string, Promise<CountsResult>> };
const buildCounts = (gb.__bsBuildCounts ??= new Map<string, Promise<CountsResult>>());

export async function getCounts(ids: string[], now = nowMs()): Promise<CountsResult> {
  if (!IS_BUILD || ids.length === 0) return readCounts(ids, now);
  const key = ids.join(",");
  let p = buildCounts.get(key);
  if (!p) {
    p = readCounts(ids, now).then((r) => {
      if (r.degraded) buildCounts.delete(key); // don't reuse a failed read
      return r;
    });
    buildCounts.set(key, p);
  }
  return p;
}

async function readCounts(ids: string[], now: number): Promise<CountsResult> {
  const counts: Record<string, { a: number; b: number }> = {};
  if (ids.length === 0) return { counts, backend: configuredBackend(), degraded: false };
  const keys = ids.flatMap((id) => [voteKey(id, "a"), voteKey(id, "b")]);
  try {
    let values: number[];
    if (configuredBackend() === "upstash") {
      const [res] = await redis([["MGET", ...keys]]);
      values = (res as (string | null)[]).map((v) => Number(v ?? 0));
    } else {
      const closed = finalIds(now);
      values = await pool(keys, 4, (k) => {
        const id = k.slice(2, -2);
        const isFinal = closed.has(id);
        // Closed rounds can't change, so cache them for a day under a separate cache key.
        return abacus(`/get/${NS}/${k}${isFinal ? "?final=1" : ""}`, { next: { revalidate: isFinal ? 86400 : 20 } });
      });
    }
    ids.forEach((id, i) => (counts[id] = { a: values[2 * i] || 0, b: values[2 * i + 1] || 0 }));
    return { counts, backend: configuredBackend(), degraded: false };
  } catch (e) {
    console.error("vote store read failed", e);
    ids.forEach((id) => (counts[id] = { a: mem.get(voteKey(id, "a")) ?? 0, b: mem.get(voteKey(id, "b")) ?? 0 }));
    return { counts, backend: "memory", degraded: true };
  }
}

export type VoteResult =
  | { ok: true; counts: { a: number; b: number }; backend: Backend }
  | { ok: false; reason: "rate_limited" | "error"; backend: Backend };

export async function castVote(id: string, side: Side, ipHash: string): Promise<VoteResult> {
  const other: Side = side === "a" ? "b" : "a";
  try {
    if (configuredBackend() === "upstash") {
      const ik = ipKey(id, ipHash);
      const [n] = await redis([["INCR", ik], ["EXPIRE", ik, 60 * 60 * 24 * 30]]);
      if (Number(n) > MAX_VOTES_PER_IP) return { ok: false, reason: "rate_limited", backend: "upstash" };
      const [mine, theirs] = await redis([["INCR", voteKey(id, side)], ["GET", voteKey(id, other)]]);
      const m = Number(mine), t = Number(theirs ?? 0);
      return { ok: true, counts: side === "a" ? { a: m, b: t } : { a: t, b: m }, backend: "upstash" };
    }
    const n = await abacus(`/hit/${NS}/${ipKey(id, ipHash)}`, { cache: "no-store" });
    if (n > MAX_VOTES_PER_IP) return { ok: false, reason: "rate_limited", backend: "abacus" };
    const m = await abacus(`/hit/${NS}/${voteKey(id, side)}`, { cache: "no-store" });
    const t = await abacus(`/get/${NS}/${voteKey(id, other)}`, { next: { revalidate: 20 } });
    return { ok: true, counts: side === "a" ? { a: m, b: t } : { a: t, b: m }, backend: "abacus" };
  } catch (e) {
    console.error("vote store write failed", e);
    // Only fall back to memory if no persistent store is reachable at all (never mix stores mid-vote).
    if (String(e).includes("rate limited")) return { ok: false, reason: "error", backend: configuredBackend() };
    const ik = ipKey(id, ipHash);
    if (memIncr(ik) > MAX_VOTES_PER_IP) return { ok: false, reason: "rate_limited", backend: "memory" };
    const m = memIncr(voteKey(id, side));
    const t = mem.get(voteKey(id, other)) ?? 0;
    return { ok: true, counts: side === "a" ? { a: m, b: t } : { a: t, b: m }, backend: "memory" };
  }
}
