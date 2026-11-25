import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("see-what-your-ai-agent-changed-before-you-merge")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Have the agent work on a branch, never on main", text: "Every agent task should end as a branch or a pull request you can look at, not as edits straight on main. Claude Code and Codex can work in their own branch if you ask; OpenComputer, a new open-source Slack agent, always delivers its work as a pull request." },
  { name: "Install a change map once", text: "Genesis (free, open source) is a small local tool plus a skill for Claude Code and Codex. Paste one install prompt into your agent, or run two commands. It calls no AI model itself and sends nothing anywhere." },
  { name: "Ask for a review of the branch", text: "In the agent, type /genesis review main (or $genesis review main in Codex). Genesis finds every change since main itself, draws the business flow it touches (like checkout or sign-up) and opens as a page in your browser." },
  { name: "Read the colors, not the code", text: "Each change gets a verdict: red (no test covers it), yellow (a test runs it but would still pass if it broke), white (unclear) or green (a test really checks it). Red and yellow on anything involving money, logins or user data means: don't merge yet." },
  { name: "Send the agent back to fix the gaps, then merge yourself", text: "Paste the red and yellow items back to the agent and ask it to add a test that would fail if the change broke, or to undo changes you didn't ask for. Run the review again, paste summary.md into the pull request, and only then click merge yourself." },
];
const faq = [
  { q: "I can't read code. Can I still review what my AI agent changed?", a: "Yes, mostly. Tools like Genesis translate the diff into plain sentences on a map of your app (\"a card charge that times out is retried up to 3 times\") and tell you whether a test checks each one. You still decide, but you decide on sentences instead of code. For anything with payments, logins or personal data, also follow our check-before-you-ship checklist." },
  { q: "What does \"a test runs it but would still pass if it broke\" mean?", a: "Your tests touch that code but never check the result that matters. Example from Genesis's own docs: tests ran the checkout code, but none tried to buy the last item twice, so a change that let two shoppers pay for the same last unit still passed. These are the changes agents most often call \"covered\" when they aren't." },
  { q: "Does Genesis send my code anywhere or cost money?", a: "The Genesis tool is free (Apache-2.0), calls no model and sends nothing anywhere. The reading is done by the agent you already use (Claude Code or Codex), so it uses that agent's normal plan or tokens. It works on Python, TypeScript, JavaScript, Go, Java, Rust and more, with the most accurate results on Python." },
  { q: "Does Genesis run my tests?", a: "No. It reads your tests and judges whether they check each change. Keep running your real tests too, ideally automatically on every pull request; our quality-gate guide shows how." },
  { q: "Can the agent open the pull request without my laptop being on?", a: "Yes, with a cloud agent. OpenComputer (open source, launched on Hacker News November 20, 2026) works from Slack: mention @Computer with the task, it runs Claude Code, Codex or OpenCode on its own cloud computer and opens a pull request. It has a 3-day free trial, then Pro is $20 a month for the whole Slack workspace, and you can use your existing Claude or ChatGPT subscription for the model. Review that PR the same way before merging." },
  { q: "Is there a free way to do all this without an AI bill?", a: "Partly. LocalCode (free, open source) runs a coding agent on an Apple Silicon Mac with 16GB+ memory using free local models, so everyday edits cost nothing. Genesis's install covers Claude Code and Codex (other agents are in its install guide), so you may still use one of those for the review step." },
];
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to see what your AI coding agent changed (and whether a test checks it) before you merge", description: g.description, totalTime: "PT20M",
      tool: ["Genesis", "Claude Code", "OpenAI Codex", "OpenComputer", "LocalCode"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["genesis", "opencomputer", "localcode", "claude-code", "openai-codex", "pandex"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to see what your AI coding agent actually changed (and whether a test checks it) before you merge</h1>
      <p className="text-lg text-gray-400">A plain-English guide for vibe coders who can&apos;t read every diff. About a 5-minute read. Updated November 24, 2026.</p>
      <p>You asked your agent for one thing, it says &quot;done, all tests pass&quot;, and the pull request touches 14 files. Did it also change how payments retry? Is anything it touched actually tested? This week <T s="genesis">Genesis</T>, a free open-source tool, launched to answer exactly that: it draws your app as a flow map, puts each of the agent&apos;s changes on it and tells you, in plain sentences, which ones no test really checks. Here&apos;s a 5-step routine built around it.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="branch">Step 1: Agent work lands on a branch or pull request</H2>
      <p>Before the agent starts, say: &quot;Work on a new branch called fix-checkout and don&apos;t touch main.&quot; Running several agents? Give each its own branch (our <Link className="underline" href="/guides/run-ai-coding-agents-in-parallel">parallel agents guide</Link> explains worktrees). If you&apos;d rather hand off work from Slack, <T s="opencomputer">OpenComputer</T> (open source, Show HN November 20, 2026) takes a task when you mention @Computer in a thread, runs Claude Code, Codex or OpenCode on its own cloud computer and opens a pull request, so nothing lands on main by itself.</p>

      <H2 id="install">Step 2: Install Genesis (once)</H2>
      <p>The easiest way: open your project in Claude Code or Codex and paste this prompt from the Genesis README:</p>
      <Code>{"Install Genesis by following https://raw.githubusercontent.com/GenesisAgentInfra/genesis/main/docs/install.md, then review my latest commit with it and tell me how to open the result."}</Code>
      <p>Or install it yourself on macOS or Linux (you need <a className="underline" href="https://docs.astral.sh/uv/getting-started/installation/" rel="noopener" target="_blank">uv</a> and Git):</p>
      <Code>{"uv tool install --python 3.12 \"git+https://github.com/GenesisAgentInfra/genesis#subdirectory=packages/genesis_ci\"\n\"$(uv tool dir --bin)/genesis\" agent install --agent claude   # or --agent codex, or --agent both"}</Code>
      <p>Your project must be a Git repository with at least one commit. New to running someone else&apos;s GitHub project? Read <Link className="underline" href="/guides/check-a-repo-before-you-run-it">how to check a repo before you run it</Link> first.</p>

      <H2 id="review">Step 3: Ask for a review</H2>
      <Code>{"/genesis review main     # what changed since main, and does a test check it?\n/genesis map             # draw the whole app as it is now (great for code you didn't write)"}</Code>
      <p>In Codex the skill is <code>$genesis</code>. You can also just ask in plain language. When it finishes, open <code>.genesis/out/latest/view.html</code> in your browser. Next to it is <code>summary.md</code>, ready to paste into the pull request.</p>

      <H2 id="verdicts">Step 4: Read the colors</H2>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-white"><tr><th className="py-2 pr-4">Verdict</th><th className="py-2 pr-4">What it means</th><th className="py-2">What to do</th></tr></thead><tbody className="divide-y divide-white/10">
        <tr><td className="py-2 pr-4">🔴 No coverage found</td><td className="py-2 pr-4">No test reaches this change at all</td><td className="py-2">Ask for a test, or undo the change if you didn&apos;t ask for it</td></tr>
        <tr><td className="py-2 pr-4">🟡 Behavior not checked</td><td className="py-2 pr-4">A test runs the code but would still pass if it broke</td><td className="py-2">The sneaky one: ask for a test that fails when this breaks</td></tr>
        <tr><td className="py-2 pr-4">⚪ Coverage unclear</td><td className="py-2 pr-4">Genesis can&apos;t tell from reading the tests</td><td className="py-2">Check by hand if it touches money, logins or user data</td></tr>
        <tr><td className="py-2 pr-4">✅ Behavior checked</td><td className="py-2 pr-4">A test really checks this result</td><td className="py-2">Fine, still glance at the sentence</td></tr>
      </tbody></table></div>
      <p>Click a step on the map to see what changed there and the code behind it. Watch for changes you never asked for: in Genesis&apos;s own example, an agent asked for guest checkout also made card charges retry three times with no protection against double-charging. Two limits to know: Genesis reads tests rather than running them, and it is most accurate on Python. In the makers&apos; small benchmark (10 commits), Claude Code flagged &quot;tested but not really checked&quot; changes 38% of the time with Genesis versus 8% without, so it helps a lot but doesn&apos;t catch everything.</p>

      <H2 id="fix">Step 5: Send it back, then merge yourself</H2>
      <p>Paste the red and yellow items back to the agent:</p>
      <Code>{"For each red or yellow item in .genesis/out/latest/summary.md, either add a test that would FAIL if that behavior broke,\nor revert the change if it wasn't part of my request. Don't change anything else. Then run /genesis review main again."}</Code>
      <p>When the map is green where it matters, paste <code>summary.md</code> into the pull request, make sure your automatic checks pass (see our <Link className="underline" href="/guides/keep-ai-code-behind-a-quality-gate">quality-gate guide</Link>) and click merge yourself.</p>

      <H2 id="extras">Two more new tools worth knowing</H2>
      <ul className="list-disc space-y-2 pl-6">
        <li><b>A free agent on your Mac:</b> <T s="localcode">LocalCode</T> (open source, on Hacker News November 22, 2026) runs a coding agent with free local models on an Apple Silicon Mac with 16GB+ memory: <code>uv pip install localcode</code>, then <code>localcode</code> in your project. It runs tests and Git inside the project and asks before touching anything outside it. See our <Link className="underline" href="/guides/run-an-ai-coding-model-on-your-laptop">local model guide</Link>.</li>
        <li><b>Real law for your agent:</b> building something legal, HR or compliance-related for Europe? <T s="pandex">Pandex</T> gives your agent official EU and European national law and court decisions over MCP, so it quotes the real text with a source instead of guessing (still not legal advice).</li>
      </ul>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Agent work always lands on a branch or pull request, never straight on main.</li><li>Run <code>/genesis review main</code> and read the colors: red and yellow on money, logins or user data means don&apos;t merge yet.</li><li>Send the gaps back to the agent, re-run the review, and merge yourself.</li></ul>
      <p className="text-sm text-gray-500">Thinking of letting AI approve routine pull requests? Here&apos;s <Link className="underline" href="/guides/let-ai-review-and-approve-your-pull-requests">a safe setup for AI review, fixes and approvals</Link>. Related: <Link className="underline" href="/guides/check-ai-code-before-you-ship">check AI code before you ship</Link>, <Link className="underline" href="/guides/keep-ai-code-behind-a-quality-gate">keep AI code behind a quality gate</Link>, <Link className="underline" href="/guides/know-which-ai-coding-agent-needs-you">know which agent needs you</Link>, <Link className="underline" href="/use-case/coding-agents">best coding agents</Link>, or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
