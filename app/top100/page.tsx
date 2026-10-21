import type { Metadata } from "next";
import Link from "next/link";
import { SITE, mailto } from "@/lib/config";
import chart from "@/data/top100/latest.json";

type Entry = { rank: number; prev_rank: number | null; is_new: boolean; name: string; full_name: string; url: string; description: string; stars: number; star_delta: number | null; category: string; npm?: { package: string; weekly_downloads: number } };
const entries = chart.entries as Entry[];
const CATS = ["All", "MCP", "Skill", "Claude Code add-on"];
const slug = (c: string) => c.toLowerCase().replace(/\s+/g, "-");
const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${n}`);
const weekLabel = new Date(chart.week + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export const metadata: Metadata = {
  title: `MCP & Skills Top 100 – week of ${weekLabel}`,
  description: "The weekly Billboard-style chart of the top 100 MCP servers, Agent Skills and Claude Code add-ons, ranked from real GitHub stars, momentum and npm downloads.",
  alternates: { canonical: `${SITE.url}/top100` },
  openGraph: { title: "MCP & Skills Top 100", description: "Weekly chart of the top MCP servers, Agent Skills and Claude Code add-ons.", url: `${SITE.url}/top100` },
};

function Move({ e }: { e: Entry }) {
  if (e.is_new) return <span className="chip text-amber-300">NEW</span>;
  if (e.prev_rank == null) return <span className="text-gray-600">–</span>;
  const d = e.prev_rank - e.rank;
  if (d > 0) return <span className="text-emerald-400">▲{d}</span>;
  if (d < 0) return <span className="text-rose-400">▼{-d}</span>;
  return <span className="text-gray-500">=</span>;
}

export default async function Top100({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const active = CATS.find((c) => slug(c) === cat) || "All";
  const list = active === "All" ? entries : entries.filter((e) => e.category === active);
  const hasPrev = !!chart.previous_week;
  const movers = entries.filter((e) => (e.star_delta ?? 0) > 0).sort((a, b) => (b.star_delta ?? 0) - (a.star_delta ?? 0)).slice(0, 5);
  const fresh = entries.filter((e) => e.is_new).slice(0, 5);
  const jsonLd = { "@context": "https://schema.org", "@type": "ItemList", name: "MCP & Skills Top 100", dateModified: chart.week, numberOfItems: entries.length,
    itemListElement: entries.map((e) => ({ "@type": "ListItem", position: e.rank, name: e.full_name, url: e.url, description: e.description })) };
  return (
    <div className="space-y-8 pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div>
        <div className="chip text-violet-300">Week of {weekLabel}</div>
        <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">MCP &amp; Skills <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Top 100</span></h1>
        <p className="mt-2 max-w-2xl text-gray-400">The weekly chart of MCP servers, Agent Skills and Claude Code add-ons. Ranked from real public data: GitHub stars, weekly star gains, recent activity and npm downloads. Updated every week.</p>
      </div>

      <Link href="/sponsor#top100" className="card flex items-center justify-between border-amber-400/40 p-5">
        <div><span className="chip text-amber-300">Sponsored</span><div className="mt-2 font-semibold text-white">Your MCP server or skill here</div><div className="text-sm text-gray-400">Featured slot at the top of the chart, seen by builders every week.</div></div>
        <span className="btn">Feature it →</span>
      </Link>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-5"><h2 className="font-semibold text-white">🔥 Biggest movers</h2>
          {movers.length ? <ol className="mt-3 space-y-1 text-sm">{movers.map((e) => <li key={e.full_name}><a href={e.url} className="text-gray-200 hover:text-white">{e.full_name}</a> <span className="text-emerald-400">+{fmt(e.star_delta!)}★</span></li>)}</ol>
            : <p className="mt-2 text-sm text-gray-500">Week 1 of the chart. Movers appear once we have last week&apos;s snapshot to compare.</p>}</div>
        <div className="card p-5"><h2 className="font-semibold text-white">✨ New this week</h2>
          {hasPrev && fresh.length ? <ol className="mt-3 space-y-1 text-sm">{fresh.map((e) => <li key={e.full_name}>#{e.rank} <a href={e.url} className="text-gray-200 hover:text-white">{e.full_name}</a></li>)}</ol>
            : <p className="mt-2 text-sm text-gray-500">{hasPrev ? "No new entries this week." : "This is the debut chart, so every entry is a first-week entry."}</p>}</div>
      </div>

      <div className="flex flex-wrap gap-2">{CATS.map((c) => (
        <Link key={c} href={c === "All" ? "/top100" : `/top100?cat=${slug(c)}`} className={`chip ${c === active ? "border-violet-400/60 text-white" : "text-gray-400"}`}>{c} {c !== "All" && `(${entries.filter((e) => e.category === c).length})`}</Link>))}</div>

      <ol className="space-y-2">{list.map((e) => (
        <li key={e.full_name} className="card flex items-center gap-4 p-4">
          <div className="w-12 text-center"><div className="text-2xl font-bold text-white">{e.rank}</div><div className="text-xs"><Move e={e} /></div></div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><a href={e.url} target="_blank" rel="noopener" className="font-semibold text-white hover:underline">{e.name}</a><span className="text-xs text-gray-500">{e.full_name.split("/")[0]}</span><span className="chip text-xs text-cyan-300">{e.category}</span></div>
            <p className="truncate text-sm text-gray-400">{e.description}</p>
          </div>
          <div className="text-right text-sm"><div className="text-white">★ {fmt(e.stars)}</div>{e.npm && <div className="text-xs text-gray-500">{fmt(e.npm.weekly_downloads)} npm/wk</div>}</div>
        </li>))}</ol>
      <p className="text-xs text-gray-500">Source: {chart.source}. Snapshot {chart.generated_at.slice(0, 10)} from {chart.candidates} candidate repos tagged mcp-server, model-context-protocol, mcp, claude-skills, agent-skills or claude-code. Scoring: stars (log), weekly star gain, and recent commits. Missing something? <a href={mailto("Top 100 suggestion")} className="underline">Tell us</a>.</p>
    </div>
  );
}
