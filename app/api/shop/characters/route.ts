import { NextResponse } from "next/server";

import { verifySession } from "@/lib/auth";
import { getCharactersByAccount } from "@/lib/queries/characters";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const characters = await getCharactersByAccount(session.id);

    return NextResponse.json({ characters });
  } catch (error) {
    console.error("Characters fetch error:", error);

    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
