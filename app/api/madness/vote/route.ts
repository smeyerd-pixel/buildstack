import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { HEALTHCHECK_ID, ROUNDS, nowMs } from "@/lib/madness";
import { castVote, getCounts, type Side } from "@/lib/voteStore";

export const dynamic = "force-dynamic";
const COOKIE = "bs_mm";

// Cookie format: "r1-01.a_r1-02.b" (only URL-safe characters, so nothing gets double-encoded).
const parseVoted = (raw: string | undefined) =>
  new Map((raw ? decodeURIComponent(raw).split("_") : []).map((p) => p.split(".") as [string, string]).filter((p) => p.length === 2));

function clientIp(req: Request) {
  return (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
}

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id") || "";
  if (!/^(r[1-5]-\d{2}|healthcheck)$/.test(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });
  const { counts, backend, degraded } = await getCounts([id]);
  return NextResponse.json({ id, counts: counts[id], backend, degraded }, { headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30" } });
}

export async function POST(req: Request) {
  // Light same-origin check so other sites can't silently submit votes.
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return NextResponse.json({ message: "Bad origin." }, { status: 403 });

  let id = "";
  let side: Side = "a";
  try {
    const j = await req.json();
    id = String(j.id || "");
    side = j.side === "b" ? "b" : "a";
  } catch {}

  if (id !== HEALTHCHECK_ID) {
    // Matchup ids are positional (r2-03 = 3rd Sweet 16 game), so we only need the schedule to know if voting is open.
    const m = /^r([1-5])-(\d{2})$/.exec(id);
    const ri = m ? Number(m[1]) - 1 : -1;
    const idx = m ? Number(m[2]) : 0;
    if (ri < 0 || idx < 1 || idx > 16 >> ri) return NextResponse.json({ message: "Unknown matchup." }, { status: 404 });
    const now = nowMs();
    if (now < Date.parse(ROUNDS[ri].start)) return NextResponse.json({ message: "Voting hasn't opened for this matchup yet." }, { status: 409 });
    if (now >= Date.parse(ROUNDS[ri].end)) return NextResponse.json({ message: "Voting for this matchup has closed." }, { status: 409 });
  }

  const cookieHeader = req.headers.get("cookie") || "";
  const raw = cookieHeader.split(/;\s*/).find((c) => c.startsWith(COOKIE + "="))?.slice(COOKIE.length + 1);
  const voted = parseVoted(raw);
  if (voted.has(id) && id !== HEALTHCHECK_ID) {
    return NextResponse.json({ message: "You already voted in this matchup.", side: voted.get(id) }, { status: 409 });
  }

  const salt = process.env.VOTE_SALT || "buildstack-madness-2026";
  const ipHash = createHash("sha256").update(`${salt}:${clientIp(req)}`).digest("hex");
  const result = await castVote(id, side, ipHash);
  if (!result.ok) {
    const msg = result.reason === "rate_limited" ? "Too many votes from your network for this matchup." : "Voting is busy right now. Try again in a few seconds.";
    return NextResponse.json({ message: msg }, { status: result.reason === "rate_limited" ? 429 : 503 });
  }

  voted.set(id, side);
  const value = [...voted].map(([k, v]) => `${k}.${v}`).join("_");
  const res = NextResponse.json({ message: "Vote counted!", id, side, counts: result.counts, backend: result.backend });
  if (id !== HEALTHCHECK_ID) {
    res.cookies.set(COOKIE, value, { path: "/", maxAge: 60 * 60 * 24 * 60, sameSite: "lax", secure: !!process.env.VERCEL || new URL(req.url).protocol === "https:" });
  }
  return res;
}
