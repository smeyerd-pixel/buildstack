import { tools, categories, toolsIn } from "@/lib/data";
import { comparisons } from "@/data/comparisons";
import { SITE } from "@/lib/config";
export const dynamic = "force-static";
export function GET() {
  const body = [`# ${SITE.name}`, "", `> ${SITE.tagline}. ${tools.length} curated AI tools organized by use case, with pricing notes and a short verdict on what each is best for.`, "",
    ...categories.flatMap((c) => [`## ${c.name}`, c.description, ...toolsIn(c.slug).map((t) => `- [${t.name}](${SITE.url}/tools/${t.slug}): ${t.verdict} Pricing: ${t.pricing}. Official site: ${t.url}`), ""]),
    "## Comparisons", ...comparisons.map((c) => `- [${c.title}](${SITE.url}/compare/${c.slug}): ${c.description}`), "",
    "## Other", `- [Sponsor / featured listings](${SITE.url}/sponsor)`].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
