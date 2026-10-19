import Link from "next/link";
import type { Metadata } from "next";
import { allComparisonViews } from "@/lib/compare";
import { SITE } from "@/lib/config";

const title = "AI tool comparisons for builders and vibe coders";
const description =
  "Side-by-side comparisons of popular AI coding agents and app builders: pricing, models, open source, IDE vs CLI, and which to pick for your project.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/compare" },
  openGraph: { title, description },
};

export default function ComparePage() {
  const views = allComparisonViews();
  const popular = views.filter((v) => !v.c.madness);
  const madness = views.filter((v) => v.c.madness);
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    url: `${SITE.url}/compare`,
    itemListElement: views.map((v, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE.url}/compare/${v.c.slug}`, name: v.title })),
  };
  const grid = (list: typeof views) => (
    <div className="grid gap-4 sm:grid-cols-2">
      {list.map((v) => (
        <Link key={v.c.slug} href={`/compare/${v.c.slug}`} className="card p-6">
          <div className="text-lg font-semibold text-white">{v.title}</div>
          <div className="mt-1 text-sm text-gray-400">{v.c.summary.split(". ")[0]}.</div>
          <div className="mt-3 text-xs text-gray-500">Updated {v.c.updated}</div>
        </Link>
      ))}
    </div>
  );
  return (
    <div className="space-y-10 pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div>
        <h1 className="text-4xl font-bold text-white">AI tool comparisons</h1>
        <p className="mt-3 max-w-3xl text-gray-400">{description}</p>
        <p className="mt-2 text-sm text-gray-500">{views.length} comparisons, fact-checked against official pricing pages.</p>
      </div>
      <section>
        <h2 className="mb-4 text-2xl font-semibold text-white">Popular comparisons</h2>
        {grid(popular)}
      </section>
      <section>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl font-semibold text-white">🏀 AI Madness Round of 32 matchups</h2>
          <Link href="/madness" className="text-sm text-cyan-400 hover:underline">See the bracket and vote →</Link>
        </div>
        {grid(madness)}
      </section>
      <p className="text-sm text-gray-400">
        Looking for something else? <Link href="/#categories" className="text-cyan-400 hover:underline">Browse tools by use case</Link>.
      </p>
    </div>
  );
}
