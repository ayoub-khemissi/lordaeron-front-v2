import { NextResponse } from "next/server";

import {
  getOnlineCount,
  getFactionBalance,
  getTotalAccounts,
} from "@/lib/queries/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [onlineCount, factionBalance, totalAccounts] = await Promise.all([
      getOnlineCount(),
      getFactionBalance(),
      getTotalAccounts(),
    ]);

    return NextResponse.json({
      onlineCount,
      totalAccounts,
      alliance: factionBalance.alliance,
      horde: factionBalance.horde,
    });
  } catch {
    return NextResponse.json(
      { onlineCount: 0, totalAccounts: 0, alliance: 0, horde: 0 },
      { status: 200 },
    );
  }
}
