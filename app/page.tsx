import Link from "next/link";
import Search from "@/components/Search";
import ToolCard from "@/components/ToolCard";
import FeaturedSlot from "@/components/FeaturedSlot";
import Newsletter from "@/components/Newsletter";
import { tools, categories, newest, toolsIn } from "@/lib/data";
import { comparisons } from "@/data/comparisons";
import { allComparisonViews } from "@/lib/compare";
import { SITE } from "@/lib/config";
export default function Home() {
  const ld = { "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: SITE.url, description: SITE.tagline, publisher: { "@type": "Organization", name: SITE.name, url: SITE.url, email: SITE.contactEmail } };
  return (
    <div className="space-y-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="pt-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">The right AI tool for <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">what you&apos;re building</span></h1>
        <p className="mx-auto mt-4 max-w-2xl text-gray-400">{tools.length}+ hand-picked AI tools for vibe coders and builders, organized by use case, updated daily.</p>
      </section>
      <FeaturedSlot />
      <Link href="/madness" className="card flex flex-col gap-4 border-violet-400/40 p-5 sm:flex-row sm:items-center sm:justify-between"><div><span className="chip text-violet-300">🏀 New · AI Madness 2026</span><div className="mt-2 text-lg font-semibold text-white">The coding agent bracket: 32 tools, you pick the champion</div><div className="text-sm text-gray-400">Cursor, Claude Code, Codex, OpenCode, Copilot, Lovable and more go head to head. Round of 32 voting opens Mon Oct 26.</div></div><span className="btn shrink-0">See the bracket →</span></Link>
      <Link href="/top100" className="card flex items-center justify-between p-5"><div><span className="chip text-violet-300">New · weekly chart</span><div className="mt-2 text-lg font-semibold text-white">MCP &amp; Skills Top 100</div><div className="text-sm text-gray-400">The top MCP servers, Agent Skills and Claude Code add-ons, ranked every week.</div></div><span className="btn">See the chart →</span></Link>
      <section><h2 className="mb-4 text-2xl font-semibold text-white">New releases</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{newest(4).map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
        <p className="mt-3 text-sm"><Link href="/new" className="text-cyan-400 hover:underline">All new tools, day by day →</Link></p></section>
      {comparisons.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-white">Comparisons</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {allComparisonViews().filter((v) => !v.c.madness).slice(0, 6).map((v) => (
              <Link key={v.c.slug} href={`/compare/${v.c.slug}`} className="card">
                <div className="font-semibold text-white">{v.title}</div>
                <div className="mt-1 text-sm text-gray-400">{v.c.summary.split(". ")[0]}.</div>
              </Link>
            ))}
          </div>
          <p className="mt-3 text-sm"><Link href="/compare" className="text-cyan-400 hover:underline">All {comparisons.length} comparisons →</Link></p>
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
