import Link from "next/link";
import Search from "@/components/Search";
import ToolCard from "@/components/ToolCard";
import FeaturedSlot from "@/components/FeaturedSlot";
import Newsletter from "@/components/Newsletter";
import { tools, categories, newest, toolsIn } from "@/lib/data";
import { comparisons } from "@/data/comparisons";
import { SITE } from "@/lib/config";
export default function Home() {
  const ld = { "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: SITE.url, description: SITE.tagline };
  return (
    <div className="space-y-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="pt-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">The right AI tool for <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">what you&apos;re building</span></h1>
        <p className="mx-auto mt-4 max-w-2xl text-gray-400">{tools.length}+ hand-picked AI tools for vibe coders and builders, organized by use case, updated daily.</p>
      </section>
      <FeaturedSlot />
      <section><h2 className="mb-4 text-2xl font-semibold text-white">New releases</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{newest(4).map((t) => <ToolCard key={t.slug} tool={t} />)}</div></section>
      {comparisons.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-white">Comparisons</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {comparisons.map((c) => (
              <Link key={c.slug} href={`/compare/${c.slug}`} className="card">
                <div className="font-semibold text-white">{c.title}</div>
                <div className="mt-1 text-sm text-gray-400">{c.description}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section id="categories"><h2 className="mb-4 text-2xl font-semibold text-white">Browse by use case</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{categories.map((c) => (
          <Link key={c.slug} href={`/use-case/${c.slug}`} className="card"><div className="font-semibold text-white">{c.name}</div><div className="text-xs text-gray-500">{toolsIn(c.slug).length} tools</div></Link>))}</div></section>
      <Newsletter />
      <section><h2 className="mb-4 text-2xl font-semibold text-white">Find a tool</h2><Search tools={tools} categories={categories} /></section>
    </div>
  );
}
