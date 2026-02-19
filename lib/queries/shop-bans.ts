import type { ShopBan } from "@/types";

import { RowDataPacket, ResultSetHeader } from "mysql2";

import { websiteDb } from "@/lib/db";

export async function getActiveBan(accountId: number): Promise<ShopBan | null> {
  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    "SELECT * FROM shop_bans WHERE account_id = ? AND is_active = 1 AND (expires_at IS NULL OR expires_at > NOW()) LIMIT 1",
    [accountId],
  );

  if (rows.length === 0) return null;

  return rows[0] as ShopBan;
}

export async function getAllBans(): Promise<ShopBan[]> {
  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    "SELECT * FROM shop_bans ORDER BY created_at DESC",
  );

  return rows as ShopBan[];
}

export async function createBan(
  accountId: number,
  reason: string,
  bannedBy: number,
  expiresAt: string | null,
): Promise<number> {
  const [result] = await websiteDb.execute<ResultSetHeader>(
    "INSERT INTO shop_bans (account_id, reason, banned_by, expires_at) VALUES (?, ?, ?, ?)",
    [accountId, reason, bannedBy, expiresAt],
  );

  return result.insertId;
}

export async function updateBan(
  id: number,
  data: { reason?: string; expires_at?: string | null; is_active?: boolean },
): Promise<boolean> {
  const fields: string[] = [];
  const params: (string | number | null)[] = [];

  if (data.reason !== undefined) {
    fields.push("reason = ?");
    params.push(data.reason);
  }
  if (data.expires_at !== undefined) {
    fields.push("expires_at = ?");
    params.push(data.expires_at);
  }
  if (data.is_active !== undefined) {
    fields.push("is_active = ?");
    params.push(data.is_active ? 1 : 0);
  }

  if (fields.length === 0) return false;

  params.push(id);
  const [result] = await websiteDb.execute<ResultSetHeader>(
    `UPDATE shop_bans SET ${fields.join(", ")} WHERE id = ?`,
    params,
  );

  return result.affectedRows > 0;
}

export async function deleteBan(id: number): Promise<boolean> {
  const [result] = await websiteDb.execute<ResultSetHeader>(
    "UPDATE shop_bans SET is_active = 0 WHERE id = ?",
    [id],
  );

  return result.affectedRows > 0;
}
