import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("add-mcp-servers-to-claude-code-and-codex")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Pick servers from a source you trust, and only the ones you need", text: "An MCP server is a small program your agent can start and call. A local one runs on your computer with your permissions, so treat it like any app you install: prefer official servers from the company whose service it talks to, or popular open-source ones with an active maintainer. Every extra server also adds tool descriptions to each request, so fewer is faster and cheaper." },
  { name: "Test that it starts and see what tools it offers", text: "Before your agent tries it, start the server once and read its tool list. toolshed does this automatically when you add a server; by hand, add it and run /mcp inside Claude Code to see whether it connected. A server that fails here would only fail later in the middle of a task." },
  { name: "Install it where it belongs: one project or every project", text: "Servers for one codebase (a database, that project's issue tracker) belong to that repository. General ones (docs lookup, memory, web fetch) can go user-wide. Both Claude Code and Codex support both; toolshed asks you which when you install." },
  { name: "Keep API tokens out of plain-text config files", text: "If you paste a token into ~/.claude.json or ~/.codex/config.toml it sits there in plain text, where any script or agent that reads your home folder can see it. Store it in your system keychain instead (toolshed does this and can import servers you already set up by hand), or for Gmail, Slack and GitHub use an OAuth login with small scopes." },
  { name: "Check them now and then, and remove what you don't use", text: "Servers break when packages update or a command moves. Pin versions, run a health check (toolshed doctor) after upgrades, and remove servers you no longer use so your agent has fewer tools to misuse and less to read on every request." },
];
const faq = [
  { q: "What is MCP, in plain English?", a: "MCP (Model Context Protocol) is a standard plug that lets an AI agent use outside tools: read your database, search docs, open GitHub issues, control a browser. An MCP server is the program on the other end of the plug. Add it once and Claude Code, Codex, Cursor and other MCP-aware agents can call its tools." },
  { q: "Do I need toolshed to use MCP servers?", a: "No. Claude Code and Codex each have a built-in mcp add command, shown above. toolshed is a free helper that adds a server to both at once, tests it first, keeps tokens in your keychain and checks them later. It runs on macOS and Linux." },
  { q: "Is it safe to let my agent add MCP servers itself?", a: "Only with your approval. A server is code that runs on your machine, so a prompt-injected agent that can install servers could install something harmful. toolshed lets your agent request a server and shows you what it will run before you approve it with one keypress." },
  { q: "Local or remote server: which should I pick?", a: "A remote server (a URL) runs on the provider's machines, so nothing new runs on your computer, but your requests go to them. A local server (npx, uvx or a command) runs on your computer with your permissions. For a well-known service, the provider's official remote server is usually the simplest choice." },
  { q: "How many MCP servers should I add?", a: "Start with one or two you will use this week. Each server's tool list is sent to the model, and a long tool list makes agents slower and more likely to pick the wrong tool." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to add MCP servers (tools) to Claude Code and Codex", description: g.description, totalTime: "PT10M",
      tool: ["Claude Code", "OpenAI Codex", "toolshed"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["toolshed", "plannotator", "composio", "scalekit-agentkit"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to add MCP servers (tools) to Claude Code and Codex: a beginner&apos;s guide</h1>
      <p className="text-lg text-gray-400">A plain-English setup guide for vibe coders. About a 5-minute read. Updated November 10, 2026.</p>
      <p>Everyone on X says &quot;just give your agent an MCP server.&quot; An MCP server is a small add-on that gives <T s="claude-code">Claude Code</T>, <T s="openai-codex">Codex</T> or Cursor a new set of tools: look up current docs, remember things between sessions, read your database, open GitHub issues. Adding one takes a single command. Doing it so that it works, doesn&apos;t leak your API keys and doesn&apos;t clutter your agent takes a little routine. Here it is.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="by-hand">Adding a server by hand</H2>
      <p>Both agents have a built-in command. The example below adds the official &quot;memory&quot; server (a local npm package) and a remote docs server:</p>
      <Code>{"# Claude Code: a local server (runs on your computer)\nclaude mcp add memory -- npx -y @modelcontextprotocol/server-memory\n\n# Claude Code: a remote server (a URL)\nclaude mcp add --transport http context7 https://mcp.context7.com/mcp\n\n# see what's installed (or type /mcp inside Claude Code)\nclaude mcp list\n\n# Codex: a local server\ncodex mcp add memory -- npx -y @modelcontextprotocol/server-memory"}</Code>
      <p>That&apos;s enough for one or two servers. The trouble starts when a server needs an API token: the usual instructions have you paste it into the command or a config file, where it stays in plain text.</p>

      <H2 id="toolshed">Adding servers with toolshed (both agents at once)</H2>
      <p><T s="toolshed">toolshed</T> is a free, open-source (MIT) terminal app for macOS and Linux. It adds a server, starts it to list its tools, installs it into Claude Code and Codex, and keeps any token in your system keychain.</p>
      <Code>{"brew install bartdegoede/tap/toolshed\n\ntoolshed                      # opens the app: a adds, i installs, m imports, q quits\n\ntoolshed add memory --npx @modelcontextprotocol/server-memory\ntoolshed install memory       # -> claude, codex\n\n# a server that needs a token: you type it at a hidden prompt on install\ntoolshed add jira --secret JIRA_TOKEN -- jira-mcp --site acme\n\ntoolshed import               # move servers you added by hand (and their tokens) over\ntoolshed doctor               # check every installed server still works"}</Code>
      <p>Your list of servers lives in one small YAML file without the secret values, so you can commit it and a teammate gets the same setup.</p>

      <H2>For Gmail, Slack and GitHub, use a login, not a pasted key</H2>
      <p>Services you log into are better connected through OAuth with the smallest permissions, so you can revoke access in one click. <T s="composio">Composio</T> and <T s="scalekit-agentkit">AgentKit by Scalekit</T> handle those logins for agents; our guide to <Link className="underline" href="/guides/connect-ai-agent-to-your-apps-safely">connecting your agent to your apps safely</Link> walks through it.</p>

      <H2>A useful first server: a way to answer your agent</H2>
      <p>MCP isn&apos;t only for data. <T s="plannotator">Plannotator</T>&apos;s new Inbox runs as an MCP server, so Claude Code, Codex or Cursor can send you questions, plans and diffs in one local window and pick up your answers while they keep working.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>An MCP server gives your agent new tools; add only the ones you&apos;ll use.</li><li>Test it before your agent depends on it, and install it for one project or all of them on purpose.</li><li>Keep tokens in your keychain or behind OAuth, never in a plain-text config file, and prune servers you stop using.</li></ul>
      <p className="text-sm text-gray-500">Related: <Link className="underline" href="/guides/use-a-github-repo">how to use someone else&apos;s GitHub repo</Link>, <Link className="underline" href="/guides/check-a-repo-before-you-run-it">check a repo before you run it</Link>, and <Link className="underline" href="/guides/run-ai-coding-agents-in-a-sandbox">run your agent in a sandbox</Link>. More tools: <Link className="underline" href="/use-case/coding-agents">coding agents</Link> and <Link className="underline" href="/new">newest AI tools</Link>.</p>
    </article>
  );
}
