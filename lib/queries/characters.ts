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

export async function getCharacterByGuid(
  guid: number,
): Promise<Character | null> {
  const [rows] = await charactersDb.execute<RowDataPacket[]>(
    "SELECT guid, name, race, class, level, gender, online, totaltime, zone FROM characters WHERE guid = ?",
    [guid],
  );

  if (rows.length === 0) return null;
  return rows[0] as Character;
}

export async function getCharacterByExactName(
  name: string,
): Promise<Character | null> {
  const [rows] = await charactersDb.execute<RowDataPacket[]>(
    "SELECT guid, name, race, class, level, gender, online, totaltime, zone FROM characters WHERE name = ?",
    [name],
  );

  if (rows.length === 0) return null;
  return rows[0] as Character;
}

export async function searchCharactersByName(
  name: string,
  excludeAccountId?: number,
  limit: number = 5,
): Promise<Character[]> {
  const safeLimit = Math.max(1, Math.min(Math.floor(limit), 20));

  const query = excludeAccountId
    ? `SELECT guid, name, race, class, level, gender, online, totaltime, zone FROM characters WHERE LOWER(name) LIKE LOWER(?) AND account != ? ORDER BY level DESC LIMIT ${safeLimit}`
    : `SELECT guid, name, race, class, level, gender, online, totaltime, zone FROM characters WHERE LOWER(name) LIKE LOWER(?) ORDER BY level DESC LIMIT ${safeLimit}`;

  const params = excludeAccountId
    ? [`${name}%`, excludeAccountId]
    : [`${name}%`];

  const [rows] = await charactersDb.execute<RowDataPacket[]>(query, params);

  return rows as Character[];
}

export async function hasItemInInventory(
  characterGuid: number,
  itemEntry: number,
): Promise<boolean> {
  const [rows] = await charactersDb.execute<RowDataPacket[]>(
    `SELECT 1 FROM character_inventory ci
     JOIN item_instance ii ON ci.item = ii.guid
     WHERE ci.guid = ? AND ii.itemEntry = ?
     LIMIT 1`,
    [characterGuid, itemEntry],
  );

  return rows.length > 0;
}

export type ItemLocation =
  | { location: "mail"; mailId: number; itemGuid: number }
  | { location: "inventory"; itemGuid: number };

export async function findItemLocation(
  characterGuid: number,
  itemEntry: number,
): Promise<ItemLocation | null> {
  // Check mail first
  const [mailRows] = await charactersDb.execute<RowDataPacket[]>(
    `SELECT mi.mail_id, mi.item_guid
     FROM mail_items mi
     JOIN item_instance ii ON mi.item_guid = ii.guid
     WHERE mi.receiver = ? AND ii.itemEntry = ?
     LIMIT 1`,
    [characterGuid, itemEntry],
  );

  if (mailRows.length > 0) {
    return {
      location: "mail",
      mailId: mailRows[0].mail_id,
      itemGuid: mailRows[0].item_guid,
    };
  }

  // Check inventory
  const [invRows] = await charactersDb.execute<RowDataPacket[]>(
    `SELECT ci.item as item_guid
     FROM character_inventory ci
     JOIN item_instance ii ON ci.item = ii.guid
     WHERE ci.guid = ? AND ii.itemEntry = ?
     LIMIT 1`,
    [characterGuid, itemEntry],
  );

  if (invRows.length > 0) {
    return { location: "inventory", itemGuid: invRows[0].item_guid };
  }

  return null;
}

export async function removeMailWithItem(
  mailId: number,
  itemGuid: number,
): Promise<void> {
  await charactersDb.execute("DELETE FROM mail_items WHERE mail_id = ? AND item_guid = ?", [mailId, itemGuid]);
  await charactersDb.execute("DELETE FROM item_instance WHERE guid = ?", [itemGuid]);
  // Delete the mail if it has no remaining items
  await charactersDb.execute(
    `DELETE FROM mail WHERE id = ? AND NOT EXISTS (SELECT 1 FROM mail_items WHERE mail_id = ?)`,
    [mailId, mailId],
  );
}

export async function removeInventoryItem(itemGuid: number): Promise<void> {
  await charactersDb.execute("DELETE FROM character_inventory WHERE item = ?", [itemGuid]);
  await charactersDb.execute("DELETE FROM item_instance WHERE guid = ?", [itemGuid]);
}
