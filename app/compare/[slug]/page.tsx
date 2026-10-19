import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ToolCard from "@/components/ToolCard";
import { comparisons, getComparison } from "@/data/comparisons";
import type { ToolFacts } from "@/data/toolFacts";
import { getEntrant } from "@/data/madness";
import { relatedComparisons, viewComparison } from "@/lib/compare";
import { SITE } from "@/lib/config";

export const generateStaticParams = () => comparisons.map((c) => ({ slug: c.slug }));
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getComparison((await params).slug);
  const v = c && viewComparison(c);
  if (!v) return {};
  return {
    title: `${v.title} (2026): pricing, models & which to pick`,
    description: v.description,
    alternates: { canonical: `/compare/${c.slug}` },
    openGraph: { title: v.title, description: v.description, type: "article" },
  };
}

const ROWS: { label: string; key: keyof ToolFacts }[] = [
  { label: "What it is", key: "kind" },
  { label: "Made by", key: "maker" },
  { label: "Where you use it", key: "surfaces" },
  { label: "Open source?", key: "openSource" },
  { label: "Models", key: "models" },
  { label: "Free option", key: "free" },
  { label: "Paid pricing", key: "paid" },
  { label: "Best for", key: "bestFor" },
];

const shapeLabel: Record<ToolFacts["shape"], string> = {
  ide: "an IDE (code editor app)",
  cli: "a terminal (CLI) tool",
  extension: "an extension for your existing editor",
  "app-builder": "a browser-based app builder",
  cloud: "a cloud agent",
  multi: "a multi-surface agent (CLI, IDE and more)",
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const c = getComparison((await params).slug);
  const v = c && viewComparison(c);
  if (!c || !v) notFound();
  const { a, b, fa, fb, title, description } = v;

  const faqs: { q: string; a: string }[] = [];
  if (fa) faqs.push({ q: `Is ${a.name} free?`, a: `${fa.free}. Paid: ${fa.paid}.` });
  if (fb) faqs.push({ q: `Is ${b.name} free?`, a: `${fb.free}. Paid: ${fb.paid}.` });
  if (fa && fb) {
    faqs.push({ q: `Is ${a.name} or ${b.name} open source?`, a: `${a.name}: ${fa.openSource}. ${b.name}: ${fb.openSource}.` });
    faqs.push({ q: `Is ${a.name} an IDE or a CLI? What about ${b.name}?`, a: `${a.name} is ${shapeLabel[fa.shape]} (${fa.surfaces}). ${b.name} is ${shapeLabel[fb.shape]} (${fb.surfaces}).` });
    faqs.push({ q: `Which models do ${a.name} and ${b.name} use?`, a: `${a.name}: ${fa.models}. ${b.name}: ${fb.models}.` });
  }
  if (c.beginner) faqs.push({ q: `Which is better for beginners, ${a.name} or ${b.name}?`, a: c.beginner });
  if (c.verdict) faqs.push({ q: `${a.name} or ${b.name}: which should I pick?`, a: c.verdict });

  const ld = [
    { "@context": "https://schema.org", "@type": "Article", headline: title, description, url: `${SITE.url}/compare/${c.slug}`, dateModified: c.updated, publisher: { "@type": "Organization", name: SITE.name, url: SITE.url } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const ea = getEntrant(a.slug);
  const eb = getEntrant(b.slug);
  const related = relatedComparisons(c);
  const news = [fa?.news && `${a.name}: ${fa.news}.`, fb?.news && `${b.name}: ${fb.news}.`].filter(Boolean) as string[];

  return (
    <div className="space-y-8 pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div>
        <p className="text-sm text-violet-300">Comparison · updated {c.updated}</p>
        <h1 className="mt-1 text-4xl font-bold text-white">{title}</h1>
        <p className="mt-3 max-w-3xl text-gray-400">{c.summary}</p>
      </div>

      {c.madness && ea && eb && (
        <Link href={`/madness/${c.toolA}-vs-${c.toolB}`} className="card flex items-center justify-between gap-4 border-violet-400/40 p-5">
          <div>
            <span className="chip text-violet-300">🏀 AI Madness Round of 32</span>
            <div className="mt-2 font-semibold text-white">({ea.seed}) {a.name} vs ({eb.seed}) {b.name}: who should advance?</div>
            <div className="text-sm text-gray-400">Vote in the coding agent bracket. No login needed.</div>
          </div>
          <span className="btn shrink-0">Vote →</span>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <ToolCard tool={a} />
        <ToolCard tool={b} />
      </div>

      {news.length > 0 && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-200">
          <b>What changed in 2026:</b> {news.join(" ")}
        </div>
      )}

      {fa && fb && (
        <section className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Factor</th>
                <th className="px-4 py-3 font-medium">{a.name}</th>
                <th className="px-4 py-3 font-medium">{b.name}</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.key} className="border-t border-white/10 align-top">
                  <td className="px-4 py-3 font-medium text-white">{r.label}</td>
                  <td className="px-4 py-3 text-gray-300">{String(fa[r.key])}</td>
                  <td className="px-4 py-3 text-gray-300">{String(fb[r.key])}</td>
                </tr>
              ))}
              {(c.points ?? []).map((p) => (
                <tr key={p.label} className="border-t border-white/10 align-top">
                  <td className="px-4 py-3 font-medium text-white">{p.label}</td>
                  <td className="px-4 py-3 text-gray-300">{p.a}</td>
                  <td className="px-4 py-3 text-gray-300">{p.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white">Pick {a.name} if…</h2>
          <p className="mt-2 text-sm text-gray-400">{c.pickA}</p>
          <Link href={`/tools/${a.slug}`} className="mt-4 inline-block text-sm text-cyan-400 hover:underline">{a.name} details →</Link>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white">Pick {b.name} if…</h2>
          <p className="mt-2 text-sm text-gray-400">{c.pickB}</p>
          <Link href={`/tools/${b.slug}`} className="mt-4 inline-block text-sm text-cyan-400 hover:underline">{b.name} details →</Link>
        </div>
      </section>

      {c.verdict && (
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-white">Our verdict</h2>
          <p className="mt-2 text-gray-300">{c.verdict}</p>
        </section>
      )}

      {faqs.length > 0 && (
        <section>
          <h2 className="mb-3 text-2xl font-semibold text-white">FAQ</h2>
          <div className="space-y-2">
            {faqs.map((f) => (
              <details key={f.q} className="card p-4">
                <summary className="cursor-pointer font-medium text-white">{f.q}</summary>
                <p className="mt-2 text-sm text-gray-400">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-semibold text-white">Related comparisons</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link key={r.c.slug} href={`/compare/${r.c.slug}`} className="card p-3 text-sm text-gray-300 hover:text-white">{r.title}</Link>
            ))}
          </div>
        </section>
      )}

      <p className="text-sm">
        <Link href="/compare" className="text-cyan-400 hover:underline">← All comparisons</Link>
        {" · "}
        <Link href="/madness" className="text-cyan-400 hover:underline">AI Madness bracket</Link>
      </p>

      <p className="text-xs text-gray-600">
        Facts checked {c.updated} against each tool&apos;s official pricing and docs pages. Pricing and features change often; check each official site before you buy.
      </p>
    </div>
  );
}
