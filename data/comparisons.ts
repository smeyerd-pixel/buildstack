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
  },
];

export const getComparison = (slug: string) => comparisons.find((c) => c.slug === slug);
export const comparisonsForTool = (toolSlug: string) =>
  comparisons.filter((c) => c.toolA === toolSlug || c.toolB === toolSlug);
