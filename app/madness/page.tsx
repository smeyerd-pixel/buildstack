import Link from "next/link";
import type { Metadata } from "next";
import Countdown from "@/components/Countdown";
import Newsletter from "@/components/Newsletter";
import { ROUNDS, TZ_LABEL, formatCR, nextEvent, pct, type Matchup } from "@/lib/madness";
import { loadBracket } from "@/lib/madnessData";
import { entrants, getEntrant, MENTION_POINTS, SEEDING_SNAPSHOT } from "@/data/madness";
import { SITE, mailto } from "@/lib/config";

export const revalidate = 30;

const title = "AI Madness 2026: the coding agent bracket";
const description =
  "32 AI coding agents, one champion. Vote in every matchup of the AI Madness bracket: Cursor, Claude Code, Codex, OpenCode, Copilot, Devin, Lovable and more. Round of 32 starts Oct 26.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/madness" },
  openGraph: { title, description },
};

function Cell({ m }: { m: Matchup }) {
  const rows = [
    { e: m.a, v: m.votesA, other: m.votesB },
    { e: m.b, v: m.votesB, other: m.votesA },
  ];
  const body = (
    <div className={`rounded-lg border text-sm ${m.status === "live" ? "border-violet-400/60" : "border-white/10"} bg-black/30`}>
      {rows.map((r, i) => {
        const won = m.winner && r.e && m.winner.slug === r.e.slug;
        const lost = m.winner && r.e && m.winner.slug !== r.e.slug;
        return (
          <div key={i} className={`flex items-center justify-between gap-2 px-2 py-1.5 ${i === 0 ? "border-b border-white/5" : ""} ${lost ? "opacity-40" : ""}`}>
            <span className="truncate">
              {r.e ? (
                <>
                  <span className="mr-1.5 text-xs text-gray-500">{r.e.seed}</span>
                  <span className={won ? "font-semibold text-white" : "text-gray-200"}>{r.e.name}</span>
                </>
              ) : (
                <span className="text-gray-600">TBD</span>
              )}
            </span>
            {m.status !== "upcoming" && r.e && <span className="text-xs tabular-nums text-gray-400">{pct(r.v, r.other)}%</span>}
          </div>
        );
      })}
    </div>
  );
  return m.slug ? (
    <Link href={`/madness/${m.slug}`} className="block hover:opacity-90" title={`${m.a?.name} vs ${m.b?.name}`}>
      {body}
    </Link>
  ) : (
    body
  );
}

