import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("check-your-lovable-app-for-data-leaks")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Run your builder's security scan and read every finding", text: "In Lovable, open the security scan (it runs on every publish) and also run the free deep scan. Fix what it flags, but don't treat a pass as proof: the scan can't know which data you meant to be public." },
  { name: "Check that every table has row level security switched on", text: "In the Supabase dashboard, open Advisors > Security Advisor, then run one SQL query that lists every table in the public schema and whether row level security (RLS) is on. Any table with RLS off can be read by anyone who has your public key." },
  { name: "Look for rules that let everyone in", text: "RLS being on isn't enough. Run a second query that lists your policies and look for any rule that is just true, or that is given to the anon role, on tables holding personal data. Those let every visitor read every row." },
  { name: "Test it like a stranger, then like a second user", text: "Ask your database for a private table using only the public key from your website, with no login. If any row comes back, it is leaking. Then sign up a second test account and check you can't see the first account's data." },
  { name: "Fix the rules, then re-test after every big change", text: "Replace open rules with ones that only return a user's own rows, keep the secret service_role key out of the browser, and check your Storage buckets. Run the stranger test again every time your AI builder adds a table." },
];
const faq = [
  { q: "What actually happened with Lovable apps?", a: "German security firm Crissy Field looked at 159,041 public Lovable projects (found through the Common Crawl web archive). Of 24,664 sites whose Supabase database sent data to visitors without a login, 7,403 (30%) had tables with email addresses that could be read with further read-only requests, including passport details, payment information and more than 200,000 chat messages in some apps. The researchers stress the 30% is not a confirmed leak rate. Lovable's head of security said the cause was insufficient row level security." },
  { q: "Is my public Supabase key (anon or publishable key) a secret?", a: "No. It is meant to be in your website's code, so anyone can find it. That is fine only if row level security protects every table. The service_role (or secret) key is different: it skips all security rules and must never be in your frontend code, your Git repo, or a prompt you paste into a public chat." },
  { q: "Does this only affect Lovable?", a: "No. Any app whose browser code talks straight to Supabase (Bolt, Base44 apps on Supabase, v0, Cursor or Claude Code projects) has the same risk if the rules are wrong. Lovable was simply the platform that was studied." },
  { q: "Is it legal to run these tests?", a: "Only run them on apps you own or have written permission to test. Checking someone else's app this way can be illegal even if the data is open. If you find a leak in another app, report it privately to its owner." },
  { q: "I found a leak. What now?", a: "Fix the rule first (turn on RLS, replace open policies), then check your Supabase logs to see if anyone else read the data. If personal data may have been exposed, you may have legal duties to tell users or a regulator (for example within 72 hours under GDPR in Europe), so get proper advice. For apps handling sensitive data, pay for a professional security review." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to check if your Lovable or Supabase app is leaking user data", description: g.description, totalTime: "PT15M",
      tool: ["Lovable security scan", "Supabase Security Advisor", "Supabase SQL Editor", "curl"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["lovable", "supabase", "db-branch", "agweb", "bolt", "base44"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">Is your Lovable app leaking user data? A 15-minute check (and fix) for Supabase apps</h1>
      <p className="text-lg text-gray-400">A plain-English guide for vibe coders with real users. About a 7-minute read. Updated November 16, 2026.</p>
      <p>This month, researchers at Crissy Field reported that many apps built with <T s="lovable">Lovable</T> let anyone read data they shouldn&apos;t: names and emails, ticket and payment details, private chat messages, even passport numbers. Nobody hacked them. The apps&apos; <T s="supabase">Supabase</T> databases simply had missing or wide-open access rules, the part AI app builders most often get wrong. The good news: you can check your own app in about 15 minutes, without being a developer. Here is the routine.</p>

      <H2>The 5-step check</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="why">Why this happens (in one paragraph)</H2>
      <p>In a Lovable, Bolt or Base44-style app, your website talks straight to the database from the visitor&apos;s browser, using a public key that is visible in your site&apos;s code. That is normal and safe <i>only</i> if every table has <b>row level security (RLS)</b>: rules that say which rows each person may see or change. If a table has RLS off, or a rule that says &quot;everyone can read everything&quot;, then anyone with your public key, which is everyone, can download that table. An AI builder writing hundreds of lines a minute can easily add a table or loosen a rule to make a feature &quot;work&quot;.</p>

      <H2 id="scan">Step 1: Run the scan you already have</H2>
      <p>Lovable checks your code, database schema and RLS policies every time you publish, and offers a free <b>deep scan</b> that goes further. Its <b>Fix</b> button hands each finding to the agent, and an &quot;Auto-fix security issues&quot; setting fixes many automatically. Run the deep scan now and act on every finding. But remember the researchers&apos; and Lovable&apos;s own point: a scanner can&apos;t know whether a table was <i>meant</i> to be public, so do steps 2 to 4 yourself.</p>

      <H2 id="rls-on">Step 2: Is RLS on for every table?</H2>
      <p>If you connected your own Supabase project, open it in the Supabase dashboard. (On Lovable&apos;s built-in Cloud database, ask Lovable&apos;s chat to list every table with its RLS status and policies, and rely on the step 1 scan; the same ideas apply.) First check <b>Advisors &gt; Security Advisor</b>: it warns about tables with RLS turned off. Then open the <b>SQL Editor</b> and run this read-only query:</p>
      <Code>{"select tablename, rowsecurity as rls_on\nfrom pg_tables\nwhere schemaname = 'public'\norder by rls_on, tablename;"}</Code>
      <p>Any row where <code>rls_on</code> is <code>false</code> is a table anyone can read. If it holds anything about people (emails, messages, orders, files), fix it before doing anything else.</p>

      <H2 id="open-rules">Step 3: Look for rules that let everyone in</H2>
      <p>RLS can be on and still let everyone in. This query lists every rule:</p>
      <Code>{"select tablename, policyname, cmd, roles, qual as who_can_see, with_check\nfrom pg_policies\nwhere schemaname = 'public'\norder by tablename;"}</Code>
      <p>Look closely at any rule where <code>who_can_see</code> is just <code>true</code>, or where <code>roles</code> includes <code>anon</code> or <code>public</code>. On a table of blog posts or a product list that can be fine. On profiles, messages, orders, bookings or a waiting list, it means every visitor can read every row.</p>

      <H2 id="stranger-test">Step 4: Test it like a stranger</H2>
      <p>This is the test that matters, because it is exactly what an outsider would do. Find your project URL and public key (anon or publishable key) in Supabase under <b>Project Settings &gt; API Keys</b>, pick a table that should be private, and run this in a terminal (Mac Terminal or Windows PowerShell both have curl):</p>
      <Code>{"curl 'https://YOUR-PROJECT.supabase.co/rest/v1/YOUR_TABLE?select=*&limit=5' \\\n  -H 'apikey: YOUR_PUBLIC_KEY'"}</Code>
      <p>An empty list <code>[]</code> or a permission error is what you want. If real rows come back, that table is leaking to the whole internet. Repeat for each private table. Not comfortable in a terminal? Ask your AI coding agent to run this test on every table and report which ones return rows, and paste the results back into Lovable&apos;s chat to fix. Want to see what your live site sends to visitors? Open it logged out in a private window and check the browser&apos;s Network tab, or have a Mac agent do it in <T s="agweb">agweb</T>, a new browser built for coding agents.</p>
      <p>Then do the <b>second-user test</b>: sign up a second test account in a private window and try to open the first account&apos;s pages, orders or messages. You should see nothing that belongs to the first account.</p>

      <H2 id="fix">Step 5: Fix the rules, then make re-testing a habit</H2>
      <p>The usual fix is a rule that only returns a person&apos;s own rows. You can paste this into Lovable&apos;s chat as an instruction (&quot;make every table that holds user data readable only by its owner&quot;) or run it yourself, changing <code>messages</code> and <code>user_id</code> to your table and column:</p>
      <Code>{"alter table public.messages enable row level security;\n\ndrop policy if exists \"read messages\" on public.messages;  -- the old open rule's name\n\ncreate policy \"Users read their own messages\"\non public.messages for select\nto authenticated\nusing ((select auth.uid()) = user_id);"}</Code>
      <p>Then run the stranger test again. Three more checks while you are there:</p>
      <ul className="list-disc space-y-1 pl-6"><li><b>Secret keys:</b> search your project for <code>service_role</code> or <code>sb_secret_</code>. That key ignores every rule and must only live on a server, never in browser code or your Git repo.</li><li><b>Storage:</b> in Supabase Storage, any bucket marked Public can be read by anyone with a file&apos;s link. Keep IDs, contracts and invoices in private buckets.</li><li><b>Every new table:</b> your AI builder adds tables as you prompt. Re-run steps 2 to 4 after each big feature, and turn on Lovable&apos;s scheduled scans when they reach your plan.</li></ul>
      <p>Want your agent to try rule changes without risking live data? Test them on a copy first. Supabase has its own branching feature; if you host your own Postgres or MySQL, <T s="db-branch">db-branch</T> (free, open source) makes an instant throwaway copy that your agent can break and reset, and our guide to <Link className="underline" href="/guides/stop-ai-agent-deleting-your-database">stopping your agent deleting your database</Link> covers the rest of that safety routine.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Run your builder&apos;s scan, but don&apos;t stop at a pass.</li><li>Every table needs RLS on, and no rule on personal data should just say <code>true</code>.</li><li>Test like a stranger with only your public key, and like a second user; re-test after every new table.</li></ul>
      <p className="text-sm text-gray-500">Related: <Link className="underline" href="/guides/let-your-ai-agent-set-up-your-app-backend">let your agent set up your app&apos;s backend safely</Link>, <Link className="underline" href="/guides/check-ai-code-before-you-ship">check AI-written code before you ship</Link>, <Link className="underline" href="/guides/stop-ai-agent-deleting-your-database">stop your AI agent deleting your database</Link>, and <Link className="underline" href="/guides/keep-ai-code-behind-a-quality-gate">keep AI code behind a quality gate</Link>. Picking a builder? See <Link className="underline" href="/use-case/app-builders">the best AI app builders</Link>, <Link className="underline" href="/use-case/deployment-backend">backend tools</Link> or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
