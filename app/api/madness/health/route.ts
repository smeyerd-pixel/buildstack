import { NextResponse } from "next/server";
import { HEALTHCHECK_ID } from "@/lib/madness";
import { configuredBackend, getCounts } from "@/lib/voteStore";

export const dynamic = "force-dynamic";
export async function GET() {
  const { counts, backend, degraded } = await getCounts([HEALTHCHECK_ID]);
  return NextResponse.json({ configured: configuredBackend(), backend, degraded, healthcheck: counts[HEALTHCHECK_ID] });
}