export default async function MadnessPage() {
  const { bracket, now } = await loadBracket(undefined, true);
  const ev = nextEvent(now);
  const live = bracket.liveRound >= 0 ? bracket.rounds[bracket.liveRound] : null;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "AI Madness 2026: the coding agent bracket",
    description,
    startDate: ROUNDS[0].start,
    endDate: ROUNDS[4].end,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "VirtualLocation", url: `${SITE.url}/madness` },
    organizer: { "@type": "Organization", name: SITE.name, url: SITE.url, email: SITE.contactEmail },
  };

  return (
    <div className="space-y-10 pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="card flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <span className="chip text-violet-300">🏀 AI Madness 2026</span>
          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">The coding agent bracket</h1>
          <p className="mt-3 text-gray-400">
            32 AI coding tools. 5 rounds. You pick the winner. Each round lasts about 3 days, and the tool with the higher share of votes moves on
            (a tie goes to the higher seed). No login needed: one vote per matchup.
          </p>
          <p className="mt-3 text-sm text-gray-300">
            {bracket.phase === "pre" && <>Round of 32 opens <b>{formatCR(ROUNDS[0].start)}</b> ({TZ_LABEL}).</>}
            {bracket.phase === "live" && live && <>Now voting: <b>{ROUNDS[bracket.liveRound].name}</b>. Closes {formatCR(ROUNDS[bracket.liveRound].end)} ({TZ_LABEL}).</>}
            {bracket.phase === "done" && bracket.champion && <>🏆 Your 2026 champion: <b>{bracket.champion.name}</b>.</>}
          </p>
        </div>
        {ev && <Countdown target={ev.at} label={ev.label} />}
      </section>

      {live && (
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-white">Vote now: {ROUNDS[bracket.liveRound].name}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {live.map((m) => (
              <Cell key={m.id} m={m} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-white">The bracket</h2>
        <div className="overflow-x-auto pb-2">
          <div className="grid min-w-[1000px] grid-cols-5 gap-4">
            {bracket.rounds.map((r, ri) => (
              <div key={ri} className="flex flex-col">
                <div className="mb-2">
                  <div className="text-sm font-semibold text-white">{ROUNDS[ri].name}</div>
                  <div className="text-xs text-gray-500">{formatCR(ROUNDS[ri].start)} – {formatCR(ROUNDS[ri].end)}</div>
                </div>
                <div className="flex flex-1 flex-col justify-around gap-2">
                  {r.map((m) => (
                    <Cell key={m.id} m={m} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">Times are {TZ_LABEL} (UTC-6). Scroll sideways on mobile. Tap any matchup to vote and share it.</p>
      </section>

      <Newsletter title="Get the results first" blurb="Get each round's winners, the upsets and the final champion in your inbox before we post them anywhere else." cta="Send me results" />

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-white">Schedule</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-300">
            {ROUNDS.map((r) => (
              <li key={r.key} className="flex justify-between gap-4">
                <span>{r.name}</span>
                <span className="text-gray-400">{formatCR(r.start)} → {formatCR(r.end)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-gray-500">Rounds advance automatically when voting closes. Winner = higher share of votes; a tie goes to the higher seed.</p>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-white">How we seeded it</h2>
          <p className="mt-3 text-sm text-gray-400">
            Seeds come from public numbers captured on {SEEDING_SNAPSHOT}, frozen for the whole tournament. Seed score = GitHub stars on the tool&apos;s
            official repo + followers of the tool&apos;s own X account + {MENTION_POINTS.toLocaleString()} points for each mention in our{" "}
            <Link href="/top100" className="text-cyan-400 hover:underline">MCP &amp; Skills Top 100</Link>. General accounts like @claudeai, @OpenAIDevs or @github
            don&apos;t count, because their followers aren&apos;t specific to the coding tool. That&apos;s why a giant like GitHub Copilot lands as a {getEntrant("github-copilot")?.seed} seed: upset alert.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-white">The 32 seeds</h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-400">
              <tr>
                <th className="px-3 py-2 font-medium">Seed</th>
                <th className="px-3 py-2 font-medium">Tool</th>
                <th className="px-3 py-2 font-medium">Maker</th>
                <th className="px-3 py-2 text-right font-medium">GitHub stars</th>
                <th className="px-3 py-2 text-right font-medium">X followers</th>
                <th className="px-3 py-2 text-right font-medium">Top 100 mentions</th>
                <th className="px-3 py-2 text-right font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {entrants.map((e) => (
                <tr key={e.slug} className="border-t border-white/10">
                  <td className="px-3 py-2 text-gray-400">{e.seed}</td>
                  <td className="px-3 py-2"><Link href={`/tools/${e.slug}`} className="text-white hover:text-violet-300">{e.name}</Link></td>
                  <td className="px-3 py-2 text-gray-400">{e.maker}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-gray-300">{e.stars ? e.stars.toLocaleString() : "–"}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-gray-300">{e.followers ? `${e.followers.toLocaleString()} (@${e.account})` : "–"}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-gray-300">{e.top100Mentions}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-white">{e.score.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-gray-400">
          Want the details before you vote? Every first-round matchup has a full side-by-side on our <Link href="/compare" className="text-cyan-400 hover:underline">comparison pages</Link>.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Think a tool got the wrong seed, or want to sponsor the bracket? <a href={mailto("AI Madness")} className="text-cyan-400 hover:underline">Email us</a>.
        </p>
      </section>
    </div>
  );
}
