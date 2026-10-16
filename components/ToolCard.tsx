import Link from "next/link";
import type { Tool } from "@/data/tools";
import { getCategory } from "@/data/categories";
export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div className={`card flex flex-col gap-3 ${tool.featured ? "border-amber-400/50" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <Link href={`/tools/${tool.slug}`} className="text-lg font-semibold text-white hover:text-violet-300">{tool.name}</Link>
        {tool.featured && <span className="chip border-amber-400/50 text-amber-300">Featured</span>}
      </div>
      <p className="text-sm text-gray-400">{tool.verdict}</p>
      <div className="mt-auto flex flex-wrap gap-1.5">
        {tool.categories.map((c) => <Link key={c} href={`/use-case/${c}`} className="chip hover:text-white">{getCategory(c)?.name}</Link>)}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{tool.pricing}</span>
        <a href={tool.url} target="_blank" rel="noopener" className="text-cyan-400 hover:underline">Visit ↗</a>
      </div>
    </div>
  );
}
