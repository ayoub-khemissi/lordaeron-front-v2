import type { ShardTransaction } from "@/types";

import { RowDataPacket, ResultSetHeader } from "mysql2";

import { websiteDb } from "@/lib/db";

export async function createShardTransaction(
  accountId: number,
  sessionId: string,
  packageShards: number,
  priceEurCents: number,
): Promise<number> {
  const [result] = await websiteDb.execute<ResultSetHeader>(
    `INSERT INTO shard_transactions
      (account_id, stripe_checkout_session_id, package_shards, price_eur_cents)
     VALUES (?, ?, ?, ?)`,
    [accountId, sessionId, packageShards, priceEurCents],
  );

  return result.insertId;
}

export async function completeShardTransaction(
  sessionId: string,
  paymentIntentId: string | null,
): Promise<{ success: boolean; error?: string }> {
  const connection = await websiteDb.getConnection();

  try {
    await connection.beginTransaction();

    // Lock the transaction row
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT * FROM shard_transactions
       WHERE stripe_checkout_session_id = ? AND status = 'pending'
       FOR UPDATE`,
      [sessionId],
    );

    if (rows.length === 0) {
      await connection.rollback();

      return { success: false, error: "transactionNotFound" };
    }

    const tx = rows[0] as ShardTransaction;

    // Update transaction status
    await connection.execute(
      `UPDATE shard_transactions
       SET status = 'completed',
           stripe_payment_intent_id = ?,
           credited_at = NOW()
       WHERE id = ?`,
      [paymentIntentId, tx.id],
    );

    // Credit soul shards balance
    await connection.execute(
      `INSERT INTO soul_shards (account_id, balance)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE balance = balance + ?`,
      [tx.account_id, tx.package_shards, tx.package_shards],
    );

    await connection.commit();

    return { success: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function expireTransaction(sessionId: string): Promise<void> {
  await websiteDb.execute(
    `UPDATE shard_transactions SET status = 'expired'
     WHERE stripe_checkout_session_id = ? AND status = 'pending'`,
    [sessionId],
  );
}

export async function getTransactionsByAccount(
  accountId: number,
): Promise<ShardTransaction[]> {
  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    `SELECT * FROM shard_transactions
     WHERE account_id = ?
     ORDER BY created_at DESC`,
    [accountId],
  );

  return rows as ShardTransaction[];
}
