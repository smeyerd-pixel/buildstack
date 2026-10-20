import { tools } from "@/data/tools";
import type { Tool } from "@/data/tools";
// Groups tools by the date they were added (newest first; within a day, latest appended first).
export function toolsByDate(): { date: string; tools: Tool[] }[] {
  const map = new Map<string, Tool[]>();
  tools.forEach((t) => { const l = map.get(t.added) ?? []; l.unshift(t); map.set(t.added, l); });
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0])).map(([date, list]) => ({ date, tools: list }));
}
export const latestAddedDate = () => tools.map((t) => t.added).sort().at(-1) ?? "";
export const fmtDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
