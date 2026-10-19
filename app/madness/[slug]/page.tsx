import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Countdown from "@/components/Countdown";
import Newsletter from "@/components/Newsletter";
import VoteButtons from "@/components/VoteButtons";
import { ROUNDS, TZ_LABEL, allR32Slugs, findMatchupBySlug, formatCR } from "@/lib/madness";
import { loadBracket } from "@/lib/madnessData";
import { getEntrant, type SeededEntrant } from "@/data/madness";
import { comparisonForPair } from "@/data/comparisons";
import { getFacts } from "@/data/toolFacts";
import { getTool } from "@/lib/data";
import { SITE } from "@/lib/config";

export const revalidate = 30;
export const dynamicParams = true;
export const generateStaticParams = () => allR32Slugs().map((slug) => ({ slug }));

function pairFromSlug(slug: string) {
  const [x, y] = slug.split("-vs-");
  const a = x ? getEntrant(x) : undefined;
  const b = y ? getEntrant(y) : undefined;
  return a && b ? { a, b } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = pairFromSlug((await params).slug);
  if (!p) return {};
  const title = `${p.a.name} vs ${p.b.name}: vote in AI Madness`;
  const description = `(${p.a.seed}) ${p.a.name} vs (${p.b.seed}) ${p.b.name} in the AI Madness coding agent bracket. Cast your vote, see live results, and compare the two tools.`;
  return { title, description, alternates: { canonical: `/madness/${p.a.slug}-vs-${p.b.slug}` }, openGraph: { title, description }, twitter: { card: "summary_large_image", title, description } };
}

function Side({ e }: { e: SeededEntrant }) {
  const t = getTool(e.slug);
  const f = getFacts(e.slug);
  return (
    <div className="card space-y-3 p-6">
      <div className="text-xs text-gray-500">Seed {e.seed} · {e.maker}</div>
      <h2 className="text-2xl font-bold text-white">{e.name}</h2>
      {t && <p className="text-sm text-gray-300">{t.verdict}</p>}
      {f && (
        <dl className="space-y-1.5 text-sm">
          <div><dt className="inline text-gray-500">Where: </dt><dd className="inline text-gray-300">{f.surfaces}</dd></div>
          <div><dt className="inline text-gray-500">Free option: </dt><dd className="inline text-gray-300">{f.free}</dd></div>
          <div><dt className="inline text-gray-500">Open source: </dt><dd className="inline text-gray-300">{f.openSource}</dd></div>
        </dl>
      )}
      <div className="flex flex-wrap gap-3 pt-1 text-sm">
        <Link href={`/tools/${e.slug}`} className="text-cyan-400 hover:underline">{e.name} on BuildStack →</Link>
        {t && <a href={t.url} target="_blank" rel="noopener" className="text-gray-400 hover:text-white">Official site ↗</a>}
      </div>
    </div>
  );
}

export default async function MatchupPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  if (!pairFromSlug(slug)) notFound();
  const { bracket } = await loadBracket(undefined, true);
  const m = findMatchupBySlug(bracket, slug);
  if (!m || !m.a || !m.b) notFound();
  const round = ROUNDS[m.round];
  const cmp = comparisonForPair(m.a.slug, m.b.slug);
  const url = `${SITE.url}/madness/${slug}`;
  const shareText = `${m.a.name} vs ${m.b.name} in #AIMadness. Who wins? Vote here:`;
  const others = bracket.rounds[m.round].filter((x) => x.id !== m.id && x.slug);
  const target = m.status === "upcoming" ? round.start : round.end;

  return (
    <div className="space-y-8 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/madness" className="text-sm text-violet-300 hover:underline">🏀 AI Madness 2026 · {round.name}</Link>
          <h1 className="mt-1 text-4xl font-bold text-white">
            <span className="text-gray-500">({m.a.seed})</span> {m.a.name} <span className="text-gray-500">vs</span> <span className="text-gray-500">({m.b.seed})</span> {m.b.name}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {m.status === "upcoming" && <>Voting opens {formatCR(round.start)} ({TZ_LABEL}).</>}
            {m.status === "live" && <>Voting is open until {formatCR(round.end)} ({TZ_LABEL}).</>}
            {m.status === "final" && m.winner && <>Final: <b className="text-white">{m.winner.name}</b> advances.</>}
          </p>
        </div>
        {m.status !== "final" && <Countdown target={target} label={m.status === "upcoming" ? "Voting opens in" : "Voting closes in"} />}
      </div>

      <VoteButtons
        id={m.id}
        status={m.status}
        a={{ name: m.a.name, seed: m.a.seed }}
        b={{ name: m.b.name, seed: m.b.seed }}
        initial={{ a: m.votesA, b: m.votesB }}
        opensLabel={`${formatCR(round.start)} (${TZ_LABEL})`}
      />

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <a
          className="btn"
          target="_blank"
          rel="noopener"
          href={`https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`}
        >
          Share this matchup on X
        </a>
        {cmp && (
          <Link href={`/compare/${cmp.slug}`} className="text-cyan-400 hover:underline">
            Read the full {m.a.name} vs {m.b.name} comparison →
          </Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Side e={m.a} />
        <Side e={m.b} />
      </div>

      <Newsletter title="Get the results first" blurb="Round winners, upsets and the champion, straight to your inbox before anywhere else." cta="Send me results" />

      {others.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-semibold text-white">More {round.name} matchups</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <Link key={o.id} href={`/madness/${o.slug}`} className="card p-3 text-sm text-gray-300 hover:text-white">
                ({o.a!.seed}) {o.a!.name} vs ({o.b!.seed}) {o.b!.name}
              </Link>
            ))}
          </div>
        </section>
      )}
      <p className="text-sm"><Link href="/madness" className="text-cyan-400 hover:underline">← Full bracket</Link></p>
    </div>
  );
}
