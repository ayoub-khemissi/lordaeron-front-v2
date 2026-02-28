import { NextRequest, NextResponse } from "next/server";

import {
  getArmoryCharacter,
  getCharacterStats,
  getCharacterProfessions,
  getCharacterArenaTeams,
  getCharacterAchievementCount,
  getItemDisplayIds,
  parseEquipmentCache,
} from "@/lib/queries/armory";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const { name } = await params;

    const character = await getArmoryCharacter(name);

    if (!character) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const [stats, professions, arenaTeams, achievementCount] =
      await Promise.all([
        getCharacterStats(character.guid),
        getCharacterProfessions(character.guid),
        getCharacterArenaTeams(character.guid),
        getCharacterAchievementCount(character.guid),
      ]);

    const equipment = parseEquipmentCache(character.equipmentCache || "");

    // Fetch real displayIds from item_template (worldDb)
    const itemEntries = equipment.map((e) => e.itemEntry);
    const displayIdMap = await getItemDisplayIds(itemEntries);

    // Enrich equipment with real displayIds
    for (const item of equipment) {
      const realDisplayId = displayIdMap.get(item.itemEntry);

      if (realDisplayId) {
        item.displayId = realDisplayId;
      }
    }

    return NextResponse.json({
      character,
      stats,
      professions,
      arenaTeams,
      achievementCount,
      equipment,
    });
  } catch (error) {
    console.error("Armory character error:", error);

    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
