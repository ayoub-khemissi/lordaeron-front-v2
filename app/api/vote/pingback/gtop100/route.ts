import { NextRequest, NextResponse } from "next/server";

import {
  getVoteSiteBySlug,
  getAccountByUsername,
  recordVote,
} from "@/lib/queries/votes";

interface GtopPingbackEntry {
  pb_id?: number;
  ip?: string;
  success?: number;
  reason?: string;
  pb_name?: string;
}

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      const raw: Record<string, unknown> = {};

      for (const [key, value] of formData.entries()) {
        raw[key] = value;
      }

      // Try to parse Common field if it's a JSON string
      if (typeof raw.Common === "string") {
        try {
          raw.Common = JSON.parse(raw.Common);
        } catch {
          // leave as-is
        }
      }

      body = raw;
    } else {
      body = await request.json();
    }

    const pingbackKey = body.pingbackkey as string | undefined;

    if (!pingbackKey) {
      return NextResponse.json({ status: "ok" });
    }

    // Validate key against stored site key
    const site = await getVoteSiteBySlug("gtop100");

    if (!site || site.pingback_key !== pingbackKey) {
      console.error("Gtop100 pingback: invalid key");

      return NextResponse.json({ status: "ok" });
    }

    // Parse the Common array — Gtop100 sends: [[{pb_id:1},{ip:"..."},{success:0},{reason:"..."},{pb_name:"..."}]]
    const commonRaw = body.Common;

    if (!Array.isArray(commonRaw)) {
      return NextResponse.json({ status: "ok" });
    }

    for (const entryArray of commonRaw) {
      if (!Array.isArray(entryArray)) continue;

      // Merge array of single-key objects into one object
      const entry: GtopPingbackEntry = {};

      for (const obj of entryArray) {
        if (typeof obj === "object" && obj !== null) {
          Object.assign(entry, obj);
        }
      }

      const username = entry.pb_name;
      const voteSuccess = entry.success === 0; // Gtop100: 0 = success
      const reason = entry.reason || null;
      const voterIp = entry.ip || null;

      if (!username) continue;

      const account = await getAccountByUsername(username);

      if (!account) {
        console.warn(
          `Gtop100 pingback: account not found for username "${username}"`,
        );

        continue;
      }

      await recordVote(account.id, site.id, voterIp, voteSuccess, reason);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Gtop100 pingback error:", error);

    // Always return 200 to avoid retries
    return NextResponse.json({ status: "ok" });
  }
}
