import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("speed-up-github-actions-for-ai-agent-prs")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Find out what is actually slow (free)", text: "Install StarSling's free, open-source agent skills in Claude Code, Codex, Cursor or OpenCode and run /ci-speedup. It reads your recent GitHub Actions runs through your own gh login, finds the check that makes pull requests wait, and hands your agent the evidence to shorten it. StarSling says it doesn't send your code or CI data to its servers." },
  { name: "Check that your CI can't be hijacked", text: "Agent PRs mean more code you didn't write running in your workflows. Run /ci-secure to scan for ten common ways attackers take over GitHub Actions, read each finding in plain English and fix the ones you pick. Run /ci-score for a pass/fail grade of the rest of your setup." },
  { name: "Try a faster runner with a one-line change", text: "If your checks are still slow, try StarSling's runners: change runs-on: ubuntu-latest to runs-on: starsling-ubuntu-26.04 in one workflow. New accounts get 2,000 free minutes in the first month, so compare the time and cost on your real jobs before committing." },
  { name: "Feed agents work through a queue with approvals", text: "Instead of firing off prompts from five terminals, put the work on a board. Mastra Factory (open source) turns GitHub issues, Linear tickets or a Slack mention into investigations, plans and pull requests, and can wait for you to accept the task and approve the plan before any code is written." },
  { name: "Keep a human on the merge button", text: "Faster CI is for getting answers sooner, not for merging without looking. Make your checks required on main, read every agent PR's diff and checks, and merge yourself. In Mastra Factory's own walkthrough, the merge happens through your repo's normal review process; keep it that way." },
];
const faq = [
  { q: "What is CI, in plain English?", a: "CI (continuous integration) is a robot that runs your checks, like the build, typecheck and tests, every time someone opens or updates a pull request. On GitHub it's called GitHub Actions, and it's set up with YAML files in your repo's .github/workflows folder. A green check means those tests passed on that exact change." },
  { q: "Why does CI suddenly feel slow when I use AI agents?", a: "Because agents open far more pull requests than a person does, and each one runs the full set of checks. Ten agent PRs an hour means ten builds an hour, so jobs queue up and the monthly minutes (and bill) climb. Mastra, for example, says it now merges hundreds of PRs a week across its repos." },
  { q: "Do I need to pay for anything to start?", a: "No. The StarSling skills (ci-speedup, ci-score, ci-secure) are free and MIT-licensed, and Mastra Factory is free and Apache-2.0 if you host it yourself. StarSling's runners are paid after the 2,000 free first-month minutes, and you pay your own model provider for the agents' tokens." },
  { q: "Will these skills change my workflows without asking?", a: "The skills hand your coding agent evidence and suggested fixes; your agent drafts the change and you review it like any other edit. ci-secure fixes only the findings you pick. Commit first so you can undo anything you don't like." },
  { q: "Is it safe to let agents open pull requests on my repo?", a: "Yes, if the merge stays with you. Give agents their own branches, require your checks to pass, read the diff, and never let an agent merge to main on its own. Our quality-gate guide shows how to set that up." },
];
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to speed up (and secure) GitHub Actions when AI agents open lots of pull requests", description: g.description, totalTime: "PT30M",
      tool: ["StarSling skills", "StarSling Runners", "Mastra Factory"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["starsling", "mastra-factory", "claude-code", "openai-codex", "cursor", "opencode", "gemini-4-neon"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">Your AI agents open PRs faster than your checks can run: how to speed up (and secure) GitHub Actions</h1>
      <p className="text-lg text-gray-400">A plain-English guide for vibe coders whose agents keep pull requests waiting on CI. About a 6-minute read. Updated November 19, 2026.</p>
      <p>Once you run more than one coding agent, a new bottleneck shows up: every agent pull request has to wait for the build and tests in GitHub Actions, and the queue (and the bill) grows. This week two launches went straight at that problem: <T s="starsling">StarSling</T>, fast GitHub Actions runners with agents that tune your CI (Launch HN, November 17), and <T s="mastra-factory">Mastra Factory</T>, an open-source &quot;software factory&quot; that turns issues into reviewed pull requests (Show HN, November 18). Here&apos;s a 5-step routine you can start for free.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="speedup">Step 1: Find out what is actually slow</H2>
      <p>Don&apos;t guess. StarSling publishes four free, open-source (MIT) agent skills that work with <T s="claude-code">Claude Code</T>, <T s="openai-codex">Codex</T>, <T s="cursor">Cursor</T>, <T s="opencode">OpenCode</T> and other agents supported by the Skills CLI. Open your project folder in a terminal, make sure the GitHub CLI is logged in, and install them:</p>
      <Code>{"gh auth status                     # the skills read your Actions runs through gh\nnpx skills add starslingdev/skills # pick ci-speedup, ci-score, ci-secure (and sling)\n# then, inside your coding agent:\n/ci-speedup"}</Code>
      <p>ci-speedup finds the checks that block your pull requests, measures recent job and step times, and explains the likely causes (for example, caches that miss or a test suite that could be split across machines). Your agent then drafts the fix. Review it like any other change, and commit before you start so you can undo it.</p>

      <H2 id="secure">Step 2: Check that your CI can&apos;t be hijacked</H2>
      <p>More pull requests from code you didn&apos;t write means more chances for a bad workflow or a hijacked dependency to run with your repo&apos;s secrets. Run <code>/ci-secure</code>: it scans your workflows for ten critical attack paths, explains each one as a plain-English attacker scenario, and fixes only the ones you pick. Then run <code>/ci-score</code>, which grades your setup against a published best-practice rubric and ranks a fix for every gap. Not sure a repo is safe to run at all? See our <Link className="underline" href="/guides/check-a-repo-before-you-run-it">check-a-repo-first guide</Link>.</p>

      <H2 id="runners">Step 3: Try a faster runner with a one-line change</H2>
      <p>If your checks are still slow after the fixes, the machine itself may be the limit. StarSling&apos;s runners are a drop-in replacement for GitHub&apos;s Linux runners; you change one line in a workflow file:</p>
      <Code>{"jobs:\n  build:\n    runs-on: starsling-ubuntu-26.04   # was: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm test"}</Code>
      <p>Each job gets its own fresh sandbox, so a burst of agent PRs runs at once instead of queueing. StarSling lists the default 4 vCPU runner at $0.008 per minute against GitHub&apos;s $0.012 for the same size, billed per second, and new accounts get 2,000 free minutes in the first month. Its agents also study your runs and send speed-up PRs with before-and-after benchmarks; StarSling says it took Mastra&apos;s slowest workflow from about 30 minutes to about 5. Those are the company&apos;s numbers, so try one workflow and compare your own timings before switching everything.</p>

      <H2 id="factory">Step 4: Feed agents work through a queue with approvals</H2>
      <p>Firing prompts from five terminals is how you end up with ten half-finished PRs. <T s="mastra-factory">Mastra Factory</T> gives agents a kanban board instead: work comes in from GitHub issues, Linear or an @-mention in Slack, each card gets an investigation, a plan and a pull request built in its own sandbox, and you choose which stages wait for you. Start it in its own folder, separate from your app:</p>
      <Code>{"npm create factory@latest my-factory\ncd my-factory\nnpm run dev   # open the local URL, connect your GitHub repo and a model provider"}</Code>
      <p>For your first run, keep the board&apos;s phases waiting for you, try a tiny documentation issue, and approve the plan only when it touches the right files. Running several agents by hand instead? Our <Link className="underline" href="/guides/run-ai-coding-agents-in-parallel">guide to running agents in parallel</Link> covers worktrees and branches.</p>

      <H2 id="merge">Step 5: Keep a human on the merge button</H2>
      <p>Faster checks get you answers sooner; they don&apos;t make the code right. Make your checks required on <code>main</code>, read each agent PR&apos;s diff and test results, and merge it yourself. Mastra Factory opens pull requests and runs a separate review session, and its walkthrough leaves the merge to your repo&apos;s normal process. Our <Link className="underline" href="/guides/keep-ai-code-behind-a-quality-gate">quality-gate guide</Link> shows how to make &quot;tests pass and a person said yes&quot; the only way in, and the <Link className="underline" href="/guides/check-ai-code-before-you-ship">check-AI-code checklist</Link> tells you what to look for.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Measure first: the free /ci-speedup skill shows which check keeps your PRs waiting.</li><li>Lock it down with /ci-secure, then try a faster runner on one workflow using the free first-month minutes.</li><li>Queue agent work with approvals (Mastra Factory) and always merge yourself.</li></ul>
      <p className="text-sm text-gray-500">Related: <Link className="underline" href="/guides/keep-ai-code-behind-a-quality-gate">keep AI code behind a quality gate</Link>, <Link className="underline" href="/guides/run-ai-coding-agents-in-parallel">run AI coding agents in parallel</Link>, <Link className="underline" href="/guides/pick-an-ai-model-for-your-coding-agent">pick the right AI model for your coding agent</Link>, <Link className="underline" href="/guides/use-a-github-repo">use a GitHub repo</Link>, <Link className="underline" href="/use-case/coding-agents">best AI coding agents</Link>, or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
