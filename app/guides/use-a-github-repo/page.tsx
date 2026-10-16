import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { guides } from "@/lib/guides";
import GuideGate from "@/components/GuideGate";
const g = guides[0];
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Open Claude Code", text: "Start Claude Code in your terminal the way you normally do." },
  { name: "Add the repo as a plugin marketplace", text: "Type: /plugin marketplace add anthropics/skills" },
  { name: "Install a set of skills", text: "Run /plugin, choose Browse and install plugins → anthropic-agent-skills → document-skills or example-skills → Install now. Or type /plugin install document-skills@anthropic-agent-skills" },
  { name: "Use the skill", text: "Just ask for it by name, for example: Use the PDF skill to extract the form fields from path/to/some-file.pdf" },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="pt-4 text-2xl font-bold text-white">{children}</h2>;
export default function Guide() {
  const jsonLd = { "@context": "https://schema.org", "@type": "HowTo", name: "How to install a skill from a GitHub repo into Claude Code", description: g.description, totalTime: "PT5M",
    tool: [{ "@type": "HowToTool", name: "Claude Code" }], step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) };
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to use someone else&apos;s GitHub repo</h1>
      <p className="text-lg text-gray-400">A plain-English guide for beginners. No coding background needed. About a 7-minute read.</p>

      <H2>First: what is a repo?</H2>
      <p>A <b>repo</b> (short for repository) is a project folder that lives on GitHub. It holds all the files for something someone built (code, instructions, images) plus the full history of every change.</p>
      <p>Think of it like a shared Google Drive folder that remembers every edit ever made. Anyone can look inside a public repo, and most let you copy and use what&apos;s there.</p>
      <p>The most important file is usually the <b>README</b>. It shows up on the repo&apos;s front page and is the instruction manual: what the project does and how to use it. <b>Always read the README first.</b></p>

      <H2>The 3 ways people use a repo</H2>
      <h3 className="pt-2 text-xl font-semibold text-white">1. Download it and run it yourself</h3>
      <p>You copy the whole folder to your computer and run it. You can click the green <b>Code</b> button → <b>Download ZIP</b>, or &quot;clone&quot; it with git, which keeps a live link so you can pull updates later:</p>
      <Code>{"git clone https://github.com/OWNER/REPO.git"}</Code>
      <p>After that, the README tells you how to start it (often something like <code>npm install</code> then <code>npm start</code>). This is best for apps and websites you want to run or change.</p>
      <h3 className="pt-2 text-xl font-semibold text-white">2. Install it as a package, skill, or MCP server</h3>
      <p>Many repos aren&apos;t meant to be opened at all. They&apos;re add-ons you plug into another tool. You install them with one command from the README, for example a package from npm, a <b>skill</b> for Claude, or an <b>MCP server</b> (a connector that gives an AI agent new abilities, like controlling a browser). You never touch the code; the tool handles it.</p>
      <h3 className="pt-2 text-xl font-semibold text-white">3. Hand it to an AI agent</h3>
      <p>The easiest way. Open an AI coding agent like <b>Claude Code</b> and paste the repo link with what you want:</p>
      <Code>{"Here's a repo: https://github.com/OWNER/REPO\nRead the README, set it up on my computer, and show me how to use it."}</Code>
      <p>The agent reads the instructions, runs the commands, and explains what it did. You still need to check the repo is trustworthy first (see below), because the agent will do whatever the repo&apos;s instructions say.</p>

      <H2>Walkthrough: install Anthropic&apos;s skills into Claude Code</H2>
      <p>Let&apos;s do a real one. <a className="underline" href="https://github.com/anthropics/skills">anthropics/skills</a> is #2 on our <Link className="underline" href="/top100">MCP &amp; Skills Top 100</Link>. It&apos;s Anthropic&apos;s official collection of <b>skills</b>: folders of instructions that teach Claude to do specific jobs, like working with PDFs, Word docs, and spreadsheets. These steps come straight from its README.</p>
      <ol className="list-decimal space-y-3 pl-6">
        <li><b>Open Claude Code</b> in your terminal.</li>
        <li><b>Add the repo as a plugin marketplace.</b> Type this inside Claude Code:<Code>{"/plugin marketplace add anthropics/skills"}</Code></li>
        <li><b>Pick what to install.</b> Choose <i>Browse and install plugins</i> → <i>anthropic-agent-skills</i> → <i>document-skills</i> or <i>example-skills</i> → <i>Install now</i>. Or skip the menus:<Code>{"/plugin install document-skills@anthropic-agent-skills\n/plugin install example-skills@anthropic-agent-skills"}</Code></li>
        <li><b>Use it.</b> Just mention the skill in plain English:<Code>{"Use the PDF skill to extract the form fields from path/to/some-file.pdf"}</Code></li>
      </ol>
      <p>That&apos;s it. No downloading, no code. If you use Claude.ai on a paid plan, the README says these example skills are already available there.</p>

      <H2>What to check before you trust a repo</H2>
      <p>Anyone can put anything on GitHub. Spend 60 seconds on these before installing or running something:</p>
      <ul className="list-disc space-y-2 pl-6">
        <li><b>Who made it?</b> The name before the slash is the owner. <code>anthropics/skills</code> is from Anthropic&apos;s official account. Watch for look-alike names.</li>
        <li><b>Stars ⭐</b> (top right) are bookmarks from other people. Lots of stars means lots of eyes on it. As of Oct 16, 2026, anthropics/skills has about 181,000. It&apos;s a popularity signal, not a safety guarantee; stars can be bought.</li>
        <li><b>Last commit</b>: the date at the top of the file list. Updated in the last few months = maintained. Untouched for years = may be broken.</li>
        <li><b>License</b> (the &quot;License&quot; link in the sidebar, or a LICENSE file) says what you&apos;re allowed to do with it. MIT and Apache 2.0 mean free to use. No license technically means no permission. Some repos mix licenses: anthropics/skills says many skills are Apache 2.0, but its document skills are &quot;source-available, not open source.&quot;</li>
        <li><b>Issues tab</b>: are people reporting problems, and does anyone answer?</li>
        <li><b>Read what it will run.</b> Be extra careful with anything that asks for passwords or API keys, or tells you to paste a long command starting with <code>curl ... | bash</code>.</li>
      </ul>

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>A repo is a project folder on GitHub. The README is the manual.</li><li>Use it by downloading/cloning, installing it as an add-on, or handing the link to an AI agent.</li><li>Check owner, stars, last commit, and license before you trust it.</li></ul>

      <GuideGate pdf="/guides/github-repo-guide.pdf" />
      <p className="text-sm text-gray-500">Looking for repos worth trying? See this week&apos;s <Link className="underline" href="/top100">MCP &amp; Skills Top 100</Link>.</p>
    </article>
  );
}
