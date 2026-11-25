import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("let-ai-review-and-approve-your-pull-requests")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Lock main so nothing merges without a pull request", text: "In GitHub, add a branch rule for main that requires a pull request and passing status checks. Then no agent, and no tired you, can push straight to the live branch. On a team, also require one approval." },
  { name: "Get an AI review on every pull request", text: "Solo: run /ship (or /code-review) in Claude Code on a finished change. Team on Claude Team or Enterprise: turn on Claude Ship's Code Review for one repository with a monthly spend limit. Read the Important findings first." },
  { name: "Let a fixer agent make the pull request green, but not merge it", text: "/ship keeps watching your pull request and pushes fixes for failing checks, conflicts and review comments; Claude Ship's PR Steward does the same in the cloud for a team. Both are designed never to merge. Each fix is a commit you can undo." },
  { name: "Write an approval policy and run it in observe mode", text: "Add .claude/approvals.yml with mode: observe. Let Claude approve routine changes only when its review passes, and always require a person for payments, logins, database migrations and the policy file itself. In observe mode it only shows what it would decide." },
  { name: "Turn it on only after it agrees with you", text: "Compare its decisions with yours for a couple of weeks. When they match, delete the mode: observe line, make Claude Approvals a required check in GitHub, and keep clicking merge yourself on anything that touches money or user data." },
];
const faq = [
  { q: "Is it safe to let AI approve my pull requests?", a: "For routine, low-risk changes (copy, tests, docs, small UI fixes) it can be, if an AI review passed first and your automatic checks run on every pull request. For payments, logins, user data and database changes, keep a person. Claude Ship's own FAQ says it uses AI and may miss bugs or security issues, and Anthropic recommends starting Claude Approvals in observe mode, where it approves nothing." },
  { q: "Do I need a Claude Team or Enterprise plan?", a: "For Claude Ship (Code Review, PR Steward and Claude Approvals across a whole repository), yes, and the repository has to be on GitHub. As a single developer you can still run /ship or /code-review inside Claude Code (version 2.1.330 or later, with the GitHub CLI signed in) on your own change; that work counts against your normal Claude Code usage." },
  { q: "What does Claude Ship cost?", a: "It is usage-based, billed by tokens from your organization's usage credits. Admins set monthly spend limits for Code Review and PR Steward. Claude Approvals has no base charge, but classifiers in your policy and any Code Review it triggers are billed, even in observe mode. Anthropic suggests piloting on a few repositories with caps set first." },
  { q: "Can a pull request merge with nobody looking at it?", a: "Yes, if you set it up that way, so check for these: the Claude Approvals check isn't marked required in GitHub; the policy uses seats: 0 or seats: 1 (the author can fill a seat); GitHub's 'one approval' rule is satisfied by Claude's approving review; or GitHub auto-merge or a merge queue is on with a policy that needs no person. Keep at least one rule that always needs a human on sensitive paths." },
  { q: "I'm solo. GitHub won't let me approve my own pull request. What do I do?", a: "Don't tick 'Require approvals' on a solo repository, or you'll lock yourself out. Require a pull request and passing status checks instead, run /ship for the AI review and fixes, and be the one who clicks merge. Note that branch protection on private repositories needs a paid GitHub plan; on GitHub Free it works on public repositories." },
  { q: "Which agents open the pull requests in the first place?", a: "Any of them: Claude Code, Codex, Copilot, or newer ones like Viktor Code (give it a business goal from Slack and it opens PRs on GitHub, GitLab or Bitbucket) and Polylane (opens PRs that fix production problems it finds in your logs). This routine works the same for all of them, because every change arrives as a pull request." },
];
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
const policy = `# .claude/approvals.yml
version: 1
mode: observe   # shows what it WOULD decide; delete this line to enforce
rules:
  - purpose: "A change takes two people. When Claude's review passes, one is enough and Claude approves."
    paths: ["**"]
    verdict: { claude: comments, seats: 2 }
    override:
      - { if: "claude/code_review = pass", verdict: { claude: approves, seats: 1 } }
  - purpose: "Money, logins and database changes always take two people, and Claude doesn't approve."
    paths: ["**/billing/**", "**/payments/**", "**/auth/**", "**/migrations/**"]
    verdict: { claude: comments, seats: 2 }
  - purpose: "A change to the review rules takes two people."
    paths: ["**/.claude/**"]
    nested: inherit
    verdict: { claude: comments, seats: 2 }`;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to let AI review, fix and approve your pull requests safely", description: g.description, totalTime: "PT30M",
      tool: ["GitHub branch protection", "Claude Code /ship", "Claude Ship", "Viktor Code", "Polylane", "Granular"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["claude-ship", "claude-code", "viktor-code", "polylane", "granular", "github-copilot"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">Should you let AI review, fix and approve your pull requests? A beginner&apos;s safe setup</h1>
      <p className="text-lg text-gray-400">A plain-English guide for vibe coders and small teams. About a 6-minute read. Updated November 25, 2026.</p>
      <p>Your agents now open pull requests faster than anyone can read them. On November 23, 2026 Anthropic launched <T s="claude-ship">Claude Ship</T>, agents that review pull requests, fix them and, where your rules allow, approve them. That&apos;s useful, and also a new way to merge something nobody looked at. Here&apos;s a 5-step routine to get the speed without giving up control: AI does the reviewing and fixing, your rules decide what needs a person, and you still own the merge button for anything risky.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="lock">Step 1: Lock main</H2>
      <p>On GitHub, open your repository → <b>Settings</b> → <b>Branches</b> (or <b>Rules → Rulesets</b>) and add a rule for <code>main</code>. Tick:</p>
      <ul className="list-disc space-y-1 pl-6"><li><b>Require a pull request before merging</b>: every change, from you or an agent, arrives as a pull request.</li><li><b>Require status checks to pass</b>: pick your test and build checks (no checks yet? see our <Link className="underline" href="/guides/keep-ai-code-behind-a-quality-gate">quality-gate guide</Link>).</li><li><b>Require approvals</b> (teams only): GitHub won&apos;t let you approve your own pull request, so skip this if you work alone.</li></ul>
      <p>Branch protection on <i>private</i> repositories needs a paid GitHub plan; on GitHub Free it works on public ones.</p>

      <H2 id="review">Step 2: An AI review on every pull request</H2>
      <p><b>Solo, in Claude Code:</b> finish the change, then type:</p>
      <Code>{"/ship          # opens the PR (if needed), reviews it, then watches it and fixes what comes back\n/code-review   # just a review of your branch, no PR and no watch"}</Code>
      <p><code>/ship</code> needs Claude Code 2.1.330 or later, the GitHub CLI signed in (<code>gh auth login</code>) and git 2.38+. Heads-up: it can commit <i>all</i> your uncommitted files and push without asking (a line ending &quot;Esc to cancel&quot; gives you a few seconds), so run <code>git status</code> first and make sure no secrets or stray files are in there. If it made a commit you didn&apos;t want, <code>git reset HEAD~1</code> undoes it and keeps your files.</p>
      <p><b>A team on Claude Team or Enterprise:</b> an admin turns on Claude Ship&apos;s Code Review for <i>one</i> repository, picks Quick, Standard or Deep and sets a monthly spend limit. Findings are ranked Important, Nit or Pre-existing; read Important first. You can tune what it flags with a <code>REVIEW.md</code> file.</p>

      <H2 id="fix">Step 3: Let a fixer agent make it green (it won&apos;t merge)</H2>
      <p>After its review, <code>/ship</code> keeps &quot;watching&quot; your pull request from your Claude Code session and pushes fixes for failing checks, merge conflicts and reviewers&apos; comments (<code>/steward</code> does this on a PR that&apos;s already open, without a new review). For a team, <b>PR Steward</b> does the same in the cloud and comments after every push with what it changed and how to undo it. Start it in Manual mode, where a developer comments <code>@claude steward</code> to call it; comment <code>@claude stop</code> to make it step back. Both are designed not to approve or merge. One warning from Anthropic&apos;s docs: only run a watch on a repository where you trust everyone who can push to your branch, because their code runs on your computer with your credentials.</p>

      <H2 id="policy">Step 4: Write the approval policy (observe mode first)</H2>
      <p>Claude Approvals reads a file you add to your repository. This one is Anthropic&apos;s starter policy plus one extra rule we added for sensitive folders (rename the paths to match your project):</p>
      <Code>{policy}</Code>
      <p>How to read it: normally a change needs two people (the author counts as one). When Claude&apos;s review passes, one is enough and Claude can approve. When a pull request matches several rules, the <b>strictest</b> one wins, so anything in billing, payments, auth or migrations, or a change to the rules themselves, always needs a second person. Merge the file into <code>main</code>; each pull request then gets a <b>Claude Approvals</b> check whose title starts with &quot;(observe mode)&quot; while it&apos;s only watching.</p>

      <H2 id="enforce">Step 5: Enforce it only when it agrees with you</H2>
      <p>For a couple of weeks, compare the check&apos;s decision with what you would have done. When they match, delete the <code>mode: observe</code> line and, in your GitHub branch rule, make <b>Claude Approvals</b> a required check. Before you do, rule out the four ways a change can merge with no person looking:</p>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-white"><tr><th className="py-2 pr-4">Gap</th><th className="py-2">Fix</th></tr></thead><tbody className="divide-y divide-white/10">
        <tr><td className="py-2 pr-4">The Claude Approvals check isn&apos;t required in GitHub</td><td className="py-2">Add it to the required status checks for main</td></tr>
        <tr><td className="py-2 pr-4"><code>seats: 1</code> or <code>seats: 0</code> on sensitive paths</td><td className="py-2">Keep <code>seats: 2</code> and <code>claude: comments</code> on money, logins and data</td></tr>
        <tr><td className="py-2 pr-4">GitHub&apos;s &quot;1 approval&quot; rule is met by Claude&apos;s approval</td><td className="py-2">Remember Claude&apos;s approving review counts as that approval</td></tr>
        <tr><td className="py-2 pr-4">Auto-merge or a merge queue with a policy needing no person</td><td className="py-2">Turn auto-merge off for sensitive repos, or require a person in the policy</td></tr>
      </tbody></table></div>
      <p>A rule with <code>claude: approves</code> and no <code>if</code> starts no review by itself, so Claude could approve something nothing has reviewed. That&apos;s why the policy above only lets Claude approve when <code>claude/code_review = pass</code>. Also note the policy can&apos;t read your CI results, so keep your tests as their own required check.</p>

      <H2 id="extras">Three new tools that open the pull requests</H2>
      <ul className="list-disc space-y-2 pl-6">
        <li><b>Give it a goal, get PRs:</b> <T s="viktor-code">Viktor Code</T> (#4 on Product Hunt on November 24, 2026) takes a business outcome from Slack, Teams or Discord, splits it into code and non-code work and opens pull requests on GitHub, GitLab or Bitbucket for your review. Free to start with up to $100 in credits.</li>
        <li><b>Production fixes as PRs:</b> <T s="polylane">Polylane</T> watches your logs, metrics and traces, investigates when something drifts and opens a pull request with the fix. Free plan with no card; this week it added Swarms, several agents checking each other on hard incidents (paid plans).</li>
        <li><b>A visual home for several agents:</b> <T s="granular">Granular</T> (#2 on Product Hunt on November 24, 2026) is a Mac and Windows (beta) app where a boss agent hands work to worker agents, each on its own copy of your project, using your own Claude, Codex or Gemini subscription. Free to download; Pro is $12.99 a month.</li>
      </ul>
      <p>All three feed the same routine: the work shows up as a pull request, gets an AI review, and your rules decide who signs off.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Lock main: pull requests and passing checks only.</li><li>AI reviews and fixes every pull request (/ship solo, Claude Ship for teams); neither merges.</li><li>Write .claude/approvals.yml in observe mode, keep a human on money, logins and data, and enforce it only when it agrees with you.</li></ul>
      <p className="text-sm text-gray-500">Related: <Link className="underline" href="/guides/see-what-your-ai-agent-changed-before-you-merge">see what your agent changed before you merge</Link>, <Link className="underline" href="/guides/keep-ai-code-behind-a-quality-gate">keep AI code behind a quality gate</Link>, <Link className="underline" href="/guides/speed-up-github-actions-for-ai-agent-prs">speed up GitHub Actions for agent PRs</Link>, <Link className="underline" href="/guides/check-ai-code-before-you-ship">check AI code before you ship</Link>, <Link className="underline" href="/use-case/coding-agents">best coding agents</Link>, or <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
