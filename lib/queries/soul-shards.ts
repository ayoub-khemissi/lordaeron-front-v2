import { RowDataPacket } from "mysql2";

import { websiteDb } from "@/lib/db";

export async function getSoulShardBalance(accountId: number): Promise<number> {
  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    "SELECT balance FROM soul_shards WHERE account_id = ?",
    [accountId],
  );

  if (rows.length === 0) return 0;
  return rows[0].balance as number;
}
