import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("connect-ai-agent-to-your-apps-safely")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Sign in with OAuth, never paste your password", text: "When an agent needs your Gmail, Slack or GitHub, connect it through the app's own \"Sign in with...\" screen (that's OAuth). You approve a list of permissions, the agent gets a token instead of your password, and you can cancel that token any time without changing your password. If a tool asks you to type your actual password or paste your session cookies, don't." },
  { name: "Grant the smallest scopes that do the job", text: "Read the permission screen. An agent that drafts replies only needs to read mail and create drafts, not delete or send. For GitHub, prefer a fine-grained personal access token limited to one repository and only the permissions the task needs. Start read-only, watch what the agent does for a few days, then add write access one permission at a time." },
  { name: "Give each agent only the tools it needs", text: "Every connected app can expose dozens of tools, and each one costs context and gives the agent another thing it could do by mistake. A support agent doesn't need GitHub; a coding agent doesn't need your inbox. Tool gateways like AgentKit by Scalekit (Virtual MCP Servers) and Composio let you bundle exactly the tools one agent role should see." },
  { name: "Keep tokens out of your code, prompts and logs", text: "Never commit API keys to your repo or paste them into a chat with your agent. Put them in environment variables or a secrets manager, add .env to .gitignore, and if you're building an agent for other people, use a gateway that stores each user's tokens in a vault and injects them at call time, so the model never sees them." },
  { name: "Log every action and know how to switch it off", text: "Turn on whatever activity log your gateway or automation tool offers, so you can see which tool ran, for which user, with what result. Keep a human approval step for anything that sends, pays or deletes. And bookmark the page where you revoke access, because the fastest fix for an agent misbehaving is cutting its token." },
];
const faq = [
  { q: "What is OAuth, in plain English?", a: "It's the \"Sign in with Google\" style screen. Instead of giving an app your password, you tell Google (or Slack, or GitHub) \"let this app do these specific things,\" and the app gets a revocable token limited to those things. It's how almost every safe agent integration works." },
  { q: "What's an MCP gateway?", a: "MCP (Model Context Protocol) is the common way agents like Claude Code and Cursor plug into tools. A gateway sits between your agent and many apps: it handles sign-ins, stores tokens, and exposes the tools through one MCP address. AgentKit by Scalekit (#1 on Product Hunt on November 3, 2026) and Composio are two examples with free tiers." },
  { q: "Is this free?", a: "You can start free. AgentKit's Free plan includes 10,000 tool calls and 10,000 trigger events a month with all 600+ connectors; Growth is $99/month. Composio has a free Hobby plan. If you only need one or two apps for yourself, the official MCP server or a no-code tool like n8n may be all you need." },
  { q: "How do I remove an agent's access later?", a: "Revoke it where you granted it. For Google, open your Google Account's \"Third-party apps & services\" page; for GitHub, Settings, then Applications (or delete the personal access token); for Slack, remove the app from your workspace's app management page. Do this for any tool you stop using." },
  { q: "Should my agent be allowed to send emails or delete things by itself?", a: "Not at first. Let it draft, then approve. Once you've watched it make good choices for a while, you can let low-risk actions through automatically, but keep a person in the loop for anything that sends money, emails customers or deletes data." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to connect your AI agent to Gmail, Slack and GitHub without handing over your passwords", description: g.description, totalTime: "PT30M",
      tool: ["Your AI agent (Claude Code, Cursor or your own app)", "An OAuth-based tool gateway (AgentKit by Scalekit or Composio)"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["scalekit-agentkit", "composio", "n8n", "claude-code"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to connect your AI agent to Gmail, Slack and GitHub without handing over your passwords</h1>
      <p className="text-lg text-gray-400">A plain-English safety routine for vibe coders. About a 5-minute read. Updated November 4, 2026.</p>
      <p>An agent that can only chat is a toy. The useful ones read your inbox, post the standup in Slack and open the GitHub issue for you. But the moment an agent can act in your accounts, a bad prompt, a confused model or a leaked key can act there too. The fix isn&apos;t to avoid connecting apps. It&apos;s to connect them the way the pros do: revocable sign-ins, small permissions, a short tool list and a log. Here&apos;s the 5-step routine, whether you use <T s="claude-code">Claude Code</T>, <T s="cursor">Cursor</T> or an agent you&apos;re building yourself.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="scopes">What &quot;small scopes&quot; look like in practice</H2>
      <ul className="list-disc space-y-1 pl-6">
        <li><b>Inbox helper:</b> read mail and create drafts. Not send, not delete. You click Send.</li>
        <li><b>Slack standup bot:</b> post in one channel. Not read every DM.</li>
        <li><b>GitHub issue triager:</b> read code and write issues on one repo. Not push to main, not admin.</li>
      </ul>
      <p>If a tool only offers &quot;full access,&quot; treat that as a reason to look for a different tool, or to use a separate test account first.</p>

      <H2 id="keys">Keeping keys out of your repo</H2>
      <p>If your agent or app needs an API key, keep it in a local <code>.env</code> file that git ignores, and tell your coding agent the rule in your project instructions:</p>
      <Code>{"# .gitignore\n.env\n\n# .env  (never committed, never pasted into chat)\nGITHUB_TOKEN=...\n\n# AGENTS.md or CLAUDE.md\nNever print, log or commit secrets. Read keys from environment variables only."}</Code>
      <p>Already committed a key by accident? Revoke it in the app first, then clean up the repo. Deleting the file isn&apos;t enough, because the key is still in your git history.</p>

      <H2 id="gateway">When to use a gateway like AgentKit</H2>
      <p>If you&apos;re building an agent that acts for <i>other people</i>, every user needs their own sign-in, their own tokens and their own limits. <T s="scalekit-agentkit">AgentKit by Scalekit</T> handles that layer: users connect through an auth link, tokens live in a per-tenant vault and are injected at call time, each agent role gets only the tools you pick, and every call is logged with the agent, user and tool. It covers 600+ apps and starts free (10,000 tool calls a month), and you can try it from your terminal with:</p>
      <Code>{"npx @scalekit-inc/cli setup"}</Code>
      <p><T s="composio">Composio</T> is a popular alternative with a free plan and a large toolkit catalog. If it&apos;s just you automating your own accounts with no code, <T s="n8n">n8n</T> workflows with built-in OAuth credentials are often enough.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Connect with OAuth sign-ins, never passwords or pasted cookies.</li><li>Grant the smallest scopes and the shortest tool list; start read-only.</li><li>Keep tokens out of code and chat, log every action, and know where the revoke button is.</li></ul>
      <p className="text-sm text-gray-500">Related: <Link className="underline" href="/guides/stop-ai-agent-deleting-your-database">stop your AI agent deleting your database</Link>, <Link className="underline" href="/guides/run-ai-coding-agents-in-a-sandbox">run your coding agent in a sandbox</Link>, and <Link className="underline" href="/guides/add-mcp-servers-to-claude-code-and-codex">add MCP servers to Claude Code and Codex</Link>. More tools: <Link className="underline" href="/use-case/automation-agents">AI automation and agent tools</Link> and <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
