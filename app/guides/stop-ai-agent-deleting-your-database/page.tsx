import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("stop-ai-agent-deleting-your-database")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Make a backup you know how to restore", text: "Before you let an agent near your data, take a backup and try restoring it once into a spare database. A backup you have never restored is a hope, not a backup. Most hosts (Supabase, Railway, Convex and others) also have their own backup or restore options; check what your plan includes today, not after something breaks." },
  { name: "Give the agent its own development database", text: "Create a second, throwaway database for building and testing, and put only its connection string in the project's local .env file. Keep the production connection string in your hosting provider's settings, where the agent never sees it. If the agent wipes the dev database, you lose test data, not customers." },
  { name: "Use a read-only login when it needs to look at real data", text: "Sometimes the agent genuinely needs to see production data to debug. Give it a database user that can only read (SELECT), never write or drop. The SQL is below; it is standard PostgreSQL and works on Supabase, Neon, Railway and most Postgres hosts." },
  { name: "Make destructive commands wait for a human", text: "Keep your agent's permission prompts on for anything that touches the database, and read the command before you click Allow; words like DROP, TRUNCATE, DELETE without WHERE, reset or --force are your cue to stop. A backend built for agents, like Backenly, goes further: drops and other destructive changes never run until a person approves them." },
  { name: "Change the schema through migrations you review", text: "Ask the agent to write schema changes as migration files in your repo instead of running SQL directly. Read each migration (what tables or columns does it add, rename or remove?), commit it, run it on the dev database first, and only then apply it to production." },
];
const faq = [
  { q: "Does this really happen?", a: "Yes. Coding agents are good at following instructions literally. Asked to \"start fresh\" or \"fix the migration\", an agent can decide the quickest route is to reset or drop tables, and if it is holding your production connection string, that is your real data. The routine above makes sure the worst case is losing test data." },
  { q: "I use Supabase (or Firebase, or Convex). Do I still need this?", a: "Yes. These are solid platforms, but they do what the key you give them allows. If the agent has a full-access key or the production connection string, it can delete data. Separate dev and production projects, keep admin keys out of your local files, and check what backups your plan includes." },
  { q: "What is Backenly, and is it free?", a: "Backenly is an open-source backend for coding agents that launched on Product Hunt on October 31, 2026. Your agent builds the database, sign-in, storage and functions over MCP; Backenly then checks the backend every minute, fixes safe problems itself with an undo, and holds destructive or auth changes for your approval. Self-hosting is free (Apache-2.0); the Cloud has a free plan and Pro at $25/month." },
  { q: "Isn't a sandbox enough?", a: "A sandbox protects the files on your computer, but if the agent inside it still has a working production connection string, it can reach your real database over the internet. Use both: a sandbox for your files and a dev database plus read-only access for your data." },
  { q: "The agent already deleted my data. What now?", a: "Stop the agent first so it can't make things worse. Then check your host's dashboard for backups or point-in-time restore, and restore into a new database if you can, so you don't overwrite anything you might still recover. Rotate the connection string or keys the agent used, then set up the routine above before you continue." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to stop your AI coding agent from deleting your database", description: g.description, totalTime: "PT30M",
      tool: ["PostgreSQL (pg_dump, psql)", "Git", "Your coding agent"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["backenly", "supabase", "mudroom", "withhuman"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to stop your AI coding agent from deleting your database (a beginner&apos;s safety routine)</h1>
      <p className="text-lg text-gray-400">A plain-English routine for vibe coders. About a 5-minute read. Updated November 2, 2026.</p>
      <p>Coding agents like <T s="claude-code">Claude Code</T>, <T s="openai-codex">Codex</T> and <T s="cursor">Cursor</T> can set up a whole backend in minutes. The same speed is what makes them dangerous around data: one confident &quot;let me reset the database to fix this&quot; and your users, orders or signups are gone. You don&apos;t need to be a database expert to prevent it. You need five habits, and most of them take a few minutes once.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="commands">Copy-paste commands (Postgres)</H2>
      <p>Back up and test-restore. Run these in your terminal; you need the free PostgreSQL command-line tools, and your host shows the connection string in its dashboard:</p>
      <Code>{'# 1. back up production to a file (reads only, changes nothing)\npg_dump "$PROD_DATABASE_URL" > backup.sql\n\n# 2. prove it works: restore into a spare, empty database\npsql "$SPARE_DATABASE_URL" < backup.sql'}</Code>
      <p>Create a read-only login for your agent. Run this once in your database&apos;s SQL editor, replacing the password and database name:</p>
      <Code>{"CREATE ROLE agent_readonly LOGIN PASSWORD 'choose-a-long-password';\nGRANT CONNECT ON DATABASE your_db TO agent_readonly;\nGRANT USAGE ON SCHEMA public TO agent_readonly;\nGRANT SELECT ON ALL TABLES IN SCHEMA public TO agent_readonly;\n-- also cover tables created later\nALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO agent_readonly;"}</Code>
      <p>Then add one line to your agent&apos;s instructions file (CLAUDE.md or AGENTS.md) so it knows the rules:</p>
      <Code>{"Never run DROP, TRUNCATE, DELETE without WHERE, or any database reset.\nOnly use the dev database in .env. Write schema changes as migration files and stop for my review."}</Code>
      <p>That instruction helps, but agents don&apos;t always follow instructions, which is why steps 2 and 3 (no production key, read-only access) matter most: they make the mistake impossible instead of just discouraged.</p>

      <H2 id="agent-backends">The easier way: a backend that holds risky changes for you</H2>
      <p><T s="backenly">Backenly</T> is a new open-source backend (launched October 31, 2026) designed around this exact problem. Your agent builds a Postgres database, sign-in, storage and functions through MCP, but dropping or emptying a table, removing a column or deleting files never runs on its own: it waits in a &quot;Waiting on you&quot; list showing how many rows would be affected. The agent&apos;s key can ask, never approve. It also checks your backend every minute and fixes safe things (like a missing index) with an undo. If you&apos;re already on <T s="supabase">Supabase</T> or <T s="convex">Convex</T>, you don&apos;t need to switch; the 5-step routine gives you most of the protection.</p>
      <p>For agents that act on other real systems (payments, emails, deployments), an approval layer like <T s="withhuman">withHuman</T> sends risky actions to a person. And to keep the agent away from your files, run it in a sandbox like <T s="mudroom">Mudroom</T>.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Back up, and test the restore once.</li><li>The agent gets a dev database and, at most, read-only access to production.</li><li>Destructive commands wait for a human; schema changes go through migrations you read.</li></ul>
      <p className="text-sm text-gray-500">More safety reading: <Link className="underline" href="/guides/run-ai-coding-agents-in-a-sandbox">run your agent in a sandbox</Link>, <Link className="underline" href="/guides/check-ai-code-before-you-ship">check AI-written code before you ship</Link> and <Link className="underline" href="/guides/check-claude-code-extension-backdoor">keep AI coding extensions safe</Link>. Building on AWS? <Link className="underline" href="/guides/test-aws-code-locally-with-your-ai-agent">Let your agent test against a free local AWS Emulator</Link> instead of your real account. Picking a backend? See <Link className="underline" href="/use-case/deployment-backend">the best deployment and backend tools</Link> or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
