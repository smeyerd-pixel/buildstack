import { comparisons, comparisonTitle, type Comparison } from "@/data/comparisons";
import { getFacts } from "@/data/toolFacts";
import { getTool } from "@/lib/data";

export function viewComparison(c: Comparison) {
  const a = getTool(c.toolA);
  const b = getTool(c.toolB);
  if (!a || !b) return null;
  const title = comparisonTitle(c, a.name, b.name);
  const description =
    c.description ??
    `${a.name} vs ${b.name} (2026): pricing, models, open source, IDE vs CLI, and which one to pick. A plain-English comparison for builders and vibe coders.`;
  return { c, a, b, fa: getFacts(a.slug), fb: getFacts(b.slug), title, description };
}

export const allComparisonViews = () =>
  comparisons.map(viewComparison).filter((v): v is NonNullable<ReturnType<typeof viewComparison>> => v !== null);

export const relatedComparisons = (c: Comparison, n = 6) =>
  allComparisonViews()
    .filter((v) => v.c.slug !== c.slug && [v.c.toolA, v.c.toolB].some((t) => t === c.toolA || t === c.toolB))
    .slice(0, n);
