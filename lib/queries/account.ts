import { RowDataPacket } from "mysql2";

import { authDb } from "@/lib/db";
import type { Account } from "@/types";

export async function findAccountByUsername(
  username: string,
): Promise<Account | null> {
  const [rows] = await authDb.execute<RowDataPacket[]>(
    "SELECT id, username, email, salt, verifier, joindate, last_ip, expansion FROM account WHERE username = ?",
    [username.toUpperCase()],
  );

  if (rows.length === 0) return null;
  return rows[0] as Account;
}

export async function findAccountById(
  id: number,
): Promise<Account | null> {
  const [rows] = await authDb.execute<RowDataPacket[]>(
    "SELECT id, username, email, joindate, last_ip, expansion FROM account WHERE id = ?",
    [id],
  );

  if (rows.length === 0) return null;
  return rows[0] as Account;
}

export async function createAccount(
  username: string,
  email: string,
  salt: Uint8Array,
  verifier: Uint8Array,
): Promise<number> {
  const [result] = await authDb.execute(
    "INSERT INTO account (username, salt, verifier, email, expansion) VALUES (?, ?, ?, ?, 2)",
    [username.toUpperCase(), salt, verifier, email],
  );

  return (result as { insertId: number }).insertId;
}
