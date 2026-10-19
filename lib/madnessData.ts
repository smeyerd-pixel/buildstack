import { buildBracket, nowMs, startedIds } from "@/lib/madness";
import { getCounts } from "@/lib/voteStore";

/**
 * strict: throw if the vote store couldn't be read, so ISR keeps serving the last good page
 * instead of caching a bracket computed from zeros (which could crown the wrong winner).
 */
export async function loadBracket(now = nowMs(), strict = false) {
  const { counts, backend, degraded } = await getCounts(startedIds(now), now);
  if (strict && degraded) throw new Error("vote store unavailable");
  return { bracket: buildBracket(counts, now), backend, degraded, now };
}
