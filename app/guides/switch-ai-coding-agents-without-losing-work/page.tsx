import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("switch-ai-coding-agents-without-losing-work")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Put your project rules in AGENTS.md", text: "Write how to run, test and style your project in a plain AGENTS.md file at the top of your repo. Codex, OpenCode, Cusp and many other agents read it, so a new agent starts with the same instructions instead of you re-explaining everything." },
  { name: "Commit before you switch", text: "Save the current code with a git commit (or at least check git status). Moving a conversation to another agent does not move your files, uncommitted edits or running processes, so the code itself has to be saved in the folder the next agent opens." },
  { name: "Hand off the conversation", text: "Use a free tool like Agent Archive: run agent-archive handoff, pick the Claude Code or Codex session, choose the other agent, and it starts with that conversation as context. Without a tool, ask the first agent to write a short summary of the task, decisions and next steps into a file, and give that file to the new agent." },
  { name: "Tell the new agent what to check first", text: "Start with: read the handoff, run the tests, and tell me what is done and what is left before you change anything. This catches misunderstandings before the new agent edits code." },
  { name: "Next time, pick a setup that makes switching easy", text: "A model-agnostic agent like Cusp or OpenCode lets you change the model under the same agent, and a multiplexer like Corgi keeps several agents running in one terminal so you can move between them." },
];
const faq = [
  { q: "Why would I switch coding agents in the middle of a task?", a: "Usually because you hit a usage limit on one plan, one agent is stuck on a bug, or a newer model is better at the job. Claude Code, Codex and others each have limits, so switching is often cheaper than waiting or upgrading." },
  { q: "Does a handoff move my code too?", a: "No. Agent Archive's docs are explicit that a handoff transfers filtered conversation context only. Your files, uncommitted edits and running processes stay where they are, which is why you commit first and open the next agent in the same project folder." },
  { q: "Can I keep one agent and just change the model?", a: "Yes. Model-agnostic agents such as Cusp and OpenCode work with many providers, including Claude, GPT, Gemini and open models, through your own keys or a router like OpenRouter. Cusp says you can switch models mid-session and keep the context." },
  { q: "Are these tools free?", a: "Agent Archive and Corgi are free and open source (MIT). Cusp has a free account with 2,500 agent actions a month on your own API keys, and paid plans from $16 a month billed yearly. You still pay for the AI models or subscriptions you use." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to switch AI coding agents without losing your work", description: g.description, totalTime: "PT10M",
      tool: ["Git", "Agent Archive", "Cusp", "Corgi"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["agent-archive", "cusp", "corgi", "opencode"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to switch AI coding agents (or models) without losing your work</h1>
      <p className="text-lg text-gray-400">A plain-English guide for vibe coders. About a 4-minute read. Updated October 26, 2026.</p>
      <p>You are halfway through a feature with <T s="claude-code">Claude Code</T> and it says you have hit your usage limit. Or <T s="openai-codex">Codex</T> keeps going in circles on a bug. The obvious fix is to try another agent, but the new one knows nothing about what you were doing. Here is a simple routine to switch without starting over, plus three tools that launched or hit Hacker News this month to make it easier.</p>

      <H2>The 5-step switch</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="what-moves">What moves, and what doesn&apos;t</H2>
      <p>Think of two separate things: the <b>code</b> (files in your project folder, tracked by git) and the <b>conversation</b> (what you told the agent, what it tried, what it decided). The code is already shared by any agent you open in the same folder, as long as it is saved. The conversation lives inside each agent and is what gets lost. A handoff tool copies the conversation; git takes care of the code.</p>

      <H2 id="agent-archive">Hand off a session with Agent Archive</H2>
      <p><T s="agent-archive">Agent Archive</T> is a free, open-source command-line tool (macOS and Linux) that continues a Claude Code session in Codex, or the other way round. Install it and run the handoff from your project folder:</p>
      <Code>{"# install (macOS or Linux)\ncurl -fsSL https://raw.githubusercontent.com/wangjohn/agent-archive/v0.2.2/install.sh | AGENT_ARCHIVE_VERSION=v0.2.2 sh\n\n# pick a past session and the agent to continue in\ncd my-project\nagent-archive handoff"}</Code>
      <p>Inside Claude Code you can also type <code>/handoff codex</code>. If you connect your own S3 or R2 storage bucket (optional), it also backs up your Claude Code, Codex and Cursor transcripts, lets you search old sessions, and shows tokens and estimated spend per agent.</p>

      <H2 id="no-tool">No tool? Use a handoff note</H2>
      <p>Before switching, ask the current agent:</p>
      <Code>{"Write HANDOFF.md: the goal, what is done, what is left,\nfiles you changed, decisions we made and why, and how to run the tests."}</Code>
      <p>Then open the new agent in the same folder and say: &quot;Read HANDOFF.md and AGENTS.md, run the tests, and tell me what is left before you change anything.&quot; It is low-tech, but it works with every agent.</p>

      <H2 id="one-agent">Or keep one agent and switch the model</H2>
      <p>The other approach is to stop switching agents and switch models instead. <T s="cusp">Cusp</T> (preview launched October 21, 2026) is a coding agent for desktop and terminal that works with Claude, GPT, Gemini, Grok, Qwen, local models and gateways like <T s="openrouter">OpenRouter</T>. It reads your existing AGENTS.md and CLAUDE.md, Claude Code settings, skills and MCP servers where they already are, and says you can change models mid-session with your context intact. <T s="opencode">OpenCode</T> is the free, open-source alternative that also lets you bring almost any provider.</p>

      <H2 id="side-by-side">Run several agents side by side</H2>
      <p>If you regularly use more than one agent, keep them all open. <T s="corgi">Corgi</T> is a free terminal multiplexer (like tmux) that runs Claude Code, Codex, Pi and OpenCode in panes and shows which one is working, which needs you and which is done, plus the files each one changed. Prefer a desktop app? <T s="orca">Orca</T> does the same with a visual interface. Our guide to <Link className="underline" href="/guides/run-ai-coding-agents-in-parallel">running several AI coding agents at once</Link> explains how to keep them from overwriting each other.</p>

      <H2>Check the work after a switch</H2>
      <p>A new agent picking up half-finished work is exactly when mistakes slip in. Run the tests and read the diff before you push; our <Link className="underline" href="/guides/check-ai-code-before-you-ship">checklist for AI-written code</Link> walks through it. Want to skip usage limits entirely for small tasks? You can <Link className="underline" href="/guides/run-an-ai-coding-model-on-your-laptop">run a free coding model on your own laptop</Link>.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Code moves with git; the conversation needs a handoff.</li><li>Commit first, then use Agent Archive or a HANDOFF.md note.</li><li>To avoid switching altogether, use a model-agnostic agent like Cusp or OpenCode.</li></ul>
      <p className="text-sm text-gray-500">Picking an agent? See our <Link className="underline" href="/use-case/coding-agents">best AI coding agents</Link>, <Link className="underline" href="/compare">side-by-side comparisons</Link>, or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
