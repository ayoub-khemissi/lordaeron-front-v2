import { RowDataPacket } from "mysql2";

import { websiteDb } from "@/lib/db";
import type { NewsRow } from "@/types";

export async function getLatestNews(limit: number = 5): Promise<NewsRow[]> {
  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    "SELECT * FROM news ORDER BY created_at DESC LIMIT ?",
    [limit],
  );

  return rows as NewsRow[];
}

export async function getNewsById(id: number): Promise<NewsRow | null> {
  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    "SELECT * FROM news WHERE id = ?",
    [id],
  );

  if (rows.length === 0) return null;
  return rows[0] as NewsRow;
}
