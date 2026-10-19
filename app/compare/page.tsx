import Link from "next/link";
import type { Metadata } from "next";
import { comparisons } from "@/data/comparisons";
import { getTool } from "@/lib/data";
import { SITE } from "@/lib/config";

const title = "AI tool comparisons for builders and vibe coders";
const description =
  "Side-by-side comparisons of popular AI coding agents and builder tools: features, pricing shape, models, and which to pick for your project.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/compare" },
  openGraph: { title, description },
};

export default function ComparePage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    url: `${SITE.url}/compare`,
    itemListElement: comparisons.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE.url}/compare/${c.slug}`,
      name: c.title,
    })),
  };
  return (
    <div className="space-y-8 pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div>
        <h1 className="text-4xl font-bold text-white">AI tool comparisons</h1>
        <p className="mt-3 max-w-3xl text-gray-400">{description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {comparisons.map((c) => {
          const a = getTool(c.toolA);
          const b = getTool(c.toolB);
          return (
            <Link key={c.slug} href={`/compare/${c.slug}`} className="card p-6">
              <div className="text-lg font-semibold text-white">{c.title}</div>
              <div className="mt-1 text-sm text-gray-400">{c.description}</div>
              <div className="mt-3 text-xs text-gray-500">
                {a?.name} · {b?.name} · Updated {c.updated}
              </div>
            </Link>
          );
        })}
      </div>
      <p className="text-sm text-gray-400">
        Looking for something else? <Link href="/#categories" className="text-cyan-400 hover:underline">Browse tools by use case</Link>.
      </p>
    </div>
  );
}
