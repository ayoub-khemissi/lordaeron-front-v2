import { NextResponse } from "next/server";

import { verifySession } from "@/lib/auth";
import { getVoteSitesWithStatus } from "@/lib/queries/votes";
import { findAccountById } from "@/lib/queries/account";

export async function GET() {
  const session = await verifySession();

  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const account = await findAccountById(session.id);

    if (!account) {
      return NextResponse.json({ error: "accountNotFound" }, { status: 404 });
    }

    const sites = await getVoteSitesWithStatus(session.id);

    // Append pingUsername to each vote URL
    const sitesWithUsername = sites.map((site) => ({
      ...site,
      voteUrl: `${site.voteUrl}${site.voteUrl.includes("?") ? "&" : "?"}pingUsername=${encodeURIComponent(account.username)}`,
    }));

    return NextResponse.json({ sites: sitesWithUsername });
  } catch (error) {
    console.error("Failed to fetch vote sites:", error);

    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
