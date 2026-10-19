export type Comparison = {
  slug: string;
  title?: string; // defaults to "A vs B"
  description?: string; // defaults to a generated meta description
  toolA: string;
  toolB: string;
  summary: string;
  points?: { label: string; a: string; b: string }[]; // optional hand-written extra rows
  pickA: string;
  pickB: string;
  verdict?: string;
  beginner?: string; // answer to "which is better for beginners?"
  madness?: boolean; // a Round of 32 matchup in AI Madness
  updated: string; // ISO date this comparison was last reviewed
};

const U = "2026-10-19";

// Data-driven comparisons. The facts table (pricing, models, open source, surfaces...) is generated
// from data/toolFacts.ts; each entry adds the human analysis: summary, picks, verdict and beginner advice.
export const comparisons: Comparison[] = [
  {
    slug: "cursor-vs-claude-code",
    title: "Cursor vs Claude Code",
    description:
      "Side-by-side comparison of Cursor and Claude Code for vibe coders and builders: interface, workflow, pricing shape, and when to pick each.",
    toolA: "cursor",
    toolB: "claude-code",
    summary:
      "Both are top coding agents in 2026. Cursor is an AI-first IDE (VS Code fork) built for visual, multi-file editing with model choice. Claude Code is Anthropic's agentic coder that shines in the terminal and across large multi-file changes. Many builders use both.",
    points: [
      {
        label: "Shape",
        a: "Standalone AI-first code editor (VS Code fork) with agent features in the UI",
        b: "Agent-first workflow: terminal CLI plus IDE extensions, desktop, and web",
      },
      {
        label: "Best for",
        a: "Daily driver editing, rapid iteration, and reviewing visual diffs",
        b: "Large multi-file refactors and long autonomous sessions from the CLI",
      },
      {
        label: "Models",
        a: "Multiple labs selectable inside the editor",
        b: "Anthropic Claude models via your Claude plan or API",
      },
    ],
    pickA: "You want an IDE as your home base and prefer editing with agents in the UI.",
    pickB: "You live in the terminal, want deep autonomous runs, or already pay for Claude.",
    updated: "2026-10-19",
  },
  {
    slug: "opencode-vs-claude-code",
    title: "OpenCode vs Claude Code",
    description:
      "OpenCode vs Claude Code compared for vibe coders and builders: open source vs Anthropic's agent, model choice, interfaces, pricing shape, and when to pick each after OpenCode 2.0.",
    toolA: "opencode",
    toolB: "claude-code",
    summary:
      "Both are agentic coders you can drive from the terminal. OpenCode is an MIT-licensed open-source agent that works with 75+ model providers (including local models) and can sign in with an existing GitHub Copilot or ChatGPT Plus/Pro account; its 2.0 release in October 2026 put the terminal, desktop and web apps on one shared background service. Claude Code is Anthropic's own agent, tuned for Claude models and included with Claude paid plans or API usage.",
    points: [
      {
        label: "License",
        a: "Open source (MIT) on GitHub",
        b: "Proprietary product from Anthropic",
      },
      {
        label: "Models",
        a: "Any of 75+ providers via Models.dev, local models, plus free models included",
        b: "Anthropic Claude models via your Claude plan or API",
      },
      {
        label: "Interfaces",
        a: "Terminal UI, desktop app, web and IDE extension, all sharing one local service in 2.0",
        b: "Terminal CLI plus IDE extensions, desktop, and web",
      },
      {
        label: "Extending it",
        a: "MCP servers run in Code Mode by default, hot-reloadable plugins, and an embeddable @opencode/sdk",
        b: "MCP servers, hooks, subagents and Agent Skills",
      },
    ],
    pickA: "You want an open-source agent, freedom to switch models (or use a Copilot/ChatGPT plan you already pay for), or to embed the agent in your own tools.",
    pickB: "You mainly use Claude models, already pay for a Claude plan, and want Anthropic's first-party agent experience.",
    updated: "2026-10-19",
  },
  // ---- AI Madness Round of 32 matchups ----
  {
    slug: "cursor-vs-junie", toolA: "cursor", toolB: "junie", madness: true, updated: U,
    summary: "Cursor is the most popular AI-first editor, a VS Code fork with agents, cloud agents and code review. Junie is JetBrains' own coding agent, living inside IntelliJ, PyCharm, WebStorm and friends, with a standalone CLI that works with any model. The real question is which editor family you already use.",
    pickA: "You use (or are happy to switch to) a VS Code-style editor and want the most polished all-in-one AI editor.",
    pickB: "You already live in a JetBrains IDE and don't want to switch editors, or you want an agent that works with any model key you bring.",
    verdict: "For most new builders Cursor is the easier start. If you're a JetBrains user, Junie lets you keep your IDE and still get a real agent, and Junie Lite is free.",
    beginner: "Cursor. It installs like any app, imports your VS Code settings, and has a free plan. Junie makes most sense if you already know JetBrains IDEs.",
  },
  {
    slug: "goose-vs-factory-droid", toolA: "goose", toolB: "factory-droid", madness: true, updated: U,
    summary: "goose is a free, open-source, local-first agent (desktop app, CLI and API) now hosted by the Agentic AI Foundation, and it's extensible with MCP for work beyond code. Factory's Droid is a commercial software development agent that runs in your terminal, IDE, desktop and web, aimed at teams.",
    pickA: "You want a free, open agent you can extend with MCP tools and run with any model, including local ones.",
    pickB: "You're on a team that wants a supported, polished agent across terminal, IDE and CI and is fine paying from $20/mo.",
    verdict: "goose wins on price and openness; Droid wins on polish and team features.",
    beginner: "goose's desktop app is friendlier for a first try and costs nothing but your model usage. Droid has no published free plan.",
  },
  {
    slug: "gemini-cli-vs-emergent", toolA: "gemini-cli", toolB: "emergent", madness: true, updated: U,
    summary: "These two solve different problems. Gemini CLI is Google's open-source terminal agent for developers who want to work in a codebase. Emergent is a prompt-to-app builder where you describe an app and it builds and launches it for you in the browser.",
    pickA: "You're comfortable in a terminal and want an open-source Gemini agent you can script and customize.",
    pickB: "You don't code and want to describe an app and get something live you can share or sell.",
    verdict: "Developers should look at Gemini CLI (or Google's newer Antigravity CLI). Non-coders will get much further, faster, with Emergent.",
    beginner: "Emergent, by a mile. It runs in the browser and needs no setup. Gemini CLI assumes you know the command line.",
  },
  {
    slug: "zed-vs-base44", toolA: "zed", toolB: "base44", madness: true, updated: U,
    summary: "Zed is a very fast, open-source code editor where AI is optional and you can plug in agents like Claude Code or Codex. Base44 (owned by Wix) is a no-code AI app builder with a built-in database, auth and hosting. One is for people who write code, the other is for people who'd rather not.",
    pickA: "You write code and want the fastest editor around, with the freedom to bring your own model or agent.",
    pickB: "You want a working internal tool or simple SaaS without touching code.",
    verdict: "Zed for coders, Base44 for builders who want results without code. Both have free plans.",
    beginner: "Base44. Zed is an editor for people who already code.",
  },
  {
    slug: "replit-vs-kiro", toolA: "replit", toolB: "kiro", madness: true, updated: U,
    summary: "Replit is a cloud development environment where Replit Agent builds your app and hosts it, all in the browser. Kiro is AWS's agentic IDE that makes the AI write specs (requirements, design, tasks) before it writes code. Replit optimizes for speed to a live app; Kiro optimizes for structure.",
    pickA: "You want to go from idea to a hosted app with no setup, from any device.",
    pickB: "You want a desktop IDE that plans properly with specs, and you care about maintainable code on bigger projects.",
    verdict: "Replit is the faster path to something live. Kiro is the better habit-builder for real projects you'll keep growing.",
    beginner: "Replit. Everything runs in the browser and hosting is built in.",
  },
  {
    slug: "warp-vs-aider", toolA: "warp", toolB: "aider", madness: true, updated: U,
    summary: "Both are for terminal lovers. Warp is a full terminal app turned agentic development environment, with its own agent and Oz cloud agents. Aider is a lightweight, open-source CLI pair programmer that makes git-aware edits and commits them for you, with any model you bring.",
    pickA: "You want a modern terminal app with an agent built in, plus cloud agents, and a free plan to start.",
    pickB: "You want a small, scriptable, open-source tool that works inside your existing terminal and respects your git history.",
    verdict: "Warp is the more complete, actively developed product. Aider is still a classic minimalist choice, though its main repo hasn't seen a push since May 2026.",
    beginner: "Warp. It's a normal app you install with a friendly interface. Aider assumes comfort with git and API keys.",
  },
  {
    slug: "antigravity-vs-amp", toolA: "antigravity", toolB: "amp", madness: true, updated: U,
    summary: "Google Antigravity is an agent-first IDE plus CLI from Google DeepMind with a free Individual plan. Amp is a frontier coding agent spun out of Sourcegraph that runs in the terminal or on remote runners and lets you bring your own ChatGPT or Claude subscription.",
    pickA: "You want a free, full agent IDE with Google's newest Gemini models.",
    pickB: "You're a power user who already pays for ChatGPT or Claude and wants a sharp agent with no extra token fees.",
    verdict: "Antigravity is the easier, cheaper start. Amp appeals to experienced developers who want to tune their agent setup.",
    beginner: "Antigravity. It's a full IDE with a free plan. Amp is aimed at experienced developers.",
  },
  {
    slug: "bolt-vs-trae", toolA: "bolt", toolB: "trae", madness: true, updated: U,
    summary: "Bolt.new builds full-stack apps right in your browser from a prompt, with no install. TRAE is ByteDance's desktop AI IDE with an autonomous SOLO mode for people working on real codebases.",
    pickA: "You want to prototype in the browser and deploy without setting up a dev environment.",
    pickB: "You want a cheap desktop AI IDE (SOLO is included from $8/mo) for ongoing coding work.",
    verdict: "Bolt is better for quick demos and non-coders; TRAE is better value for people who code daily.",
    beginner: "Bolt.new. You can start in a browser tab with a free monthly token allowance.",
  },
  {
    slug: "opencode-vs-kimi-code", toolA: "opencode", toolB: "kimi-code", madness: true, updated: U,
    summary: "Both are open-source terminal coding agents. OpenCode works with 75+ model providers (including Kimi models and local ones) and can reuse a Copilot or ChatGPT subscription. Kimi Code is Moonshot AI's own agent, built for Kimi models and included with a Kimi membership.",
    pickA: "You want one agent that can switch between any model, including free and local ones.",
    pickB: "You're all-in on Kimi models and want Moonshot's first-party agent with a membership that covers usage.",
    verdict: "OpenCode is the more flexible pick for most people. Kimi Code is great if Kimi is already your favorite model.",
    beginner: "OpenCode, because it's free to start and has a desktop app as well as the terminal UI.",
  },
  {
    slug: "openhands-vs-rork", toolA: "openhands", toolB: "rork", madness: true, updated: U,
    summary: "OpenHands is an open-source AI software engineer for developers, which you can self-host or use in OpenHands Cloud. Rork is a prompt-to-mobile-app builder that gets iPhone and Android apps toward the App Store without code.",
    pickA: "You're a developer who wants an autonomous agent you can inspect, self-host and point at your repos.",
    pickB: "You want to build a mobile app without writing code.",
    verdict: "Different audiences: OpenHands for developers who want an open agent, Rork for non-coders who want a mobile app.",
    beginner: "Rork. It's built for people with no coding background.",
  },
  {
    slug: "devin-vs-crush", toolA: "devin", toolB: "crush", madness: true, updated: U,
    summary: "Devin is Cognition's family of agents: Devin Desktop (the IDE formerly called Windsurf), Devin Cloud, a CLI and code review. Crush is Charm's beautiful, source-available terminal agent that works with almost any model provider, including local models through Ollama or LM Studio.",
    pickA: "You want a polished commercial IDE plus cloud agents you can hand whole tickets to.",
    pickB: "You live in the terminal and want a fast, good-looking agent with total model freedom and no subscription.",
    verdict: "Devin is the more complete product (with a free plan). Crush is the pick for terminal fans who want to bring their own model.",
    beginner: "Devin Desktop. It's a full IDE with a free plan, while Crush needs a terminal and an API key or local model.",
  },
  {
    slug: "lovable-vs-grok-build", toolA: "lovable", toolB: "grok-build", madness: true, updated: U,
    summary: "Lovable turns a prompt into a polished full-stack web app in your browser, with hosting and a backend included. Grok Build is xAI's coding agent, mainly a terminal CLI (with web and mobile access), that works inside a code repository.",
    pickA: "You don't code and want a good-looking web app live today.",
    pickB: "You're working in a codebase and want a frontier agent that's included with a cheap X Subscription.",
    verdict: "Lovable for non-coders shipping MVPs, Grok Build for developers who want an inexpensive agent.",
    beginner: "Lovable. Grok Build expects you to work with a code repository.",
  },
  {
    slug: "claude-code-vs-mistral-vibe", toolA: "claude-code", toolB: "mistral-vibe", madness: true, updated: U,
    summary: "Claude Code is Anthropic's agentic coder, included with paid Claude plans and loved for long, multi-file runs. Mistral Vibe is Mistral AI's coding agent built on its open-weight Devstral models, with an open-source CLI, a free plan and a $14.99/mo Pro tier.",
    pickA: "You want one of the strongest agents for large changes and already pay for (or will pay for) Claude.",
    pickB: "You want a lower-cost option with a free plan, open-weight models, or a European provider.",
    verdict: "Claude Code is the more capable default for serious work; Mistral Vibe is the budget-friendly and open-weight alternative.",
    beginner: "Mistral Vibe is cheaper to try because it has a free plan. Claude Code needs at least Claude Pro ($20/mo).",
  },
  {
    slug: "v0-vs-kilo-code", toolA: "v0", toolB: "kilo-code", madness: true, updated: U,
    summary: "v0 is Vercel's generative UI and app builder for React, Next.js and shadcn/ui, all in the browser. Kilo Code is an open-source coding agent for VS Code, JetBrains and the CLI with access to 500+ models, now part of Anaconda.",
    pickA: "You want great-looking React/Next.js interfaces from prompts and one-click deploys to Vercel.",
    pickB: "You code in an editor and want an open-source agent with maximum model choice.",
    verdict: "v0 for UI-first building in the browser, Kilo Code for day-to-day coding in your editor.",
    beginner: "v0. You type what you want and see it rendered, no install needed.",
  },
  {
    slug: "codex-vs-qwen-code", toolA: "openai-codex", toolB: "qwen-code", madness: true, updated: U,
    summary: "OpenAI Codex is OpenAI's coding agent across CLI, IDE, desktop and cloud, included with ChatGPT plans (with limited use even on Free). Qwen Code is Alibaba's open-source terminal agent tuned for Qwen's open-weight coding models; its free Qwen OAuth tier ended in April 2026, so you now connect a provider.",
    pickA: "You already use ChatGPT, want parallel cloud tasks, or want OpenAI's own models tuned for coding.",
    pickB: "You want an open-source CLI and like running open-weight Qwen models through Alibaba Cloud, OpenRouter or another provider.",
    verdict: "Codex is the stronger all-round agent and easier to start. Qwen Code is for open-weight model fans who don't mind setup.",
    beginner: "Codex. You can sign in with a ChatGPT account and use the desktop app or IDE extension instead of the terminal.",
  },
  {
    slug: "cline-vs-github-copilot", toolA: "cline", toolB: "github-copilot", madness: true, updated: U,
    summary: "Cline is a free, open-source autonomous agent for VS Code and JetBrains (plus a CLI) where you bring your own model key and approve each step. GitHub Copilot is the built-in assistant across GitHub and popular IDEs with a free tier and paid plans from $10/mo.",
    pickA: "You want transparency, approve-every-step control and any model, paying only for what you use.",
    pickB: "You want something that just works in your editor and on github.com, with predictable pricing and team features.",
    verdict: "Copilot is the simplest choice for most teams. Cline is the favorite for people who want control and model freedom.",
    beginner: "GitHub Copilot. Sign in with GitHub and the free tier works right away; Cline needs an API key setup.",
  },
  // ---- High-search-intent comparisons ----
  {
    slug: "claude-code-vs-codex", toolA: "claude-code", toolB: "openai-codex", updated: U,
    summary: "The two big lab-made coding agents. Claude Code comes from Anthropic and is included with paid Claude plans. OpenAI Codex comes with ChatGPT plans (even Free, with limits) and has an open-source CLI. Both work in the terminal, IDEs, a desktop app and the web.",
    pickA: "You prefer Claude models, do big multi-file refactors, or already pay for Claude Pro or Max.",
    pickB: "You already pay for ChatGPT, want parallel cloud tasks, or want to start free.",
    verdict: "Both are excellent. Pick the one that matches the AI subscription you already have; many builders use both.",
    beginner: "Codex is easier to try for free with a ChatGPT account. Claude Code starts at Claude Pro ($20/mo).",
  },
  {
    slug: "cursor-vs-github-copilot", toolA: "cursor", toolB: "github-copilot", updated: U,
    summary: "Cursor is a standalone AI-first editor; GitHub Copilot is an assistant that plugs into the editor you already use plus github.com. Cursor goes deeper on agents inside one editor; Copilot goes wider across IDEs and GitHub.",
    pickA: "You're happy to switch editors for the most integrated AI experience.",
    pickB: "You want to keep your current editor (VS Code, JetBrains, Visual Studio) and your team lives on GitHub.",
    verdict: "Cursor for an AI-first editor, Copilot for the lowest-friction add-on. Copilot Pro ($10/mo) is the cheaper paid entry for third-party models.",
    beginner: "Both have free plans. Copilot is easier if you already use VS Code; Cursor is easier if you're starting fresh.",
  },
  {
    slug: "cursor-vs-windsurf", toolA: "cursor", toolB: "windsurf", updated: U,
    summary: "Windsurf no longer exists under that name: on June 2, 2026 Cognition renamed it Devin Desktop. It's the same IDE, plans and extensions, now centered on an Agent Command Center that manages local and cloud Devin agents. So 'Cursor vs Windsurf' today really means Cursor vs Devin Desktop.",
    pickA: "You want the most popular AI editor with model choice and Cursor's cloud agents.",
    pickB: "You liked Windsurf's flow and want local plus cloud Devin agents managed from one Kanban-style view.",
    verdict: "Both are mature agent IDEs with free plans. Cursor has the bigger community; Devin Desktop has the stronger cloud-agent story.",
    beginner: "Either works. Both have free plans and import VS Code settings.",
  },
  {
    slug: "lovable-vs-bolt", toolA: "lovable", toolB: "bolt", updated: U,
    summary: "The two best-known prompt-to-app builders. Lovable leans into polished design and a built-in backend; Bolt.new (from StackBlitz) runs a full dev environment in your browser so you can see and edit the code. Both start free and paid plans begin at $25/mo.",
    pickA: "You want the nicest-looking MVP with the least effort and don't plan to touch code.",
    pickB: "You want to see and tweak the code as it's built, and like a generous free token allowance.",
    verdict: "Lovable for non-coders who care about looks; Bolt for tinkerers who want more control.",
    beginner: "Lovable is slightly friendlier for total beginners; Bolt gives more free usage per month.",
  },
  {
    slug: "lovable-vs-v0", toolA: "lovable", toolB: "v0", updated: U,
    summary: "Lovable builds complete full-stack apps from a prompt. v0 from Vercel is strongest at React/Next.js interfaces with shadcn/ui and deploys straight to Vercel. Lovable is more 'whole app', v0 is more 'beautiful front end you can grow'.",
    pickA: "You want a full app with a backend and hosting handled for you.",
    pickB: "You want production-quality React/Next.js UI and plan to deploy on Vercel.",
    verdict: "Lovable for MVPs, v0 for UI-heavy projects and Next.js developers.",
    beginner: "Lovable. v0 rewards some React and Next.js knowledge.",
  },
  {
    slug: "cursor-vs-antigravity", toolA: "cursor", toolB: "antigravity", updated: U,
    summary: "Cursor is the incumbent AI editor; Google Antigravity is DeepMind's agent-first IDE where an agent manager sits next to the editor. Antigravity's free Individual plan is unusually generous, and it gets Google's newest Gemini models first.",
    pickA: "You want the most widely used AI editor and access to many model labs.",
    pickB: "You want a free agent IDE and the newest Gemini models.",
    verdict: "Cursor is the safer, more mature daily driver; Antigravity is the best free alternative to try.",
    beginner: "Antigravity's free plan makes it a low-risk first try; Cursor's free plan is more limited.",
  },
  {
    slug: "gemini-cli-vs-claude-code", toolA: "gemini-cli", toolB: "claude-code", updated: U,
    summary: "Gemini CLI is Google's open-source (Apache-2.0) terminal agent; Claude Code is Anthropic's proprietary agentic coder. In June 2026 Google moved free Google-login users from Gemini CLI to Antigravity CLI, so Gemini CLI now makes most sense with an API key or a paid Google plan.",
    pickA: "You want open source you can fork, or you use Gemini through an API key or Google AI plan.",
    pickB: "You want one of the strongest agents for large codebases and are fine paying for Claude.",
    verdict: "Claude Code is the stronger default; Gemini CLI is for open-source fans and Gemini API users (Google itself now points new free users to Antigravity CLI).",
    beginner: "Neither is beginner-first, as both live in the terminal. Claude Code also has a desktop app and IDE extensions.",
  },
  {
    slug: "replit-vs-lovable", toolA: "replit", toolB: "lovable", updated: U,
    summary: "Both turn prompts into hosted apps. Replit is a full cloud development environment where Replit Agent builds and you can open the code, database and deployments. Lovable focuses on getting a polished app out with as little friction as possible.",
    pickA: "You want an all-in-one build-and-host workspace you can grow into, including a real editor.",
    pickB: "You want the quickest path to a good-looking MVP.",
    verdict: "Replit for growing a project over time, Lovable for speed and polish.",
    beginner: "Both are beginner friendly; Lovable is a little simpler, Replit teaches you more.",
  },
  {
    slug: "cursor-vs-kiro", toolA: "cursor", toolB: "kiro", updated: U,
    summary: "Cursor is a fast-moving AI editor built for flow. Kiro, from AWS, asks the agent to write specs (requirements, design and a task list) before coding, which keeps bigger projects on track.",
    pickA: "You like fast iteration and want the biggest ecosystem.",
    pickB: "You want structure, documentation and planning baked into how the agent works.",
    verdict: "Cursor for speed, Kiro for discipline. Both have free plans.",
    beginner: "Kiro's spec-first flow can actually help beginners understand what's being built.",
  },
  {
    slug: "codex-vs-github-copilot", toolA: "openai-codex", toolB: "github-copilot", updated: U,
    summary: "Codex is OpenAI's own agent, included with ChatGPT plans, that can run many tasks in parallel in the cloud. GitHub Copilot is an assistant across IDEs and github.com with a free tier and plans from $10/mo, and it lets you pick models from several labs.",
    pickA: "You already pay for ChatGPT and want to delegate whole tasks.",
    pickB: "You want help inside your current editor and on GitHub pull requests, with several model choices.",
    verdict: "Codex for delegation, Copilot for in-editor help and GitHub workflows.",
    beginner: "Both start free. Copilot is the gentler start inside VS Code.",
  },
];

export const comparisonTitle = (c: Comparison, aName: string, bName: string) => c.title ?? `${aName} vs ${bName}`;
export const getComparison = (slug: string) => comparisons.find((c) => c.slug === slug);
export const comparisonsForTool = (toolSlug: string) =>
  comparisons.filter((c) => c.toolA === toolSlug || c.toolB === toolSlug);
export const comparisonForPair = (x: string, y: string) =>
  comparisons.find((c) => (c.toolA === x && c.toolB === y) || (c.toolA === y && c.toolB === x));
