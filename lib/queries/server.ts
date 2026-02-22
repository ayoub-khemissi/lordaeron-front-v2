import { RowDataPacket } from "mysql2";

import { authDb, charactersDb } from "@/lib/db";

export async function getRealmStatus(): Promise<{
  online: boolean;
  name: string;
}> {
  const [rows] = await authDb.execute<RowDataPacket[]>(
    "SELECT id, name, flag FROM realmlist LIMIT 1",
  );

  if (rows.length === 0) {
    return { online: false, name: "Lordaeron" };
  }

  return {
    online: rows[0].flag === 0,
    name: rows[0].name,
  };
}

export async function getOnlineCount(): Promise<number> {
  const [rows] = await charactersDb.execute<RowDataPacket[]>(
    "SELECT COUNT(*) as online_count FROM characters WHERE online = 1",
  );

  return rows[0].online_count;
}

export async function getFactionBalance(): Promise<{
  alliance: number;
  horde: number;
}> {
  const [rows] = await charactersDb.execute<RowDataPacket[]>(
    `SELECT
      SUM(CASE WHEN race IN (1,3,4,7,11) THEN 1 ELSE 0 END) as alliance,
      SUM(CASE WHEN race IN (2,5,6,8,10) THEN 1 ELSE 0 END) as horde
    FROM characters WHERE online = 1`,
  );

  return {
    alliance: rows[0].alliance || 0,
    horde: rows[0].horde || 0,
  };
}

export async function getTotalAccounts(): Promise<number> {
  const [rows] = await authDb.execute<RowDataPacket[]>(
    "SELECT COUNT(*) as total FROM account",
  );

  return rows[0].total;
}


export async function getRealmUptime(): Promise<number | null> {
  const [rows] = await authDb.execute<RowDataPacket[]>(
    "SELECT starttime FROM uptime ORDER BY starttime DESC LIMIT 1",
  );

  if (rows.length === 0) return null;

  return rows[0].starttime;
}
