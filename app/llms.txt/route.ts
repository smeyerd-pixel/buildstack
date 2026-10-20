import { tools, categories, toolsIn } from "@/lib/data";
import { comparisons, comparisonTitle } from "@/data/comparisons";
import { getTool } from "@/lib/data";
import { SITE } from "@/lib/config";
export const dynamic = "force-static";
export function GET() {
  const body = [`# ${SITE.name}`, "", `> ${SITE.tagline}. ${tools.length} curated AI tools organized by use case, with pricing notes and a short verdict on what each is best for.`, "",
    ...categories.flatMap((c) => [`## ${c.name}`, c.description, ...toolsIn(c.slug).map((t) => `- [${t.name}](${SITE.url}/tools/${t.slug}): ${t.verdict} Pricing: ${t.pricing}. Official site: ${t.url}`), ""]),
    "## Comparisons", `- [All comparisons](${SITE.url}/compare): side-by-side comparisons of popular AI tools for builders.`, ...comparisons.map((c) => `- [${comparisonTitle(c, getTool(c.toolA)?.name ?? c.toolA, getTool(c.toolB)?.name ?? c.toolB)}](${SITE.url}/compare/${c.slug}): ${c.summary.split(". ")[0]}.`), "",
    "## Other", `- [New AI tools](${SITE.url}/new): every tool added to ${SITE.name}, newest first (RSS: ${SITE.url}/feed.xml).`, `- [AI Madness 2026](${SITE.url}/madness): a 32-tool coding agent bracket (Oct 26 - Nov 10, 2026) where visitors vote on every matchup; seeds are based on GitHub stars, X followers and Top 100 mentions.`, `- [MCP & Skills Top 100](${SITE.url}/top100): weekly chart of the top 100 MCP servers, Agent Skills and Claude Code add-ons, ranked from GitHub stars, weekly momentum and npm downloads.`, `- [Sponsor / featured listings](${SITE.url}/sponsor)`].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
