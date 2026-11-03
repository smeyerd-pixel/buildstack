import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { getGuide } from "@/lib/guides";
import ToolCard from "@/components/ToolCard";
import { getTool } from "@/lib/data";
const g = getGuide("make-a-launch-video-with-your-ai-coding-agent")!;
const url = `${SITE.url}/guides/${g.slug}`;
export const metadata: Metadata = { title: g.title, description: g.description, alternates: { canonical: url }, openGraph: { title: g.title, description: g.description, url, type: "article" } };
const steps = [
  { name: "Write a 3-beat script before you touch any tool", text: "Pick one person, one problem and one moment where your app solves it. Write three beats: the problem (one line), the app doing the thing (two or three real clicks), and the call to action (your URL). Aim for 20 to 45 seconds. A short video people finish beats a long one they skip, and a clear plan is what makes the agent's output good." },
  { name: "Have your agent record the real app", text: "Instead of screen-recording yourself fumbling, let the agent drive the browser. The free Video Studio Skill for Claude Code turns your beats into a brief, records real clicks in your app with Playwright, and wraps them in a branded browser frame with title cards and a call to action. Ask it to show you the plan first, and start with a silent cut." },
  { name: "Add motion for the logo and the big moment", text: "A logo sting at the start and one animated feature shot make a demo feel launched, not recorded. With Clayzo, you describe the animation in a sentence and your agent (Claude Code, Codex or Cursor) writes it as code, renders frames to check its own work, and exports MP4 or GIF. Because it's a text file, a new color or headline is one more prompt." },
  { name: "Cut it like a document", text: "Put the pieces together in an editor you control. Arsaze lets you cut by editing the transcript and connect your agent over MCP to make edits you can undo; Descript also edits video by editing text. Remove every pause, keep each beat under 15 seconds and add captions, because most people watch launch videos muted." },
  { name: "Export once per place you'll post it", text: "Export a 16:9 version for your site and YouTube, and a square or 4:5 version for X and LinkedIn feeds. Add a voiceover only if it helps (ElevenLabs is the usual choice for AI voice); captions matter more. Put the live Clayzo animation on your landing page if you want it sharp and small instead of a heavy video file." },
];
const faq = [
  { q: "Do I need to know video editing?", a: "No. The point of this routine is that your coding agent does the fiddly parts (recording clicks, timing, animating, exporting) from plain-English instructions. You decide the story and say yes or no to each cut." },
  { q: "Is this free?", a: "The main tools have free options. The Video Studio Skill is open source (MIT) and runs on your computer; it needs Node.js 22+, FFmpeg, Chromium and Python, and was built on Linux. Clayzo is free for animations on your own sites and apps, with a free sign-in for preview and export. Arsaze has a free plan with watermark-free desktop exports. You still pay for your coding agent's normal usage." },
  { q: "What is Clayzo?", a: "Clayzo is an animation engine built for coding agents that launched on Product Hunt on November 2, 2026. You run npx clayzo@latest init in a project, ask your agent for an animation, and it writes, checks and exports it. It plays live on the web (HTML, React, Next.js) or natively in Swift on iOS and macOS, and exports MP4, MOV, WebM, GIF or PNG frames." },
  { q: "Can't I just ask an AI video generator for a demo?", a: "Text-to-video models are great for mood shots, but they invent screens. A launch video should show your real app working, which is why step 2 records the actual product. Use generated clips, if at all, for backgrounds and transitions." },
  { q: "How long should a launch video be?", a: "For X, LinkedIn and Product Hunt, 20 to 45 seconds is a good target: the problem, the moment it works and where to try it. Make a longer walkthrough separately for your docs or YouTube if people ask for it." },
];
const Code = ({ children }: { children: string }) => <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-200"><code>{children}</code></pre>;
const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} className="pt-4 text-2xl font-bold text-white">{children}</h2>;
const T = ({ s, children }: { s: string; children: React.ReactNode }) => <Link className="underline" href={`/tools/${s}`}>{children}</Link>;
export default function Guide() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "HowTo", name: "How to make a launch video for your app with your AI coding agent", description: g.description, totalTime: "PT1H",
      tool: ["Your coding agent (Claude Code, Codex or Cursor)", "Video Studio Skill", "Clayzo", "A video editor (Arsaze or Descript)"].map((name) => ({ "@type": "HowToTool", name })), step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const featured = ["clayzo", "video-studio-skill", "arsaze", "descript", "elevenlabs"].map(getTool).filter((t) => t !== undefined);
  return (
    <article className="mx-auto max-w-3xl space-y-4 pt-6 leading-relaxed text-gray-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/guides" className="text-sm text-gray-500">← Guides</Link>
      <h1 className="text-4xl font-bold text-white">How to make a launch video for your app with your AI coding agent (free tools, no video editor)</h1>
      <p className="text-lg text-gray-400">A plain-English routine for vibe coders. About a 5-minute read. Updated November 3, 2026.</p>
      <p>You built the app. Now you need people to see it, and on X, LinkedIn and Product Hunt a short video does that better than any paragraph. The good news: the same coding agent that built your app, like <T s="claude-code">Claude Code</T>, <T s="openai-codex">Codex</T> or <T s="cursor">Cursor</T>, can now record it, animate it and help edit it. You don&apos;t need After Effects or a screen-recording rehearsal. You need a short script and the five steps below.</p>

      <H2>The 5-step routine</H2>
      <ol className="list-decimal space-y-3 pl-6">{steps.map((s) => <li key={s.name}><b>{s.name}.</b> {s.text}</li>)}</ol>

      <H2 id="script">A copy-paste script template</H2>
      <p>Fill this in and paste it into your agent. It works for every tool in this guide:</p>
      <Code>{"Make a 30-second silent launch video for my app.\nAudience: <who it is for>\nBeat 1 (5s): title card - \"<the problem in one line>\"\nBeat 2 (20s): in the real app at http://localhost:3000, <click 1>, <click 2>, <the result>\nBeat 3 (5s): call to action - \"Try it at <your URL>\"\nUse my logo and brand colors from <folder>. Show me the plan before recording or rendering."}</Code>
      <p>That last line matters. Seeing the plan first costs you ten seconds and saves a render you&apos;d throw away.</p>

      <H2 id="record">Recording your real app with the Video Studio Skill</H2>
      <p>The <T s="video-studio-skill">Video Studio Skill</T> is a free, open-source Claude Code skill (shown on Hacker News on November 2, 2026). The repo is the whole workspace, so you clone it and open Claude Code inside it:</p>
      <Code>{"git clone https://github.com/aaitor/skill-video-studio.git\ncd skill-video-studio\nclaude\n\n# then, inside Claude Code:\n/devrel-video Prepare a 30-second silent walkthrough brief for my app at <URL>.\nShow the plan before capture or rendering."}</Code>
      <p>Planning works right away. For the full video (capture, composition, mastering and thumbnail) you need Node.js 22+, FFmpeg, Chromium and Python installed; the project was developed on Linux, so check its installation guide for your machine. New to cloning repos? Read <Link className="underline" href="/guides/use-a-github-repo">how to use someone else&apos;s GitHub repo</Link> first.</p>

      <H2 id="animate">Animating your logo and features with Clayzo</H2>
      <p><T s="clayzo">Clayzo</T> (launched on Product Hunt on November 2, 2026) is an animation engine designed for agents to write. In your project folder, run:</p>
      <Code>{"npx clayzo@latest init\n\n# then ask your agent, for example:\n# \"A 4-second logo sting: our icon draws itself, the name rises under it, then it all clears.\""}</Code>
      <p>The agent writes the animation as a TypeScript file, renders frames and contact sheets to check its own work, and can export MP4, MOV, WebM or GIF for your video, or a small, sharp live player for your landing page. It&apos;s free for animations on your own sites and apps; preview and export need a free sign-in.</p>

      <H2 id="edit">Editing the cut</H2>
      <p><T s="arsaze">Arsaze</T> is a multi-track editor where you can cut by editing the transcript and let an AI (Claude, ChatGPT, Codex, Cursor and others over MCP) make versioned, undoable edits on the same timeline. <T s="descript">Descript</T> is the older, popular text-based editor. Either way: trim every pause, add captions and keep it short. For a voiceover, <T s="elevenlabs">ElevenLabs</T> is the usual AI voice choice, but a silent video with good captions is often enough.</p>

      {featured.length > 0 && <><H2>Tools in this guide</H2><div className="grid gap-4 sm:grid-cols-2">{featured.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></>}

      <H2>FAQ</H2>
      {faq.map((f) => <div key={f.q}><h3 className="pt-2 text-lg font-semibold text-white">{f.q}</h3><p>{f.a}</p></div>)}

      <H2>Quick recap</H2>
      <ul className="list-disc space-y-1 pl-6"><li>Script three beats first: problem, the moment it works, where to try it.</li><li>Let the agent record the real app and animate the logo; ask for the plan before it renders.</li><li>Cut every pause, add captions, export one version per place you&apos;ll post.</li></ul>
      <p className="text-sm text-gray-500">Before you launch: <Link className="underline" href="/guides/check-ai-code-before-you-ship">check AI-written code before you ship</Link>. More tools: <Link className="underline" href="/use-case/video">the best AI video tools</Link> and <Link className="underline" href="/new">the newest AI tools</Link>.</p>
    </article>
  );
}
