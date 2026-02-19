import { NextResponse } from "next/server";

import { verifySession } from "@/lib/auth";
import { findAccountById } from "@/lib/queries/account";
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

    const [account, characters, realm, soulShards] = await Promise.all([
      findAccountById(session.id),
      getCharactersByAccount(session.id),
      getRealmStatus(),
      getSoulShardBalance(session.id),
    ]);

    if (!account) {
      return NextResponse.json({ error: "accountNotFound" }, { status: 404 });
    }

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
    });
  } catch (error) {
    console.error("Account fetch error:", error);

    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
