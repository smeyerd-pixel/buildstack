import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("run-ai-coding-agents-in-a-sandbox")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Save a clean starting point", text: "Commit or back up your project before the agent starts (git add -A, then git commit -m \"before agent\"). If anything goes wrong you can always get back to this exact state, sandbox or not." },
  { name: "Take secrets out of reach", text: "Move real API keys, .env files with live passwords and private documents out of the project folder, or replace them with test values. An agent can read every file it is given, and being listed in .gitignore does not hide a file from it." },
  { name: "Run the agent on a copy, not your real folder", text: "Use a sandbox so the agent works on a clone of your project inside a separate machine (a virtual machine or container). The free Mudroom tool does this in one command: mudroom run ~/code/myapp -- claude --dangerously-skip-permissions." },
  { name: "Only let it reach the internet it needs", text: "Block network access except the agent's own API (for example Anthropic or OpenAI) and the few sites you add, such as your package registry. That stops a confused or tricked agent from sending your code somewhere or downloading random scripts. Mudroom blocks everything else by default and logs every connection." },
  { name: "Review the diff, then apply only what you understand", text: "When the agent finishes, read its changes like a pull request: which files changed, what was added or deleted. Apply all of it, some files or nothing, run your app and tests, and undo if it broke something." },
];
const faq = [
  { q: "Why do people turn off permission prompts at all?", a: "Agents like Claude Code, Codex and Gemini CLI ask before running commands or editing files. That is safe but slow: on a long task you end up clicking Allow constantly or walking away and finding it stuck. Turning prompts off (for Claude Code, the --dangerously-skip-permissions flag) lets the agent work on its own, which is why it is only sensible inside a sandbox." },
  { q: "What is a sandbox, in plain English?", a: "A sealed-off space where a program can do whatever it wants without affecting the rest of your computer. For coding agents that usually means a virtual machine or container holding a copy of your project, with limited or no internet. If the agent deletes everything in there, your real files are untouched." },
  { q: "Isn't git enough?", a: "Git lets you undo changes to tracked files, which is a good start, but an agent with prompts off can also delete untracked files, change things outside the project folder, run installers or reach any website. A sandbox protects all of that; git alone only protects committed code." },
  { q: "Is Mudroom free, and what do I need to run it?", a: "Yes, Mudroom is free and open source (MIT). The Mac app and CLI need an Apple-silicon Mac with macOS 26; on Linux, Windows and Intel Macs there is a CLI that uses Docker or Podman. It is an early prototype, so expect rough edges and keep backups." },
  { q: "Do Codex and other agents have their own sandbox?", a: "Some do. OpenAI's Codex CLI has built-in sandbox and approval modes that limit what it can touch, and other agents offer similar settings. Check your agent's docs. An outside sandbox like Mudroom adds a copy of your project, a network allowlist and PR-style review on top, and works the same way across agents." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to run an AI coding agent without permission prompts, safely in a sandbox", description: g.description, totalTime: "PT15M",
      tool: ["Git", "Mudroom", "Claude Code"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["mudroom", "claude-code", "withhuman", "farol"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to let your AI coding agent run without permission prompts (safely, in a sandbox)</h1>
      <p className="text-lg text-gray-400">A plain-English routine for vibe coders. About a 4-minute read. Updated October 29, 2026.</p>
      <p>Coding agents like <T s="claude-code">Claude Code</T>, <T s="openai-codex">Codex</T>, <T s="gemini-cli">Gemini CLI</T>, <T s="opencode">OpenCode</T> and <T s="aider">Aider</T> work best when they don&apos;t stop every few seconds to ask &quot;Can I run this?&quot;. But with the prompts off, an agent can delete files, overwrite work or reach any website while you aren&apos;t looking. The fix is to give it a sandbox: a copy of your project in a sealed-off machine, so it can go fast and you decide what comes back.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="mudroom">The easy way: Mudroom (free)</H2>
      <p><T s="mudroom">Mudroom</T> is a free, open-source tool that launched on Product Hunt on October 28, 2026. It runs your agent in a small Linux virtual machine on a copy-on-write clone of your project (it takes no extra disk space until files change), and your real folder is never mounted. Network access is blocked except for the agent&apos;s API and hosts you allow, and when the agent is done you review and apply its changes like a pull request.</p>
      <Code>{"# install on an Apple-silicon Mac (macOS 26)\nbrew install --cask kernel-hunter/tap/mudroom\n\n# run Claude Code on a copy of your project, prompts off\nmudroom run ~/code/myapp -- claude --dangerously-skip-permissions\n\nmudroom review last        # look through the changes\nmudroom network log last   # what it connected to, and what was blocked\nmudroom apply last --all   # copy the changes into your real project\nmudroom undo last          # changed your mind"}</Code>
      <p>You can also apply only some files or single chunks of a file. On Linux, Windows and Intel Macs, Mudroom has a command-line version that uses Docker or Podman. It is an early prototype, so keep step 1 (a clean commit) as your safety net.</p>

      <H2 id="no-sandbox">If you can&apos;t use a sandbox yet</H2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Keep prompts on for anything that touches money, production data or deployments.</li>
        <li>Give the agent its own git worktree or folder so it can&apos;t trample your main copy (see our guide to <Link className="underline" href="/guides/run-ai-coding-agents-in-parallel">running several agents at once</Link>).</li>
        <li>For agents that act on real systems, an approval layer like <T s="withhuman">withHuman</T> auto-approves routine actions and sends risky ones to a person.</li>
        <li>Before merging, a tool like <T s="farol">farol</T> tells you how risky an agent-written pull request is.</li>
      </ul>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Commit first and move real secrets out of the project.</li><li>Run the agent on a copy in a sandbox with only the internet it needs.</li><li>Review the diff like a pull request and apply only what you understand.</li></ul>
      <p className="text-sm text-gray-500">Changes applied? Before you ship, use our <Link className="underline" href="/guides/check-ai-code-before-you-ship">checklist for AI-written code</Link>, and give your agent a clear <Link className="underline" href="/guides/write-a-spec-for-your-ai-coding-agent">spec</Link> so it builds the right thing. Picking tools? See the <Link className="underline" href="/use-case/coding-agents">best AI coding agents</Link> or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
