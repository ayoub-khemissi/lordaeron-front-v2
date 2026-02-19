import { ResultSetHeader } from "mysql2";

import { websiteDb } from "@/lib/db";

export async function createContactMessage(
  accountId: number,
  username: string,
  email: string,
  subject: string,
  message: string,
): Promise<number> {
  const [result] = await websiteDb.execute<ResultSetHeader>(
    "INSERT INTO contact_messages (account_id, username, email, subject, message) VALUES (?, ?, ?, ?, ?)",
    [accountId, username, email, subject, message],
  );

  return result.insertId;
}
