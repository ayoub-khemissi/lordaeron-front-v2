import type { ShopAdmin } from "@/types";

import { RowDataPacket } from "mysql2";

import { websiteDb } from "@/lib/db";

export async function findAdminByUsername(
  username: string,
): Promise<ShopAdmin | null> {
  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    "SELECT * FROM shop_admins WHERE username = ? AND is_active = 1",
    [username],
  );

  if (rows.length === 0) return null;

  return rows[0] as ShopAdmin;
}

export async function findAdminById(id: number): Promise<ShopAdmin | null> {
  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    "SELECT * FROM shop_admins WHERE id = ? AND is_active = 1",
    [id],
  );

  if (rows.length === 0) return null;

  return rows[0] as ShopAdmin;
}

export async function updateAdminLastLogin(id: number): Promise<void> {
  await websiteDb.execute(
    "UPDATE shop_admins SET last_login = NOW() WHERE id = ?",
    [id],
  );
}
