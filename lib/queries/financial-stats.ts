import { RowDataPacket } from "mysql2";

import { websiteDb } from "@/lib/db";

export async function getFinancialKPIs() {
  const [revenueRows] = await websiteDb.execute<RowDataPacket[]>(
    `SELECT
      COALESCE(SUM(price_eur_cents), 0) as total_eur_cents,
      COUNT(*) as total_transactions,
      COUNT(DISTINCT account_id) as unique_buyers
    FROM shard_transactions
    WHERE status = 'completed'`,
  );

  const [refundRows] = await websiteDb.execute<RowDataPacket[]>(
    `SELECT
      COUNT(*) as refund_count,
      COALESCE(SUM(price_eur_cents), 0) as refund_eur_cents
    FROM shard_transactions
    WHERE status = 'refunded'`,
  );

  const [shardRows] = await websiteDb.execute<RowDataPacket[]>(
    `SELECT
      COALESCE(SUM(CASE WHEN status = 'completed' THEN package_shards ELSE 0 END), 0) as shards_purchased,
      COALESCE(SUM(CASE WHEN status = 'refunded' THEN package_shards ELSE 0 END), 0) as shards_refunded
    FROM shard_transactions`,
  );

  const [spentRows] = await websiteDb.execute<RowDataPacket[]>(
    `SELECT COALESCE(SUM(price_paid), 0) as shards_spent
    FROM shop_purchases
    WHERE status = 'completed'`,
  );

  const totalEurCents = revenueRows[0].total_eur_cents;
  const totalTransactions = revenueRows[0].total_transactions;
  const uniqueBuyers = revenueRows[0].unique_buyers;
  const avgTransactionCents =
    totalTransactions > 0
      ? Math.round(totalEurCents / totalTransactions)
      : 0;

  const refundCount = refundRows[0].refund_count;
  const refundEurCents = refundRows[0].refund_eur_cents;
  const allCompleted = totalTransactions + refundCount;
  const refundRate =
    allCompleted > 0
      ? Math.round((refundCount / allCompleted) * 10000) / 100
      : 0;

  const shardsPurchased = shardRows[0].shards_purchased;
  const shardsRefunded = shardRows[0].shards_refunded;
  const shardsSpent = spentRows[0].shards_spent;
  const shardsBalance = shardsPurchased - shardsRefunded - shardsSpent;

  return {
    totalEurCents,
    totalTransactions,
    avgTransactionCents,
    refundRate,
    refundEurCents,
    uniqueBuyers,
    shardsPurchased,
    shardsSpent,
    shardsBalance,
  };
}

export async function getTransactionsByStatus() {
  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    `SELECT status, COUNT(*) as count
    FROM shard_transactions
    GROUP BY status`,
  );

  return rows as { status: string; count: number }[];
}

export async function getRevenueTrend(
  period: "daily" | "weekly" | "monthly" = "daily",
  days: number = 30,
) {
  let dateFormat: string;

  switch (period) {
    case "weekly":
      dateFormat = "%Y-%u";
      break;
    case "monthly":
      dateFormat = "%Y-%m";
      break;
    default:
      dateFormat = "%Y-%m-%d";
  }

  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    `SELECT DATE_FORMAT(created_at, ?) as period,
      COALESCE(SUM(price_eur_cents), 0) as eur_cents,
      COUNT(*) as count
    FROM shard_transactions
    WHERE status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY period
    ORDER BY period ASC`,
    [dateFormat, days],
  );

  return rows as { period: string; eur_cents: number; count: number }[];
}

export async function getRevenueByPackage() {
  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    `SELECT
      price_eur_cents,
      package_shards,
      COUNT(*) as count,
      COALESCE(SUM(price_eur_cents), 0) as total_eur_cents
    FROM shard_transactions
    WHERE status = 'completed'
    GROUP BY price_eur_cents, package_shards
    ORDER BY total_eur_cents DESC`,
  );

  return rows as {
    price_eur_cents: number;
    package_shards: number;
    count: number;
    total_eur_cents: number;
  }[];
}

export async function getMonthlyGrowth() {
  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    `SELECT
      DATE_FORMAT(created_at, '%Y-%m') as month,
      COALESCE(SUM(price_eur_cents), 0) as eur_cents,
      COUNT(*) as count
    FROM shard_transactions
    WHERE status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
    GROUP BY month
    ORDER BY month ASC`,
  );

  return rows as { month: string; eur_cents: number; count: number }[];
}

export async function getTopSpenders(limit: number = 10) {
  const safeLimit = Math.max(1, Math.min(Math.floor(limit), 100));

  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    `SELECT
      account_id,
      COUNT(*) as transaction_count,
      COALESCE(SUM(price_eur_cents), 0) as total_eur_cents,
      COALESCE(SUM(package_shards), 0) as total_shards
    FROM shard_transactions
    WHERE status = 'completed'
    GROUP BY account_id
    ORDER BY total_eur_cents DESC
    LIMIT ${safeLimit}`,
  );

  return rows as {
    account_id: number;
    transaction_count: number;
    total_eur_cents: number;
    total_shards: number;
  }[];
}

export async function getTransactionList(filters: {
  limit?: number;
  offset?: number;
  account_id?: number;
  status?: string;
}) {
  const safeLimit = Math.max(1, Math.min(Math.floor(filters.limit || 50), 200));
  const safeOffset = Math.max(0, Math.floor(filters.offset || 0));

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters.account_id) {
    conditions.push("account_id = ?");
    params.push(filters.account_id);
  }

  if (
    filters.status &&
    ["pending", "completed", "failed", "expired", "refunded"].includes(
      filters.status,
    )
  ) {
    conditions.push("status = ?");
    params.push(filters.status);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    `SELECT id, account_id, package_shards, price_eur_cents, currency, status, created_at
    FROM shard_transactions
    ${where}
    ORDER BY created_at DESC
    LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    params,
  );

  const [countRows] = await websiteDb.execute<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM shard_transactions ${where}`,
    params,
  );

  return {
    transactions: rows as {
      id: number;
      account_id: number;
      package_shards: number;
      price_eur_cents: number;
      currency: string;
      status: string;
      created_at: string;
    }[],
    total: countRows[0].total as number,
  };
}
