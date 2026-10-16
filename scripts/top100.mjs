// Builds the MCP & Skills Top 100 from real public data (GitHub search API + npm downloads API).
// Usage: GITHUB_TOKEN=... node scripts/top100.mjs   (token optional; raises rate limit)
import fs from "node:fs"; import path from "node:path";
const DIR = path.join(process.cwd(), "data/top100");
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const gh = async (url) => { const r = await fetch(url, { headers: { Accept: "application/vnd.github+json", "User-Agent": "buildstack-top100", ...(token ? { Authorization: `Bearer ${token}` } : {}) } }); if (!r.ok) throw new Error(`${r.status} ${url}`); return r.json(); };
const QUERIES = [
  ["topic:mcp-server", "MCP"], ["topic:model-context-protocol", "MCP"], ["topic:mcp", "MCP"],
  ["topic:claude-skills", "Skill"], ["topic:agent-skills", "Skill"], ["topic:claude-skill", "Skill"],
  ["topic:claude-code", "Claude Code add-on"],
];
const repos = new Map();
for (const [q, cat] of QUERIES) for (const page of [1, 2]) {
  const d = await gh(`https://api.github.com/search/repositories?q=${encodeURIComponent(q + " archived:false")}&sort=stars&order=desc&per_page=100&page=${page}`);
  for (const r of d.items) {
    const t = r.topics || [];
    // category precedence: explicit skill topics > mcp > claude-code
    let c = t.some((x) => /skill/.test(x)) ? "Skill" : t.some((x) => /^mcp|model-context-protocol/.test(x)) ? "MCP" : cat;
    if (!repos.has(r.full_name)) repos.set(r.full_name, { name: r.name, full_name: r.full_name, url: r.html_url, description: (r.description || "").replace(/\s+/g, " ").trim().slice(0, 160), stars: r.stargazers_count, forks: r.forks_count, pushed_at: r.pushed_at, created_at: r.created_at, homepage: r.homepage || null, category: c, topics: t.slice(0, 8) });
  }
}
// Exclude generic lists/awesome-collections? Keep them but they're real repos. Skip forks of nothing; skip if no description.
let all = [...repos.values()].filter((r) => r.description);
// previous snapshot for deltas
const snaps = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort() : [];
const today = new Date().toISOString().slice(0, 10);
const prevFile = snaps.filter((f) => f.replace(".json", "") < today).pop();
const prev = prevFile ? JSON.parse(fs.readFileSync(path.join(DIR, prevFile), "utf8")) : null;
const prevBy = new Map((prev?.entries || []).map((e) => [e.full_name, e]));
// score: stars (log) + recent activity + weekly star delta when known
const now = Date.now();
for (const r of all) {
  const days = (now - Date.parse(r.pushed_at)) / 864e5;
  const p = prevBy.get(r.full_name);
  r.star_delta = p ? r.stars - p.stars : null;
  r.score = Math.log10(r.stars + 1) * 10 + (days < 7 ? 3 : days < 30 ? 1.5 : days > 180 ? -4 : 0) + (r.star_delta ? Math.log10(Math.max(r.star_delta, 0) + 1) * 6 : 0);
}
all.sort((a, b) => b.score - a.score);
const top = all.slice(0, 100);
// npm weekly downloads: only check package names that equal repo name or scoped owner/name — verify repo link matches
for (const r of top) {
  const [owner, name] = r.full_name.split("/");
  for (const pkg of [`@${owner.toLowerCase()}/${name.toLowerCase()}`, name.toLowerCase()]) {
    try {
      const meta = await fetch(`https://registry.npmjs.org/${pkg.replace("/", "%2F")}/latest`).then((x) => x.ok ? x.json() : null);
      const repoUrl = (typeof meta?.repository === "string" ? meta.repository : meta?.repository?.url || "").toLowerCase();
      if (!meta || !repoUrl.includes(r.full_name.toLowerCase())) continue;
      const dl = await fetch(`https://api.npmjs.org/downloads/point/last-week/${pkg}`).then((x) => x.ok ? x.json() : null);
      if (dl?.downloads != null) { r.npm = { package: pkg, weekly_downloads: dl.downloads }; break; }
    } catch {}
  }
}
top.forEach((r, i) => { r.rank = i + 1; const p = prevBy.get(r.full_name); r.prev_rank = p ? p.rank : null; r.is_new = !!prev && !p; delete r.score; });
const out = { week: today, generated_at: new Date().toISOString(), previous_week: prev?.week || null, source: "GitHub REST search API + npm downloads API", candidates: all.length, entries: top };
fs.mkdirSync(DIR, { recursive: true });
fs.writeFileSync(path.join(DIR, `${today}.json`), JSON.stringify(out, null, 1));
fs.writeFileSync(path.join(DIR, "latest.json"), JSON.stringify(out, null, 1));
console.log(`wrote ${top.length} entries from ${all.length} candidates; prev=${prev?.week || "none"}`);
