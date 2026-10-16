import { tools } from "@/data/tools";
import { categories, getCategory } from "@/data/categories";
export { tools, categories, getCategory };
export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
export const toolsIn = (cat: string) => tools.filter((t) => t.categories.includes(cat));
export const newest = (n = 8) => [...tools].map((t, i) => ({ t, i })).sort((a, b) => b.t.added.localeCompare(a.t.added) || b.i - a.i).slice(0, n).map((x) => x.t);
export const featured = (cat?: string) => tools.filter((t) => t.featured && (!cat || t.categories.includes(cat)));
