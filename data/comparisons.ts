export type Comparison = {
  slug: string;
  title: string;
  description: string;
  toolA: string;
  toolB: string;
  summary: string;
  points: { label: string; a: string; b: string }[];
  pickA: string;
  pickB: string;
  updated: string; // ISO date this comparison was last reviewed
};

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
        label: "Pricing shape",
        a: "Free tier; paid Pro plans",
        b: "Included with Claude paid plans or API usage",
      },
      {
        label: "Models",
        a: "Multiple labs selectable inside the editor",
        b: "Anthropic Claude models via your Claude plan or API",
      },
    ],
    pickA: "You want an IDE as your home base and prefer editing with agents in the UI.",
    pickB: "You live in the terminal, want deep autonomous runs, or already pay for Claude.",
    updated: "2026-10-16",
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
        label: "Pricing shape",
        a: "Free to use; pay only for the model provider or subscription you connect",
        b: "Included with Claude paid plans or API usage",
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
];

export const getComparison = (slug: string) => comparisons.find((c) => c.slug === slug);
export const comparisonsForTool = (toolSlug: string) =>
  comparisons.filter((c) => c.toolA === toolSlug || c.toolB === toolSlug);
