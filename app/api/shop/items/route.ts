import { NextRequest, NextResponse } from "next/server";

import { verifySession } from "@/lib/auth";
import { getShopItems } from "@/lib/queries/shop-items";
import { localizeShopItem } from "@/lib/shop-utils";
import { ALLIANCE_RACES, HORDE_RACES } from "@/lib/shop-utils";
import type { ShopCategory } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as ShopCategory | null;
    const locale = searchParams.get("locale") || "en";
    const realmId = searchParams.get("realm_id") ? parseInt(searchParams.get("realm_id")!) : null;
    const raceId = searchParams.get("race_id") ? parseInt(searchParams.get("race_id")!) : null;
    const classId = searchParams.get("class_id") ? parseInt(searchParams.get("class_id")!) : null;
    const level = searchParams.get("level") ? parseInt(searchParams.get("level")!) : null;
    const highlightedOnly = searchParams.get("highlighted") === "true";
    const hasDiscount = searchParams.get("discount") === "true";

    const items = await getShopItems({
      category: category || undefined,
      activeOnly: true,
      highlightedOnly: highlightedOnly || undefined,
      hasDiscount: hasDiscount || undefined,
    });

    // Filter by realm/race/class/faction restrictions
    const filtered = items.filter((item) => {
      if (realmId && item.realm_ids && !item.realm_ids.includes(realmId)) return false;
      if (raceId && item.race_ids && !item.race_ids.includes(raceId)) return false;
      if (classId && item.class_ids && !item.class_ids.includes(classId)) return false;
      if (raceId && item.faction !== "both") {
        const isAlliance = ALLIANCE_RACES.includes(raceId);
        const isHorde = HORDE_RACES.includes(raceId);
        if (item.faction === "alliance" && !isAlliance) return false;
        if (item.faction === "horde" && !isHorde) return false;
      }
      if (level && item.min_level > 0 && level < item.min_level) return false;
      return true;
    });

    const localized = filtered.map((item) => localizeShopItem(item, locale));

    return NextResponse.json({ items: localized });
  } catch (error) {
    console.error("Shop items fetch error:", error);
    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
