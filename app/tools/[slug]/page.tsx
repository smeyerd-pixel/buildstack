import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ToolCard from "@/components/ToolCard";
import { tools, getTool, getCategory, toolsIn } from "@/lib/data";
import { comparisonsForTool } from "@/data/comparisons";
import { SITE } from "@/lib/config";
export const generateStaticParams = () => tools.map((t) => ({ slug: t.slug }));
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = getTool((await params).slug); if (!t) return {};
  const title = `${t.name}: what it's best for, pricing & alternatives`;
  return { title, description: t.verdict, alternates: { canonical: `/tools/${t.slug}` }, openGraph: { title, description: t.verdict } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const t = getTool((await params).slug); if (!t) notFound();
  const alts = toolsIn(t.categories[0]).filter((x) => x.slug !== t.slug).slice(0, 3);
  const comps = comparisonsForTool(t.slug);
  const ld = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: t.name, url: t.url, applicationCategory: getCategory(t.categories[0])?.name, description: t.verdict, offers: { "@type": "Offer", description: t.pricing } };
  return (
    <div className="space-y-8 pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="card space-y-4 p-8">
        <h1 className="text-4xl font-bold text-white">{t.name}</h1>
        <p className="text-lg text-gray-300">{t.verdict}</p>
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div><dt className="text-gray-500">Pricing</dt><dd>{t.pricing}</dd></div>
          <div><dt className="text-gray-500">Use cases</dt><dd className="flex flex-wrap gap-1.5">{t.categories.map((c) => <Link key={c} className="chip" href={`/use-case/${c}`}>{getCategory(c)?.name}</Link>)}</dd></div>
          <div><dt className="text-gray-500">Added</dt><dd>{t.added}</dd></div>
        </dl>
        <a href={t.url} target="_blank" rel="noopener" className="btn">Visit {t.name} ↗</a>
        {comps.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 text-sm">
            {comps.map((cmp) => (
              <Link key={cmp.slug} href={`/compare/${cmp.slug}`} className="text-cyan-400 hover:underline">
                {cmp.title} →
              </Link>
            ))}
          </div>
        )}
      </div>
      {alts.length > 0 && <section><h2 className="mb-4 text-2xl font-semibold text-white">Alternatives to {t.name}</h2>
        <div className="grid gap-4 sm:grid-cols-3">{alts.map((a) => <ToolCard key={a.slug} tool={a} />)}</div></section>}
      <p className="text-xs text-gray-600">Listing on {SITE.name}. Details may change; check the official site.</p>
    </div>
  );
}
