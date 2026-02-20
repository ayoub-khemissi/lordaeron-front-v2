import { NextResponse } from "next/server";

import { verifySession } from "@/lib/auth";
import {
  findAccountById,
  getAccountBan,
  getIpBan,
} from "@/lib/queries/account";
import { getCharactersByAccount } from "@/lib/queries/characters";
import { getRealmStatus } from "@/lib/queries/server";
import { getSoulShardBalance } from "@/lib/queries/soul-shards";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const [account, characters, realm, soulShards, accountBan] =
      await Promise.all([
        findAccountById(session.id),
        getCharactersByAccount(session.id),
        getRealmStatus(),
        getSoulShardBalance(session.id),
        getAccountBan(session.id),
      ]);

    if (!account) {
      return NextResponse.json({ error: "accountNotFound" }, { status: 404 });
    }

    // Check IP ban using account's last_ip
    const ipBan = account.last_ip ? await getIpBan(account.last_ip) : null;

    return NextResponse.json({
      account: {
        id: account.id,
        username: account.username,
        email: account.email,
        joindate: account.joindate,
        last_ip: account.last_ip,
        expansion: account.expansion,
      },
      characters,
      realm,
      soulShards,
      accountBan: accountBan
        ? {
            bandate: accountBan.bandate,
            unbandate: accountBan.unbandate,
            bannedby: accountBan.bannedby,
            banreason: accountBan.banreason,
          }
        : null,
      ipBan: ipBan
        ? {
            bandate: ipBan.bandate,
            unbandate: ipBan.unbandate,
            bannedby: ipBan.bannedby,
            banreason: ipBan.banreason,
          }
        : null,
    });
  } catch (error) {
    console.error("Account fetch error:", error);

    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
