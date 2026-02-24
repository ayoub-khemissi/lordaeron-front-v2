import { NextRequest, NextResponse } from "next/server";

import { verifySession } from "@/lib/auth";
import { getVoteSitesWithStatus, recordVote } from "@/lib/queries/votes";

export async function POST(request: NextRequest) {
  const session = await verifySession();

  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const { siteId } = await request.json();

    if (!siteId || typeof siteId !== "number") {
      return NextResponse.json({ error: "invalidSiteId" }, { status: 400 });
    }

    // Check cooldown
    const sites = await getVoteSitesWithStatus(session.id);
    const site = sites.find((s) => s.id === siteId);

    if (!site) {
      return NextResponse.json({ error: "siteNotFound" }, { status: 404 });
    }

    if (!site.canVote) {
      return NextResponse.json(
        { error: "cooldown", lastVotedAt: site.lastVotedAt },
        { status: 429 },
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;

    await recordVote(session.id, siteId, ip, true, null);

    return NextResponse.json({
      success: true,
      rewardShards: site.rewardShards,
      lastVotedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to claim vote reward:", error);

    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
