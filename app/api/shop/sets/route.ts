import { NextRequest, NextResponse } from "next/server";

import { verifySession } from "@/lib/auth";
import { getShopSets } from "@/lib/queries/shop-sets";
import { getShopSetItems } from "@/lib/queries/shop-sets";
import { localizeShopSet } from "@/lib/shop-utils";
import type { ShopSetWithItems } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";
    const classId = searchParams.get("class_id");
    const faction = searchParams.get("faction");
    const level = searchParams.get("level");

    const sets = await getShopSets({
      activeOnly: true,
      classId: classId ? parseInt(classId) : undefined,
      faction: faction || undefined,
      maxLevel: level ? parseInt(level) : undefined,
    });

    // Fetch items for each set
    const setsWithItems: ShopSetWithItems[] = await Promise.all(
      sets.map(async (set) => {
        const items = await getShopSetItems(set.id);
        return { ...set, items };
      }),
    );

    const localized = setsWithItems.map((s) => localizeShopSet(s, locale));

    return NextResponse.json({ sets: localized });
  } catch (error) {
    console.error("Shop sets fetch error:", error);
    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
