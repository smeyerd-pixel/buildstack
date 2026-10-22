import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("run-ai-coding-agents-in-parallel")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Split the work into tasks that don't overlap", text: "Pick 2 to 3 jobs that touch different parts of the app, like a pricing page, a login bug and a new test. Two agents editing the same file is where parallel work goes wrong." },
  { name: "Give each agent its own copy of the code", text: "Use a git worktree (or a tool that makes them for you) so every agent works in its own folder on its own branch, and nobody overwrites anybody." },
  { name: "Start the agents with clear, separate prompts", text: "Open one agent per worktree, for example Claude Code in one and Codex in another, and give each a single goal plus the checks it must pass before saying done." },
  { name: "Review each result on its own", text: "Read each agent's diff summary, run the checks, and click through the feature. Throw away attempts that miss and keep the winner." },
  { name: "Merge one branch at a time", text: "Merge the best branch into main, run the checks again, then merge the next one. Delete worktrees you no longer need." },
];
const faq = [
  { q: "Do I need a special tool to run agents in parallel?", a: "No. Git worktrees are built into Git, and you can run a terminal agent in each folder. A tool like Orca just makes it easier to see every agent, its diff and its terminal in one window." },
  { q: "Does running several agents cost more?", a: "Usually, yes. Each agent uses your plan's usage or API credits on its own, so three agents can hit a usage limit about three times faster. Start with two." },
  { q: "What is the difference between a branch and a worktree?", a: "A branch is a line of changes inside your repo. A worktree is an extra folder on your computer with a different branch checked out, so two agents can edit two branches at the same time without switching back and forth." },
  { q: "Can agents run in parallel in the cloud instead of on my laptop?", a: "Yes. Several coding agents in our directory, including OpenAI Codex and Devin, can take tasks in the cloud, and Grok Build can split work across parallel subagents. Check each tool's page for its current plans." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to run several AI coding agents at once", description: g.description, totalTime: "PT20M",
      tool: ["Git", "Orca"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["orca", "heal"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to run several AI coding agents at once (without them breaking each other&apos;s work)</h1>
      <p className="text-lg text-gray-400">A plain-English guide to parallel AI coding for vibe coders. About a 5-minute read. Updated October 22, 2026.</p>
      <p>Once you are comfortable with one agent like <T s="claude-code">Claude Code</T> or <T s="openai-codex">Codex</T>, the obvious next step is to run two or three at once: one fixes a bug while another builds a page. It works, but only if every agent has its own copy of the code. Otherwise they edit the same files and undo each other. Here is the simple routine.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2>What a git worktree is (in one minute)</H2>
      <p>Your project is a Git repo. Normally you have one folder with one branch checked out. A <b>worktree</b> is an extra folder linked to the same repo, with a different branch checked out. Each agent gets its own folder, so they never collide, and Git still knows all the work belongs to one project. You can make one yourself from your project folder:</p>
      <Code>{"# make a new folder next to your project, on a new branch\ngit worktree add ../myapp-login-fix -b login-fix\n\n# see all your worktrees\ngit worktree list\n\n# when you're done (after merging)\ngit worktree remove ../myapp-login-fix"}</Code>
      <p>Then open a terminal in <code>../myapp-login-fix</code> and start your agent there. Repeat for each task.</p>

      <H2 id="orca">The easy way: Orca</H2>
      <p>If juggling folders and terminals sounds like a lot, <T s="orca">Orca</T> does it for you. It is a free, open-source (MIT) desktop app for macOS, Windows and Linux that runs Claude Code, Codex, <T s="opencode">OpenCode</T>, Grok and other terminal agents side by side, each in its own worktree. You use the agent subscriptions you already pay for. It crossed 100,000 GitHub stars on October 21, 2026.</p>
      <ul className="list-disc space-y-1 pl-6">
        <li><b>Parallel worktrees:</b> send one prompt to several agents, compare the results and keep the best one.</li>
        <li><b>Diff review:</b> comment on any changed line and send the comment back to the agent.</li>
        <li><b>Built-in browser with design mode:</b> click a part of your page to send it to the agent.</li>
        <li><b>Phone companion:</b> iOS and Android apps tell you when an agent finishes so you can send the next instruction.</li>
      </ul>
      <p>Install it from <a className="underline" href="https://www.onorca.dev" target="_blank" rel="noopener">onorca.dev</a>, or on a Mac with Homebrew:</p>
      <Code>{"brew install --cask stablyai/orca/orca"}</Code>

      <H2>Prefer the cloud?</H2>
      <p>You don&apos;t have to run everything on your laptop. <T s="openai-codex">OpenAI Codex</T> and <T s="devin">Devin</T> can take whole tasks in the cloud, and <T s="grok-build">Grok Build</T> splits a job across parallel subagents after you approve its plan. These are handy when your computer is off or the tasks are long.</p>

      <H2>Check every result before you merge</H2>
      <p>More agents means more code you didn&apos;t write. Use the same checks for every branch: typecheck, build, a real click-through (or <T s="reticle">Reticle</T>), and a diff summary you understand. Our <Link className="underline" href="/guides/check-ai-code-before-you-ship">checklist for AI-written code</Link> walks through it. Before a bigger release, <T s="heal">Heal</T> can run your whole app in a sandbox and report only bugs it can reproduce, each with a failing test.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Only run agents in parallel on tasks that don&apos;t touch the same files.</li><li>One worktree (folder + branch) per agent, made by hand with <code>git worktree add</code> or by Orca.</li><li>Review and merge one branch at a time, and start with two agents to keep usage costs down.</li></ul>
      <p className="text-sm text-gray-500">Picking an agent? See our <Link className="underline" href="/use-case/coding-agents">best AI coding agents</Link>, <Link className="underline" href="/compare">side-by-side comparisons</Link>, or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
