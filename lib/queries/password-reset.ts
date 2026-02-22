import { RowDataPacket } from "mysql2";

import { websiteDb } from "@/lib/db";

export async function createPasswordResetToken(
  accountId: number,
  tokenHash: string,
  email: string,
  locale: string,
): Promise<{ success: boolean; error?: string }> {
  // Rate-limit: check if a token was created in the last 60 seconds
  const [recent] = await websiteDb.execute<RowDataPacket[]>(
    "SELECT id FROM password_reset_tokens WHERE account_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 60 SECOND)",
    [accountId],
  );

  if (recent.length > 0) {
    return { success: false, error: "rateLimited" };
  }

  // Invalidate all previous unused tokens for this account
  await websiteDb.execute(
    "UPDATE password_reset_tokens SET is_used = 1 WHERE account_id = ? AND is_used = 0",
    [accountId],
  );

  // Insert new token (expires in 1 hour)
  await websiteDb.execute(
    "INSERT INTO password_reset_tokens (account_id, token_hash, email, locale, expires_at) VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))",
    [accountId, tokenHash, email, locale],
  );

  return { success: true };
}

export async function findValidResetToken(tokenHash: string): Promise<{
  id: number;
  account_id: number;
  email: string;
  locale: string;
} | null> {
  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    "SELECT id, account_id, email, locale FROM password_reset_tokens WHERE token_hash = ? AND is_used = 0 AND expires_at > NOW()",
    [tokenHash],
  );

  if (rows.length === 0) return null;

  return rows[0] as {
    id: number;
    account_id: number;
    email: string;
    locale: string;
  };
}

export async function markTokenAsUsed(tokenId: number): Promise<void> {
  await websiteDb.execute(
    "UPDATE password_reset_tokens SET is_used = 1 WHERE id = ?",
    [tokenId],
  );
}
