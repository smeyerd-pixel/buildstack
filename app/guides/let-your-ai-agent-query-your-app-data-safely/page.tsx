import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("let-your-ai-agent-query-your-app-data-safely")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Never paste your live database URL into the agent", text: "Your main DATABASE_URL can change and delete data. Keep it out of prompts, .env files the agent reads and MCP configs. Everything below gives the agent something safer instead." },
  { name: "Build and test against a throwaway Postgres", text: "Download minipg, then run minipg run app.pgdb -- npm run dev. Your app gets a real Postgres with DATABASE_URL set, the agent can create tables and fake data, and when it makes a mess you delete the app.pgdb folder." },
  { name: "Make a read-only copy of the real data with Mason", text: "npm i -g @mason-data/cli, then mason init with your database URL and mason add only the tables the agent needs. Mason skips columns that look like secrets, keeps the copy in sync and answers counts and totals fast without loading your live database." },
  { name: "Give the agent its own limited login", text: "In mason/roles.yml, give an agent role only the tables and columns it needs (no emails or phone numbers), run mason user add claude --role agent, and connect it with claude mcp add mason. Every Mason user is read-only and exists only in Mason." },
  { name: "Check what it asked, then switch it off", text: "Run mason logs --requests --failed or mason ui to see every query and who sent it. Disable the login with mason user disable claude when you're done, or wipe the copy with mason stop && mason destroy." },
];
const faq = [
  { q: "Can my AI agent delete data through Mason?", a: "No. Every Mason user is read-only and exists only in Mason, never in your real database. A query for a table or column outside the user's role is refused with an error instead of quietly returning less. What can still go wrong is the database URL you give Mason itself: keep that in your .env file (Mason's sources file only stores ${DATABASE_URL}), and if you can, create a separate read-only Postgres user for Mason to sync with." },
  { q: "Is minipg safe for my real app?", a: "Not yet. Its maker calls it early and says not to trust it with data you can't recreate. Use it as a scratch database for building and tests, and keep real customer data in your hosted Postgres (Supabase, Neon, RDS and so on)." },
  { q: "Do I need to know SQL?", a: "No. Once Mason's MCP server is connected, ask in plain English (\"how many people signed up each week since September?\") and the agent lists the tables, writes the SQL and runs it. Mason's tools also include EXPLAIN, and if Mason can't answer a query exactly, the agent gets an error telling it what to write instead." },
  { q: "My app is on Supabase. Does this work?", a: "Yes. Supabase is regular Postgres: copy the connection string from the dashboard (Connect button) into your .env file as DATABASE_URL and point mason init at it. Mason's logical replication option needs a replication slot; the default polling or on-demand sync doesn't. For checking who can read what inside Supabase itself, see our data-leak guide." },
  { q: "What does this cost?", a: "minipg and Mason are free and open source (MIT and Apache-2.0) when you run them yourself; Mason also has a hosted Mason Cloud you can try free. The agent's own model usage is billed as normal, and Koed (below) can cut that by remembering your project between sessions." },
  { q: "What about Supabase MCP or a direct Postgres MCP server?", a: "They're fine for building on a development project. For questions about real customers, a separate read-only copy with per-agent roles (Mason) or a branch you can throw away (db-branch) means a wrong query can't touch production, and it can't slow your live app down either." },
];
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
const roles = `# mason/roles.yml  (mason init writes this file; edit it and commit it)
default: everything        # delete this line so a user with no role reads nothing
roles:
  everything:
    tables: all
  agent:                   # what your AI agent may read
    tables:
      orders:    { columns: [id, status, amount, created_at] }
      customers: { exclude: [email, phone] }`;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to let your AI agent answer questions about your app's data safely", description: g.description, totalTime: "PT30M",
      tool: ["minipg", "Mason", "Claude Code", "Koed", "CodeRabbit Verify"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["mason", "minipg", "koed", "coderabbit-verify", "db-branch", "supabase"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to let your AI agent answer questions about your app&apos;s data (without touching your live database)</h1>
      <p className="text-lg text-gray-400">A plain-English guide for vibe coders and small teams. About a 6-minute read. Updated November 26, 2026.</p>
      <p>&quot;How many people signed up this week?&quot; &quot;Which customers haven&apos;t paid?&quot; Your AI agent can answer that in seconds, if it can see your database. The risky shortcut is pasting your live database URL into Claude Code or Cursor: that same URL can also change and delete data. Two open-source tools that hit Hacker News this week make the safe way easy: <T s="minipg">minipg</T> gives your agent a throwaway Postgres to build against, and <T s="mason">Mason</T> gives it a read-only copy of your real data with its own limited login.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="never">Step 1: Keep the live database URL away from the agent</H2>
      <p>The connection string your app uses (often <code>DATABASE_URL</code>) usually belongs to a user that can do <i>anything</i>: insert, update, drop tables. Agents make mistakes, and some have deleted real databases (see <Link className="underline" href="/guides/stop-ai-agent-deleting-your-database">how to stop your agent deleting your database</Link>). So: don&apos;t paste it into a chat, don&apos;t put it in an MCP config, and keep your <code>.env</code> file out of Git. Give the agent one of the two safer options below instead.</p>

      <H2 id="minipg">Step 2: A throwaway Postgres for building and tests (minipg)</H2>
      <p><T s="minipg">minipg</T> is real PostgreSQL 18 as a single program, with no Docker and no server to set up. Download the file for your computer from its GitHub releases page (Linux, Windows or Apple Silicon Mac), then in your project folder:</p>
      <Code>{"minipg app.pgdb                     # creates the database folder and opens a SQL shell\nminipg run app.pgdb -- npm run dev  # starts your app with DATABASE_URL already set\nminipg url app.pgdb                 # prints the connection URL, if a tool asks for one\nminipg dump app.pgdb > backup.sql   # a backup you can restore later"}</Code>
      <p>Now tell your agent: <i>&quot;Use the local database from minipg. Create the tables, add 50 rows of realistic fake data and test the signup flow.&quot;</i> If it breaks something, stop the app and delete the <code>app.pgdb</code> folder. Two honest caveats: it&apos;s early software (about 2x slower than normal Postgres on its fallback mode), and the maker says not to keep data in it you can&apos;t recreate. On Windows, switch on <b>Windows Hypervisor Platform</b> first. Running a big server instead? <T s="db-branch">db-branch</T> makes instant throwaway copies of a full MySQL or Postgres database.</p>

      <H2 id="mason">Step 3: A read-only copy of your real data (Mason)</H2>
      <p>For questions about real customers, <T s="mason">Mason</T> syncs the tables you choose from your Postgres (Supabase, Neon, RDS, your own server) into a fast local copy that speaks normal Postgres SQL. You need Node 22.13 or later:</p>
      <Code>{"npm i -g @mason-data/cli\ncd my-app\nmason init demo && mason start   # optional: try it first on a built-in demo shop\nmason stop && mason destroy\n\nmason init \"$DATABASE_URL\"         # your real database (keep the URL in .env)\nmason add orders customers         # only the tables your questions need\nmason start && mason wait          # waits for the first sync"}</Code>
      <p><code>mason add</code> leaves out columns that look like secrets (password, token, api_key and so on). For a big table you can sync just some columns, for example <code>mason add orders --columns id,status,amount,created_at</code>. Counts, totals and group-bys over millions of rows come back in a fraction of a second (the makers measured 0.19 s versus 15.7 s on Postgres for a count over 10 million rows), and none of that load hits your live app. Looking up a single row is slower than Postgres, which is fine for questions.</p>

      <H2 id="login">Step 4: Give the agent its own limited, read-only login</H2>
      <p>Open <code>mason/roles.yml</code> and give your agent a role that only sees what it needs:</p>
      <Code>{roles}</Code>
      <p>Then create the agent&apos;s login and connect it to Claude Code (run this in the project folder while Mason is running):</p>
      <Code>{"mason user add claude --role agent   # prints a connection URL with a password, once\nclaude mcp add mason --env MASON_URL=\"postgres://claude:<password>@127.0.0.1:5433/mason\" -- mason mcp"}</Code>
      <p>Now ask in plain English: <i>&quot;Using the mason tools, how many orders did we get per week since September, and what was the total?&quot;</i> If the agent tries a column it isn&apos;t allowed to see, Mason refuses the query instead of quietly hiding it. Building a dashboard for customers? A role can also filter rows (say, only one customer&apos;s orders). New to MCP? See <Link className="underline" href="/guides/add-mcp-servers-to-claude-code-and-codex">how to add MCP servers to Claude Code and Codex</Link>.</p>

      <H2 id="check">Step 5: See what it asked, then switch it off</H2>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-white"><tr><th className="py-2 pr-4">You want to…</th><th className="py-2">Run</th></tr></thead><tbody className="divide-y divide-white/10">
        <tr><td className="py-2 pr-4">See every query and who sent it, in a browser</td><td className="py-2"><code>mason ui</code></td></tr>
        <tr><td className="py-2 pr-4">See queries that were refused or failed, and why</td><td className="py-2"><code>mason logs --requests --failed</code></td></tr>
        <tr><td className="py-2 pr-4">Pause the agent&apos;s access (keeps its password)</td><td className="py-2"><code>mason user disable claude</code></td></tr>
        <tr><td className="py-2 pr-4">Remove the agent&apos;s login for good</td><td className="py-2"><code>mason user remove claude</code></td></tr>
        <tr><td className="py-2 pr-4">Stop and delete the synced copy of your data</td><td className="py-2"><code>mason stop &amp;&amp; mason destroy</code></td></tr>
      </tbody></table></div>
      <p>Mason is pre-1.0, so a release may rename a command; check its README before upgrading.</p>

      <H2 id="extras">Two more new tools that pair well</H2>
      <ul className="list-disc space-y-2 pl-6">
        <li><b>Stop re-explaining your schema:</b> <T s="koed">Koed</T> (#7 on Product Hunt on November 25, 2026) records your Claude Code, Codex and Pi sessions on your own computer and gives the next session a searchable memory, so the agent remembers which tables matter and which queries worked. Free and open source; the makers measured 69% fewer tokens on repeat tasks.</li>
        <li><b>Check the app still works after the agent&apos;s change:</b> <T s="coderabbit-verify">CodeRabbit Verify</T> runs your app in a sandbox and tests it like a user on each pull request (comment <code>@coderabbitai verify</code>), with recordings and screenshots. Test runs are free during the public beta.</li>
      </ul>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Never hand the agent your live database URL.</li><li>Build and test on a throwaway minipg database; delete the folder when it gets messy.</li><li>Answer real questions from a Mason read-only copy, with a per-agent role that hides private columns, and check the query log.</li></ul>
      <p className="text-sm text-gray-500">Related: <Link className="underline" href="/guides/stop-ai-agent-deleting-your-database">stop your agent deleting your database</Link>, <Link className="underline" href="/guides/let-your-ai-agent-set-up-your-app-backend">let your agent set up your app&apos;s backend</Link>, <Link className="underline" href="/guides/check-your-lovable-app-for-data-leaks">check your app for data leaks</Link>, <Link className="underline" href="/guides/cut-your-ai-agent-token-bill">cut your agent&apos;s token bill</Link>, <Link className="underline" href="/use-case/deployment-backend">best backend tools</Link>, or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
