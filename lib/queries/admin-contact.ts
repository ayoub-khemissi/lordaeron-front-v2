import type { ContactMessage } from "@/types";

import { RowDataPacket } from "mysql2";

import { websiteDb } from "@/lib/db";

export async function getContactMessages(filters?: {
  limit?: number;
  offset?: number;
  isRead?: boolean;
}): Promise<{ messages: ContactMessage[]; total: number }> {
  let query = "SELECT * FROM contact_messages WHERE 1=1";
  let countQuery = "SELECT COUNT(*) as total FROM contact_messages WHERE 1=1";
  const params: (string | number)[] = [];
  const countParams: (string | number)[] = [];

  if (filters?.isRead !== undefined) {
    query += " AND is_read = ?";
    countQuery += " AND is_read = ?";
    params.push(filters.isRead ? 1 : 0);
    countParams.push(filters.isRead ? 1 : 0);
  }

  query += " ORDER BY created_at DESC";
  query += ` LIMIT ${filters?.limit || 50} OFFSET ${filters?.offset || 0}`;

  const [rows] = await websiteDb.execute<RowDataPacket[]>(query, params);
  const [countRows] = await websiteDb.execute<RowDataPacket[]>(
    countQuery,
    countParams,
  );

  return {
    messages: rows as ContactMessage[],
    total: countRows[0].total,
  };
}

export async function markContactMessageAsRead(id: number): Promise<void> {
  await websiteDb.execute(
    "UPDATE contact_messages SET is_read = 1 WHERE id = ?",
    [id],
  );
}
