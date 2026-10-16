import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ToolCard from "@/components/ToolCard";
import FeaturedSlot from "@/components/FeaturedSlot";
import Newsletter from "@/components/Newsletter";
import { categories, getCategory, toolsIn } from "@/lib/data";
import { SITE } from "@/lib/config";
export const generateStaticParams = () => categories.map((c) => ({ slug: c.slug }));
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCategory((await params).slug); if (!c) return {};
  const title = `Best AI ${c.name} Tools for Builders`;
  return { title, description: c.description, alternates: { canonical: `/use-case/${c.slug}` }, openGraph: { title, description: c.description } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCategory((await params).slug); if (!c) notFound();
  const list = toolsIn(c.slug);
  const ld = { "@context": "https://schema.org", "@type": "ItemList", name: `AI ${c.name} tools`, itemListElement: list.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE.url}/tools/${t.slug}`, name: t.name })) };
  return (
    <div className="space-y-8 pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div><h1 className="text-4xl font-bold text-white">Best AI {c.name} tools</h1><p className="mt-2 text-gray-400">{c.description}</p></div>
      <FeaturedSlot cat={c.slug} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
      <Newsletter />
    </div>
  );
}
