import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("let-your-ai-agent-set-up-your-app-backend")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Pick one backend and stick with it", text: "Your app needs somewhere to keep data, sign users in and run code. Pick one platform your agent can drive from the terminal: Volcano (new from Kong, launched November 19, 2026, with database, login, storage, functions, workflows, sandboxes and Next.js hosting in one CLI), Supabase (the popular Postgres choice behind Lovable and many vibe-coded apps) or Convex (a TypeScript-first database). All three have free plans. Don't mix two on your first app." },
  { name: "Connect it with one prompt, and do the sign-up yourself", text: "For Volcano, paste this into Claude Code, Codex, Cursor, OpenCode or Pi: Run `npm i -g @volcano.dev/cli && volcano connect --signup` and keep it running while I sign up. The agent installs the CLI, your browser opens, and you create the account. The CLI then creates a cloud project and a linked folder, and sets up Volcano skills for the coding agents it finds." },
  { name: "Lock each user's data before you add real users", text: "Ask the agent to turn on row-level security (RLS) for every table and add rules so a signed-in user can only read and change their own rows. Then test it like a stranger: sign in as a second test user and try to read the first user's data. If you can, it isn't fixed yet." },
  { name: "Make risky jobs wait for you", text: "Anything that sends email, charges money or deletes data should pause for a person. Volcano's durable functions can stop at an approval step and pick up exactly where they left off, for up to a year; on other platforms ask the agent to add an 'approve' button or a manual queue. Test unfamiliar install scripts in a throwaway machine first (on a Mac, DynoCap runs them in an offline Linux sandbox)." },
  { name: "Watch errors, and keep the merge button human", text: "Once the app is live, read the logs when something breaks. Volcano's LavaFlow can read your runtime errors and open fix pull requests in your connected GitHub repo (availability depends on your plan); review and merge them yourself like any other change, and leave auto-merge off while you're starting out." },
];
const faq = [
  { q: "What is a backend, in plain English?", a: "It's the part of your app people don't see: the database that stores accounts, posts or orders, the sign-in system, file storage, and the code that runs on a server (for example, sending a receipt after a purchase). The frontend is the screens; the backend is the kitchen." },
  { q: "Is it safe to let an AI agent set up my database?", a: "It's safe enough if you keep three rules: you create the accounts and hold the passwords, every table has row-level security before real users arrive, and the agent can't delete or migrate production data without you saying yes. Our guide on stopping an agent deleting your database shows how to fence that off." },
  { q: "Volcano, Supabase or Convex: which should a beginner pick?", a: "If you're already on Lovable or following a tutorial, use Supabase; there's the most help online. If you want one tool for database, login, hosting, background jobs and sandboxes and you're happy to try something brand new, try Volcano's free Hobby plan. If you write TypeScript and want the database to feel like code, try Convex. Any of them is better than mixing two." },
  { q: "How much does Volcano cost?", a: "The Hobby plan is $0 with no credit card (a 1GB Postgres database, 512MB storage, 100,000 function and frontend views a month, unlimited users). The SUPERAGENT production plan starts at $17 a month billed yearly with 1,000 credits a month. Check volcano.dev/pricing for current limits; it launched this week, so details may change." },
  { q: "Do I need a separate admin panel?", a: "Not at first. When you or your team need a dashboard to look up customers or approve orders, ToolJet 4.0 lets a coding agent build one as a React app while every data call goes through ToolJet's backend, where access rules are enforced. Its cloud Free plan covers 1 builder and 3 apps." },
];
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to let your AI coding agent set up your app's backend safely", description: g.description, totalTime: "PT45M",
      tool: ["Volcano", "Supabase", "Convex", "DynoCap", "ToolJet"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["volcano", "supabase", "convex", "dynocap", "tooljet", "maglev", "claude-code", "openai-codex"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to let your AI coding agent set up your app&apos;s backend (database, login and hosting) without losing control</h1>
      <p className="text-lg text-gray-400">A plain-English guide for vibe coders whose app needs real users and real data. About a 6-minute read. Updated November 20, 2026.</p>
      <p>Your coding agent can build screens all day, but the moment your app needs accounts, saved data or a payment receipt, it needs a backend. This week Kong launched <T s="volcano">Volcano</T>, an &quot;agent cloud&quot; designed for coding agents to drive: database, sign-in, storage, functions, approval workflows, sandboxes and hosting from one CLI. Here&apos;s a 5-step routine that works with Volcano, <T s="supabase">Supabase</T> or <T s="convex">Convex</T>, and keeps you in charge of the parts that can hurt.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="pick">Step 1: Pick one backend</H2>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-white"><tr><th className="py-2 pr-4">Platform</th><th className="py-2 pr-4">What you get</th><th className="py-2 pr-4">Free plan</th><th className="py-2">Pick it if</th></tr></thead><tbody className="divide-y divide-white/10">
        <tr><td className="py-2 pr-4"><T s="volcano">Volcano</T></td><td className="py-2 pr-4">Postgres, login, storage, realtime, functions, durable workflows with approvals, sandboxes, Next.js hosting</td><td className="py-2 pr-4">Hobby: $0, 1GB database, 100K views/month</td><td className="py-2">You want everything in one place and don&apos;t mind a brand-new product</td></tr>
        <tr><td className="py-2 pr-4"><T s="supabase">Supabase</T></td><td className="py-2 pr-4">Postgres, login, storage, realtime, edge functions</td><td className="py-2 pr-4">Yes</td><td className="py-2">You use Lovable or want the most tutorials and help</td></tr>
        <tr><td className="py-2 pr-4"><T s="convex">Convex</T></td><td className="py-2 pr-4">TypeScript-first reactive database and functions</td><td className="py-2 pr-4">Yes</td><td className="py-2">You write TypeScript and want data that updates live</td></tr>
      </tbody></table></div>
      <p>Hosting the screens on <T s="vercel">Vercel</T> or Netlify with any of these is fine too. The rule is one backend per app, so your agent isn&apos;t juggling two sets of logins and rules.</p>

      <H2 id="connect">Step 2: Connect it with one prompt</H2>
      <p>Open your project folder in your coding agent and paste:</p>
      <Code>{"Run `npm i -g @volcano.dev/cli && volcano connect --signup` and keep it running while I sign up."}</Code>
      <p>Your browser opens on the sign-up page; you create the account (never give the agent your password). When you finish, the CLI is signed in, creates a cloud project and a linked folder. Volcano&apos;s docs tell agents that projects, databases and domains belong to you and should only be created or deleted when the task calls for it. When the agent has built something, it ships everything (variables, database migrations, functions, frontends) with one command:</p>
      <Code>{"volcano cloud deploy   # deploy to your cloud project\nvolcano deploy         # same thing, to the local dev server"}</Code>
      <p>Want your agent to read logs and deployments over MCP instead? Volcano&apos;s docs show a one-line <code>claude mcp add</code> command that uses a project access token you create in the dashboard. Our <Link className="underline" href="/guides/add-mcp-servers-to-claude-code-and-codex">MCP setup guide</Link> explains what that means.</p>

      <H2 id="rls">Step 3: Lock each user&apos;s data</H2>
      <p>This is the step vibe-coded apps skip, and it&apos;s how thousands of Lovable apps ended up leaking user data. Ask your agent:</p>
      <Code>{"Turn on row-level security for every table. Add policies so a signed-in user\ncan only read, update and delete their own rows. Show me each policy in plain English."}</Code>
      <p>Then make two test accounts and try to read account A&apos;s data while signed in as B. Our <Link className="underline" href="/guides/check-your-lovable-app-for-data-leaks">15-minute data-leak check</Link> has copy-paste tests that work on any Postgres backend.</p>

      <H2 id="approvals">Step 4: Make risky jobs wait for you</H2>
      <p>Sending emails, charging cards and deleting records should never run on the agent&apos;s say-so. In Volcano, ask the agent to build those as durable functions with an approval step: the run pauses until a person approves, then resumes exactly where it stopped. Keep a copy of your data the agent can break: Volcano and many Postgres hosts let you branch a database copy. Read <Link className="underline" href="/guides/stop-ai-agent-deleting-your-database">how to stop an agent deleting your database</Link> before you give it production access.</p>
      <p>On a Mac and about to run an install script or test suite your agent just wrote or downloaded? <T s="dynocap">DynoCap</T> (open source, Apple Silicon only) clones your project into a disposable Linux machine that is offline by default, runs the command there, and shows you the diff:</p>
      <Code>{"brew install baires/tap/dynocap\ndynocap doctor --fix ./project\ndynocap clone ./project test                 # offline sandbox copy of your project\ndynocap exec test -- npm test\ndynocap diff test                            # see what changed before you keep anything"}</Code>
      <p>More options are in our <Link className="underline" href="/guides/run-ai-coding-agents-in-a-sandbox">sandbox guide</Link>.</p>

      <H2 id="fixes">Step 5: Watch errors, and keep the merge button human</H2>
      <p>Volcano&apos;s LavaFlow reads your project&apos;s runtime errors and opens fix pull requests in your connected GitHub repo (it depends on your plan; the CLI tells you if it isn&apos;t available). Treat those like any agent PR: read the diff, let your checks run, and merge it yourself. Leave its auto-merge setting off until you trust it. Our <Link className="underline" href="/guides/keep-ai-code-behind-a-quality-gate">quality-gate guide</Link> shows how to make &quot;tests pass and a person said yes&quot; the only way into main.</p>

      <H2 id="extras">Two extras once the app is running</H2>
      <ul className="list-disc space-y-2 pl-6">
        <li><b>An admin panel for you or your team:</b> <T s="tooljet">ToolJet 4.0</T> lets your coding agent build internal tools as React apps while every data call goes through ToolJet&apos;s backend with access rules, security scanning and visual review before changes go live.</li>
        <li><b>Live data for your agent without ten subscriptions:</b> <T s="maglev">Maglev</T> is one MCP server for 692 paid tools (search results, company data, prices, social posts and more) billed per call from a prepaid balance with spend limits you set.</li>
      </ul>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Pick one backend (Volcano, Supabase or Convex) and let the agent connect it while you do the sign-up.</li><li>Turn on row-level security and test it with a second account before real users arrive.</li><li>Make money, email and delete jobs wait for your approval, test unknown scripts in a sandbox, and merge fixes yourself.</li></ul>
      <p className="text-sm text-gray-500">Related: <Link className="underline" href="/guides/check-your-lovable-app-for-data-leaks">check your app for data leaks</Link>, <Link className="underline" href="/guides/stop-ai-agent-deleting-your-database">stop an agent deleting your database</Link>, <Link className="underline" href="/guides/connect-ai-agent-to-your-apps-safely">connect an agent to your apps safely</Link>, <Link className="underline" href="/guides/run-ai-coding-agents-in-a-sandbox">run agents in a sandbox</Link>, <Link className="underline" href="/use-case/deployment-backend">best deployment and backend tools</Link>, or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
