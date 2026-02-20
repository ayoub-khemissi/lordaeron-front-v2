import type { Account, AccountBan, IpBan } from "@/types";

import { RowDataPacket } from "mysql2";

import { authDb } from "@/lib/db";

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

export async function findAccountById(id: number): Promise<Account | null> {
  const [rows] = await authDb.execute<RowDataPacket[]>(
    "SELECT id, username, email, joindate, last_ip, expansion FROM account WHERE id = ?",
    [id],
  );

  if (rows.length === 0) return null;

  return rows[0] as Account;
}

export async function getAccountBan(
  accountId: number,
): Promise<AccountBan | null> {
  const [rows] = await authDb.execute<RowDataPacket[]>(
    "SELECT id, bandate, unbandate, bannedby, banreason, active FROM account_banned WHERE id = ? AND active = 1 ORDER BY bandate DESC LIMIT 1",
    [accountId],
  );

  if (rows.length === 0) return null;

  return rows[0] as AccountBan;
}

export async function getIpBan(ip: string): Promise<IpBan | null> {
  const [rows] = await authDb.execute<RowDataPacket[]>(
    "SELECT ip, bandate, unbandate, bannedby, banreason FROM ip_banned WHERE ip = ? AND (unbandate > UNIX_TIMESTAMP() OR unbandate = bandate) ORDER BY bandate DESC LIMIT 1",
    [ip],
  );

  if (rows.length === 0) return null;

  return rows[0] as IpBan;
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
