import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("know-which-ai-coding-agent-needs-you")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Pick one place where all your agents live", text: "Stop opening a new terminal tab for every agent. Pick one workspace that knows what each agent is doing: trix if you like the terminal (free, open source), Herdr if you want a desktop app (free, open source), or DreamCoder if you want a visual workspace in your browser that also works on your phone (free for personal use). All three run Claude Code, Codex and other agents you already pay for." },
  { name: "Give every agent its own branch", text: "Two agents editing the same files is how work gets overwritten. trix can start each agent in its own git worktree (a separate copy of your project on its own branch), so agents running at the same time never touch each other's files. In other workspaces, ask each agent to work in its own worktree before it starts." },
  { name: "Let the agent ping you, then jump straight to it", text: "Turn on the workspace's notifications so a waiting agent comes to you instead of you hunting for it. In trix, a red bar, a desktop notification and a bell fire when an agent needs you, and alt+a jumps to the one that has waited longest. In DreamCoder, a minimap shows every pane pulsing while it works and clearly marked when it's blocked." },
  { name: "Answer permission prompts yourself, and fewer of them", text: "Most of the waiting is permission prompts. Pre-approve the boring, safe commands in your agent's settings (running tests, reading files) and keep anything that deletes, deploys, pays or emails on manual. trix never answers a permission prompt for you, which is the right default while you're starting out." },
  { name: "Review finished work in batches", text: "When an agent finishes, don't merge on the spot. Let a few finish, then review each diff, run your checks and merge yourself. trix marks finished work you haven't looked at yet, so nothing slips through." },
];
const faq = [
  { q: "How many AI coding agents should a beginner run at once?", a: "Start with two: one building a feature and one fixing small bugs or writing tests. Add a third only when you can review everything they finish the same day. More agents than you can review just piles up unreviewed code." },
  { q: "Why not just use tmux or terminal tabs?", a: "tmux and tabs don't know what an agent is doing, so you end up cycling through them to see which one is stuck on a question. Agent workspaces like trix get the state straight from the agent (working, needs you, done, idle) and tell you, so you only look when something needs you." },
  { q: "trix, Herdr or DreamCoder: which should I pick?", a: "If you already live in the terminal, trix: install it with one Homebrew command and keep your agents exactly as they are. If you want a regular desktop app with tabs per task, Herdr. If you want a visual workspace with a minimap of every agent that you can also open from your phone, DreamCoder. All three are free to start." },
  { q: "Can I check on my agents from my phone?", a: "Yes. DreamCoder runs on your computer and you reach it from any browser, including your phone. Thrum sends permission prompts to a web inbox or Telegram. Keep the risky approvals for when you can read the full request." },
  { q: "Running five agents is expensive. How do I keep the bill down?", a: "Run the simple jobs on a cheaper model. Inkling 2 Mini (free, open weights, released November 20, 2026) runs on a Mac with 32GB+ memory through Ollama with no API bill, and Z.ai's GLM Coding Plan (from $18 a month) now includes the new GLM-5.4 model for Claude Code, OpenCode, Cline and Kilo Code. Our model guide compares more options." },
];
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to run several AI coding agents without babysitting them", description: g.description, totalTime: "PT30M",
      tool: ["trix", "Herdr", "DreamCoder", "Inkling 2 Mini", "GLM-5.4"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["trix", "dreamcoder", "herdr", "thrum", "inkling-2-mini", "glm-5-4", "claude-code", "openai-codex"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to run several AI coding agents without babysitting them (and know the moment one needs you)</h1>
      <p className="text-lg text-gray-400">A plain-English guide for vibe coders running more than one agent. About a 5-minute read. Updated November 23, 2026.</p>
      <p>Running three Claude Code or Codex agents at once sounds great until you spend the afternoon clicking through tabs to find the one that has been waiting 20 minutes for a &quot;yes&quot;. This week two new tools went after exactly that problem: <T s="trix">trix</T>, a terminal workspace that shows which agent needs you, and <T s="dreamcoder">DreamCoder</T>, a browser-based workspace from the author of Mastering Emacs. Here&apos;s a 5-step routine that works with them, or with <T s="herdr">Herdr</T>, so your agents come to you.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="pick">Step 1: Pick one place where your agents live</H2>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-white"><tr><th className="py-2 pr-4">Tool</th><th className="py-2 pr-4">What it is</th><th className="py-2 pr-4">Price</th><th className="py-2">Pick it if</th></tr></thead><tbody className="divide-y divide-white/10">
        <tr><td className="py-2 pr-4"><T s="trix">trix</T></td><td className="py-2 pr-4">Terminal workspace: agents side by side, red bar + notification when one needs you, alt+a to jump there</td><td className="py-2 pr-4">Free, open source (MIT)</td><td className="py-2">You already use the terminal and want the lightest setup</td></tr>
        <tr><td className="py-2 pr-4"><T s="herdr">Herdr</T></td><td className="py-2 pr-4">Desktop app: a space per repo, a tab per task, shows working, done or waiting</td><td className="py-2 pr-4">Free, open source (Apache-2.0)</td><td className="py-2">You prefer a normal app window to a terminal</td></tr>
        <tr><td className="py-2 pr-4"><T s="dreamcoder">DreamCoder</T></td><td className="py-2 pr-4">Coding harness in your browser: tiling panes, a minimap per workspace, sub-agents, MCP, works from your phone</td><td className="py-2 pr-4">Free for personal use and teams up to 5; $20/seat/month after that</td><td className="py-2">You want a visual overview of many agents and to check in from your phone</td></tr>
      </tbody></table></div>
      <p>Already happy with <T s="orca">Orca</T> or <T s="buddylist">buddylist</T>? Keep them; the steps below are the same. The point is one place, not five terminal windows.</p>

      <H2 id="setup">Step 2: Set it up with a branch per agent</H2>
      <p>With trix (macOS or Linux), install it and start two agents in your project folder:</p>
      <Code>{"brew install leofle/trix/trix\ncd ~/code/my-app\ntrix claude codex shell      # opens Claude Code, Codex and a shell side by side"}</Code>
      <p>On a Mac, set your terminal&apos;s Option key to send Alt first, because every trix shortcut is alt+something. To give an agent its own branch, start it with a worktree:</p>
      <Code>{"trix spawn claude --name api --worktree --prompt \"add rate limiting to /login\"\ntrix ls                      # every agent, its state and branch"}</Code>
      <p>For DreamCoder, the download page has a one-line installer for macOS and Linux and a Windows setup package; it then opens at <code>http://localhost:9889</code> and can import your existing Codex, OpenCode or Pi model settings. DreamCoder itself has full access to your computer, so its author suggests the Docker image if you want it contained. New to worktrees? Our <Link className="underline" href="/guides/run-ai-coding-agents-in-parallel">parallel agents guide</Link> explains them in plain English.</p>

      <H2 id="ping">Step 3: Let the agent ping you</H2>
      <p>In trix you&apos;ll see five states at a glance: working, needs you, done, idle and unseen. Learn three keys and you&apos;re set:</p>
      <Code>{"alt+a   jump to the agent that has waited on you longest (or to unseen finished work)\nalt+g   see all agents side by side, the ones waiting on you in red\nalt+d   detach: close the window, agents keep running in the background"}</Code>
      <p>Because agents run in a background server, closing the terminal doesn&apos;t stop them, and after a crash each one picks up the conversation it was in.</p>

      <H2 id="permissions">Step 4: Fewer permission prompts, but answered by you</H2>
      <p>Allow the safe, repetitive commands (running tests, listing files, reading docs) in your agent&apos;s settings, and keep anything that deletes data, deploys, spends money or sends email on manual. Tools like <T s="thrum">Thrum</T> can bring permission prompts to Telegram or a web inbox so you can answer from your phone; read the whole request before you tap yes. For agents that need to run freely, use a sandbox instead of &quot;allow everything&quot;: see our <Link className="underline" href="/guides/run-ai-coding-agents-in-a-sandbox">sandbox guide</Link>.</p>

      <H2 id="review">Step 5: Review finished work in batches</H2>
      <p>When agents finish, review each one&apos;s diff, run your tests and merge yourself, one branch at a time. Our <Link className="underline" href="/guides/check-ai-code-before-you-ship">check AI code before you ship</Link> checklist and <Link className="underline" href="/guides/keep-ai-code-behind-a-quality-gate">quality-gate guide</Link> show how.</p>

      <H2 id="cost">Running more agents without a bigger bill</H2>
      <ul className="list-disc space-y-2 pl-6">
        <li><b>A free model on your own laptop:</b> <T s="inkling-2-mini">Inkling 2 Mini</T> from Thinking Machines (open weights, Apache-2.0, released November 20, 2026) needs about 20GB of memory; Ollama suggests a Mac with 32GB or more. Hand it the simple jobs: <code>ollama launch claude --model inkling-2-mini</code> starts Claude Code on it. Our <Link className="underline" href="/guides/run-an-ai-coding-model-on-your-laptop">local model guide</Link> covers setup.</li>
        <li><b>A cheap monthly plan:</b> <T s="glm-5-4">GLM-5.4</T>, Z.ai&apos;s new flagship coding model announced today, is in the GLM Coding Plan (from $18 a month) and works in Claude Code, OpenCode, Cline and Kilo Code. Z.ai warns it can overthink, so give it clear, bounded tasks.</li>
      </ul>
      <p>See <Link className="underline" href="/guides/pick-an-ai-model-for-your-coding-agent">which model your coding agent should use</Link> and <Link className="underline" href="/guides/cut-your-ai-agent-token-bill">how to cut your token bill</Link> for more.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Put all your agents in one workspace that knows their state (trix, Herdr or DreamCoder), each on its own branch.</li><li>Let waiting agents ping you and jump straight to them instead of cycling tabs.</li><li>Pre-approve only safe commands, answer risky prompts yourself, and review finished work in batches before you merge.</li></ul>
      <p className="text-sm text-gray-500">Related: <Link className="underline" href="/guides/run-ai-coding-agents-in-parallel">run agents in parallel</Link>, <Link className="underline" href="/guides/switch-ai-coding-agents-without-losing-work">switch agents without losing work</Link>, <Link className="underline" href="/guides/speed-up-github-actions-for-ai-agent-prs">speed up checks for agent PRs</Link>, <Link className="underline" href="/use-case/coding-agents">best coding agents</Link>, or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
