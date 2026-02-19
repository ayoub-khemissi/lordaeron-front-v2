import { NextResponse } from "next/server";

import { getRealmStatus } from "@/lib/queries/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const status = await getRealmStatus();

    return NextResponse.json(status);
  } catch {
    return NextResponse.json(
      { online: false, name: "Lordaeron" },
      { status: 200 },
    );
  }
}
