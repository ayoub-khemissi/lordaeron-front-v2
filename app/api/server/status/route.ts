import { NextResponse } from "next/server";

import { getRealmStatus, getRealmUptime } from "@/lib/queries/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [status, starttime] = await Promise.all([
      getRealmStatus(),
      getRealmUptime(),
    ]);

    return NextResponse.json({ ...status, starttime });
  } catch {
    return NextResponse.json(
      { online: false, name: "Lordaeron", starttime: null },
      { status: 200 },
    );
  }
}
