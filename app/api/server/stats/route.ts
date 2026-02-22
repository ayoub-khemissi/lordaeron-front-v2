import { NextResponse } from "next/server";

import {
  getOnlineCount,
  getFactionBalance,
  getTotalFactionBalance,
  getTotalAccounts,
} from "@/lib/queries/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [onlineCount, factionBalance, totalFactionBalance, totalAccounts] =
      await Promise.all([
        getOnlineCount(),
        getFactionBalance(),
        getTotalFactionBalance(),
        getTotalAccounts(),
      ]);

    return NextResponse.json({
      onlineCount,
      totalAccounts,
      alliance: factionBalance.alliance,
      horde: factionBalance.horde,
      totalAlliance: totalFactionBalance.alliance,
      totalHorde: totalFactionBalance.horde,
    });
  } catch {
    return NextResponse.json(
      {
        onlineCount: 0,
        totalAccounts: 0,
        alliance: 0,
        horde: 0,
        totalAlliance: 0,
        totalHorde: 0,
      },
      { status: 200 },
    );
  }
}
