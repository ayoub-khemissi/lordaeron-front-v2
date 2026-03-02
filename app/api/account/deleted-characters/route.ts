import { NextResponse } from "next/server";

import { verifySession } from "@/lib/auth";
import { getDeletedCharactersByAccount } from "@/lib/queries/characters";
import { RESTORE_CHARACTER_COST } from "@/lib/shop-utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const deletedCharacters = await getDeletedCharactersByAccount(session.id);

    return NextResponse.json({
      deletedCharacters,
      restoreCost: RESTORE_CHARACTER_COST,
    });
  } catch (error) {
    console.error("Deleted characters fetch error:", error);

    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
