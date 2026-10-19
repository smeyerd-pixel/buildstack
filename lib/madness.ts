import { entrants, entrantBySeed, type SeededEntrant } from "@/data/madness";

// All times are fixed instants. 15:00 UTC = 9:00 AM Costa Rica time (UTC-6).
export const ROUNDS = [
  { key: "r1", name: "Round of 32", start: "2026-10-26T15:00:00Z", end: "2026-10-29T15:00:00Z" },
  { key: "r2", name: "Sweet 16", start: "2026-10-29T15:00:00Z", end: "2026-11-01T15:00:00Z" },
  { key: "r3", name: "Elite 8", start: "2026-11-01T15:00:00Z", end: "2026-11-04T15:00:00Z" },
  { key: "r4", name: "Final Four", start: "2026-11-04T15:00:00Z", end: "2026-11-07T15:00:00Z" },
  { key: "r5", name: "Championship", start: "2026-11-07T15:00:00Z", end: "2026-11-10T15:00:00Z" },
] as const;

export const HEALTHCHECK_ID = "healthcheck";
export const TZ_LABEL = "Costa Rica time";

export type Counts = Record<string, { a: number; b: number }>;
export type MatchStatus = "upcoming" | "live" | "final";
export type Matchup = {
  id: string;
  round: number; // 0..4
  index: number;
  a?: SeededEntrant;
  b?: SeededEntrant;
  votesA: number;
  votesB: number;
  status: MatchStatus;
  winner?: SeededEntrant;
  slug?: string;
};

// Standard tournament order: 1v32, 16v17, 8v25, 9v24, 4v29 ...
export function bracketOrder(size: number): number[] {
  let order = [1, 2];
  while (order.length < size) {
    const n = order.length * 2;
    order = order.flatMap((s) => [s, n + 1 - s]);
  }
  return order;
}

export const matchupId = (round: number, index: number) => `${ROUNDS[round].key}-${String(index + 1).padStart(2, "0")}`;
export const matchupSlug = (a: SeededEntrant, b: SeededEntrant) => `${a.slug}-vs-${b.slug}`;

/** Every matchup id whose round has started by `now` (these are the only ones with votes). */
export function startedIds(now: number): string[] {
  const ids: string[] = [];
  ROUNDS.forEach((r, ri) => {
    if (now >= Date.parse(r.start)) for (let i = 0; i < 16 >> ri; i++) ids.push(matchupId(ri, i));
  });
  return ids;
}
export const finalIds = (now: number) =>
  new Set(startedIds(now).filter((id) => now >= Date.parse(ROUNDS[ROUNDS.findIndex((r) => id.startsWith(r.key + "-"))].end)));

export function buildBracket(counts: Counts, now: number) {
  const order = bracketOrder(32);
  const rounds: Matchup[][] = [];
  ROUNDS.forEach((r, ri) => {
    const n = 16 >> ri;
    const list: Matchup[] = [];
    for (let i = 0; i < n; i++) {
      let a: SeededEntrant | undefined;
      let b: SeededEntrant | undefined;
      if (ri === 0) {
        a = entrantBySeed(order[2 * i]);
        b = entrantBySeed(order[2 * i + 1]);
      } else {
        a = rounds[ri - 1][2 * i].winner;
        b = rounds[ri - 1][2 * i + 1].winner;
      }
      const id = matchupId(ri, i);
      const c = counts[id] ?? { a: 0, b: 0 };
      const start = Date.parse(r.start);
      const end = Date.parse(r.end);
      const status: MatchStatus = now < start || !a || !b ? "upcoming" : now < end ? "live" : "final";
      let winner: SeededEntrant | undefined;
      if (status === "final" && a && b) {
        // Winner = higher vote share; a tie goes to the higher seed (lower seed number).
        winner = c.a > c.b ? a : c.b > c.a ? b : a.seed < b.seed ? a : b;
      }
      list.push({ id, round: ri, index: i, a, b, votesA: c.a, votesB: c.b, status, winner, slug: a && b ? matchupSlug(a, b) : undefined });
    }
    rounds.push(list);
  });
  const liveRound = ROUNDS.findIndex((r) => now >= Date.parse(r.start) && now < Date.parse(r.end));
  const phase: "pre" | "live" | "done" =
    now < Date.parse(ROUNDS[0].start) ? "pre" : liveRound >= 0 ? "live" : "done";
  const champion = rounds[4][0].winner;
  return { rounds, liveRound, phase, champion };
}

export type Bracket = ReturnType<typeof buildBracket>;

export function findMatchupBySlug(bracket: Bracket, slug: string) {
  for (const r of bracket.rounds) for (const m of r) if (m.slug === slug) return m;
  return undefined;
}
export function findMatchupById(bracket: Bracket, id: string) {
  for (const r of bracket.rounds) for (const m of r) if (m.id === id) return m;
  return undefined;
}

/** Next moment something changes, for countdowns. */
export function nextEvent(now: number): { at: string; label: string } | null {
  for (const r of ROUNDS) {
    if (now < Date.parse(r.start)) return { at: r.start, label: `${r.name} voting opens` };
    if (now < Date.parse(r.end)) return { at: r.end, label: `${r.name} voting closes` };
  }
  return null;
}

export const pct = (x: number, y: number) => (x + y === 0 ? 50 : Math.round((100 * x) / (x + y)));

export function formatCR(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/Costa_Rica",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const allR32Slugs = () => buildBracket({}, 0).rounds[0].map((m) => m.slug!);
export { entrants };

/** Current time. MADNESS_FAKE_NOW lets local testing simulate a round; it is ignored on Vercel. */
export const nowMs = () => {
  const fake = !process.env.VERCEL ? process.env.MADNESS_FAKE_NOW : undefined;
  return fake ? Date.parse(fake) : Date.now();
};
