import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ToolCard from "@/components/ToolCard";
import { comparisons, getComparison } from "@/data/comparisons";
import { getTool } from "@/lib/data";
import { SITE } from "@/lib/config";

export const generateStaticParams = () => comparisons.map((c) => ({ slug: c.slug }));
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getComparison((await params).slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: `/compare/${c.slug}` },
    openGraph: { title: c.title, description: c.description },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const c = getComparison((await params).slug);
  if (!c) notFound();
  const a = getTool(c.toolA);
  const b = getTool(c.toolB);
  if (!a || !b) notFound();

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.title,
    description: c.description,
    url: `${SITE.url}/compare/${c.slug}`,
    dateModified: c.updated,
  };

  return (
    <div className="space-y-8 pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div>
        <p className="text-sm text-violet-300">Comparison</p>
        <h1 className="mt-1 text-4xl font-bold text-white">{c.title}</h1>
        <p className="mt-3 max-w-3xl text-gray-400">{c.summary}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ToolCard tool={a} />
        <ToolCard tool={b} />
      </div>

      <section className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="px-4 py-3 font-medium">Factor</th>
              <th className="px-4 py-3 font-medium">{a.name}</th>
              <th className="px-4 py-3 font-medium">{b.name}</th>
            </tr>
          </thead>
          <tbody>
            {c.points.map((p) => (
              <tr key={p.label} className="border-t border-white/10 align-top">
                <td className="px-4 py-3 font-medium text-white">{p.label}</td>
                <td className="px-4 py-3 text-gray-300">{p.a}</td>
                <td className="px-4 py-3 text-gray-300">{p.b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white">Pick {a.name} if…</h2>
          <p className="mt-2 text-sm text-gray-400">{c.pickA}</p>
          <Link href={`/tools/${a.slug}`} className="mt-4 inline-block text-sm text-cyan-400 hover:underline">
            {a.name} details →
          </Link>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white">Pick {b.name} if…</h2>
          <p className="mt-2 text-sm text-gray-400">{c.pickB}</p>
          <Link href={`/tools/${b.slug}`} className="mt-4 inline-block text-sm text-cyan-400 hover:underline">
            {b.name} details →
          </Link>
        </div>
      </section>

      <p className="text-sm">
        <Link href="/compare" className="text-cyan-400 hover:underline">← All comparisons</Link>
      </p>

      <p className="text-xs text-gray-600">
        Updated {c.updated} on {SITE.name}. Pricing and features change; check each official site before you buy.
      </p>
    </div>
  );
}
