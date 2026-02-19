import { RowDataPacket } from "mysql2";

import { websiteDb } from "@/lib/db";

export async function getShopStats() {
  const [revenueRows] = await websiteDb.execute<RowDataPacket[]>(
    "SELECT COALESCE(SUM(price_paid), 0) as total_revenue, COUNT(*) as total_purchases FROM shop_purchases WHERE status = 'completed'",
  );

  const [activeItemsRows] = await websiteDb.execute<RowDataPacket[]>(
    "SELECT COUNT(*) as count FROM shop_items WHERE is_active = 1",
  );

  const totalRevenue = revenueRows[0].total_revenue;
  const totalPurchases = revenueRows[0].total_purchases;
  const averageOrderValue = totalPurchases > 0 ? Math.round(totalRevenue / totalPurchases) : 0;
  const activeItems = activeItemsRows[0].count;

  return { totalRevenue, totalPurchases, averageOrderValue, activeItems };
}

export async function getSalesByCategory() {
  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    `SELECT COALESCE(i.category, 'sets') as category, COUNT(p.id) as count, COALESCE(SUM(p.price_paid), 0) as revenue
    FROM shop_purchases p
    LEFT JOIN shop_items i ON p.item_id_ref = i.id
    WHERE p.status = 'completed'
    GROUP BY COALESCE(i.category, 'sets')
    ORDER BY revenue DESC`,
  );

  return rows as { category: string; count: number; revenue: number }[];
}

export async function getTopItems(limit: number = 10) {
  const safeLimit = Math.max(1, Math.min(Math.floor(limit), 100));

  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    `SELECT
      COALESCE(i.id, s.id) as id,
      COALESCE(i.name_en, s.name_en) as name_en,
      COALESCE(i.name_fr, s.name_fr) as name_fr,
      COALESCE(i.name_es, s.name_es) as name_es,
      COALESCE(i.name_de, s.name_de) as name_de,
      COALESCE(i.name_it, s.name_it) as name_it,
      i.item_id,
      COUNT(p.id) as count,
      COALESCE(SUM(p.price_paid), 0) as revenue
    FROM shop_purchases p
    LEFT JOIN shop_items i ON p.item_id_ref = i.id
    LEFT JOIN shop_sets s ON p.set_id_ref = s.id
    WHERE p.status = 'completed'
    GROUP BY COALESCE(i.id, s.id), COALESCE(i.name_en, s.name_en), COALESCE(i.name_fr, s.name_fr),
      COALESCE(i.name_es, s.name_es), COALESCE(i.name_de, s.name_de), COALESCE(i.name_it, s.name_it), i.item_id
    ORDER BY count DESC
    LIMIT ${safeLimit}`,
  );

  return rows as { id: number; name_en: string; name_fr: string; name_es: string; name_de: string; name_it: string; item_id: number | null; count: number; revenue: number }[];
}

export async function getSalesTrend(period: "daily" | "weekly" | "monthly" = "daily", days: number = 30) {
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
      COUNT(*) as count, COALESCE(SUM(price_paid), 0) as revenue
    FROM shop_purchases
    WHERE status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY period
    ORDER BY period ASC`,
    [dateFormat, days],
  );

  return rows as { period: string; count: number; revenue: number }[];
}

export async function getAuditLog(limit: number = 50, offset: number = 0) {
  const safeLimit = Math.max(1, Math.min(Math.floor(limit), 200));
  const safeOffset = Math.max(0, Math.floor(offset));

  const [rows] = await websiteDb.execute<RowDataPacket[]>(
    `SELECT l.*, a.display_name as admin_name
    FROM shop_audit_log l
    LEFT JOIN shop_admins a ON l.admin_id = a.id
    ORDER BY l.created_at DESC
    LIMIT ${safeLimit} OFFSET ${safeOffset}`,
  );

  const [countRows] = await websiteDb.execute<RowDataPacket[]>(
    "SELECT COUNT(*) as total FROM shop_audit_log",
  );

  return { logs: rows, total: countRows[0].total };
}

export async function createAuditLog(
  adminId: number,
  action: string,
  targetType: string,
  targetId: number | null,
  details: Record<string, unknown> | null,
): Promise<void> {
  await websiteDb.execute(
    "INSERT INTO shop_audit_log (admin_id, action, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)",
    [adminId, action, targetType, targetId, details ? JSON.stringify(details) : null],
  );
}
