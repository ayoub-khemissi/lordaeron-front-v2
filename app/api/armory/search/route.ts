import { NextRequest, NextResponse } from "next/server";

import { searchArmoryCharacters } from "@/lib/queries/armory";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";

    if (q.length < 2 || q.length > 12) {
      return NextResponse.json({ characters: [] });
    }

    const characters = await searchArmoryCharacters(q);

    return NextResponse.json({ characters });
  } catch (error) {
    console.error("Armory search error:", error);

    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
