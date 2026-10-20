import Link from "next/link";
import type { Metadata } from "next";
import ToolCard from "@/components/ToolCard";
import Newsletter from "@/components/Newsletter";
import { toolsByDate, latestAddedDate, fmtDate } from "@/lib/newTools";
import { SITE } from "@/lib/config";

const groups = toolsByDate();
const latest = latestAddedDate();
const latestNames = groups[0]?.tools.map((t) => t.name).slice(0, 4).join(", ") ?? "";
const title = "New AI tools for builders and vibe coders (updated daily)";
const description = `The newest AI tools added to ${SITE.name}, day by day: coding agents, app builders, MCP tools and more. Latest (${fmtDate(latest)}): ${latestNames}.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/new", types: { "application/rss+xml": `${SITE.url}/feed.xml` } },
  openGraph: { title, description },
};

export default function NewToolsPage() {
  const recent = groups.slice(0, 3).flatMap((g) => g.tools);
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    url: `${SITE.url}/new`,
    dateModified: latest,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: recent.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE.url}/tools/${t.slug}`, name: t.name })),
    },
  };
  return (
    <div className="space-y-10 pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div>
        <h1 className="text-4xl font-bold text-white">New AI tools</h1>
        <p className="mt-2 max-w-3xl text-gray-400">
          Every tool we add to {SITE.name}, newest first. We check each one against its official site before listing it. Follow along with the{" "}
          <a href="/feed.xml" className="text-cyan-400 hover:underline">RSS feed</a>, or browse by <Link href="/#categories" className="text-cyan-400 hover:underline">use case</Link>.
        </p>
      </div>
      {groups.map((g) => (
        <section key={g.date} id={g.date}>
          <h2 className="mb-4 text-2xl font-semibold text-white">
            Added {fmtDate(g.date)} <span className="text-base font-normal text-gray-500">· {g.tools.length} tools</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{g.tools.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
        </section>
      ))}
      <Newsletter />
    </div>
  );
}
