import { RowDataPacket } from "mysql2";

import { charactersDb } from "@/lib/db";
import type { Character } from "@/types";

export async function getCharactersByAccount(
  accountId: number,
): Promise<Character[]> {
  const [rows] = await charactersDb.execute<RowDataPacket[]>(
    "SELECT guid, name, race, class, level, gender, online, totaltime, zone FROM characters WHERE account = ? ORDER BY level DESC",
    [accountId],
  );

  return rows as Character[];
}
