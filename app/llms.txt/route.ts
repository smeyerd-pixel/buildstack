import { tools, categories, toolsIn } from "@/lib/data";
import { comparisons } from "@/data/comparisons";
import { SITE } from "@/lib/config";
export const dynamic = "force-static";
export function GET() {
  const body = [`# ${SITE.name}`, "", `> ${SITE.tagline}. ${tools.length} curated AI tools organized by use case, with pricing notes and a short verdict on what each is best for.`, "",
    ...categories.flatMap((c) => [`## ${c.name}`, c.description, ...toolsIn(c.slug).map((t) => `- [${t.name}](${SITE.url}/tools/${t.slug}): ${t.verdict} Pricing: ${t.pricing}. Official site: ${t.url}`), ""]),
    "## Comparisons", `- [All comparisons](${SITE.url}/compare): side-by-side comparisons of popular AI tools for builders.`, ...comparisons.map((c) => `- [${c.title}](${SITE.url}/compare/${c.slug}): ${c.description}`), "",
    "## Other", `- [MCP & Skills Top 100](${SITE.url}/top100): weekly chart of the top 100 MCP servers, Agent Skills and Claude Code add-ons, ranked from GitHub stars, weekly momentum and npm downloads.`, `- [Sponsor / featured listings](${SITE.url}/sponsor)`].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
