/**
 * Fetch Italian item names from Wowhead and generate UPDATE SQL.
 *
 * Usage:
 *   npx tsx sql/generators/fetch-italian-names.ts
 *
 * What it does:
 *   1. Reads shop_items.sql and shop_set_items.sql to extract all item_ids
 *   2. Fetches Italian names from https://nether.wowhead.com/it/tooltip/item/{id}
 *   3. Outputs UPDATE SQL for both tables to sql/generators/output/italian-names.sql
 */

import fs from "fs";
import path from "path";

// ── Config ──────────────────────────────────────────────────────────────────

const WOWHEAD_IT_TOOLTIP = "https://nether.wowhead.com/it/tooltip/item/";
const FETCH_DELAY_MS = 150; // ~6 req/s
const TIMEOUT_MS = 8000;

// ── Paths ───────────────────────────────────────────────────────────────────

const ROOT = path.join(
  path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")),
  "..",
);
const SHOP_ITEMS_SQL = path.join(ROOT, "shop_items.sql");
const SHOP_SET_ITEMS_SQL = path.join(ROOT, "shop_set_items.sql");
const OUTPUT_FILE = path.join(
  ROOT,
  "generators",
  "output",
  "italian-names.sql",
);

// ── Helpers ─────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function escSql(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

// ── Extract item IDs from SQL files ─────────────────────────────────────────

interface SqlItem {
  table: "shop_items" | "shop_set_items";
  id: number;
  itemId: number;
  currentNameIt: string;
}

function extractShopItems(sql: string): SqlItem[] {
  const items: SqlItem[] = [];
  // Match each VALUES row: (id, 'category', service_type, item_id, ...)
  const rowRegex =
    /\((\d+),\s*'[^']*',\s*(?:NULL|'[^']*'),\s*(\d+),\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'/g;
  let match;

  while ((match = rowRegex.exec(sql)) !== null) {
    items.push({
      table: "shop_items",
      id: parseInt(match[1]),
      itemId: parseInt(match[2]),
      currentNameIt: match[7], // name_it is the 5th name column (en, fr, es, de, it)
    });
  }

  return items;
}

function extractShopSetItems(sql: string): SqlItem[] {
  const items: SqlItem[] = [];
  // Match each VALUES row: (id, set_id, item_id, name_en, name_fr, name_es, name_de, name_it, ...)
  const rowRegex =
    /\((\d+),\s*\d+,\s*(\d+),\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'/g;
  let match;

  while ((match = rowRegex.exec(sql)) !== null) {
    items.push({
      table: "shop_set_items",
      id: parseInt(match[1]),
      itemId: parseInt(match[2]),
      currentNameIt: match[7],
    });
  }

  return items;
}

// ── Fetch Italian name from Wowhead ─────────────────────────────────────────

async function fetchItalianName(itemId: number): Promise<string | null> {
  try {
    const res = await fetch(`${WOWHEAD_IT_TOOLTIP}${itemId}`, {
      headers: { "User-Agent": "Lordaeron-Shop-Generator/1.0" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) return null;

    const data = await res.json();

    return data.name || null;
  } catch {
    return null;
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // Read SQL files
  const shopItemsSql = fs.readFileSync(SHOP_ITEMS_SQL, "utf-8");
  const shopSetItemsSql = fs.readFileSync(SHOP_SET_ITEMS_SQL, "utf-8");

  // Extract items
  const shopItems = extractShopItems(shopItemsSql);
  const shopSetItems = extractShopSetItems(shopSetItemsSql);

  const allItems = [...shopItems, ...shopSetItems];

  // Deduplicate item IDs for fetching
  const uniqueItemIds = [...new Set(allItems.map((i) => i.itemId))];

  process.stderr.write(
    `Found ${shopItems.length} shop_items, ${shopSetItems.length} shop_set_items\n`,
  );
  process.stderr.write(`${uniqueItemIds.length} unique item IDs to fetch\n\n`);

  // Fetch all Italian names
  const italianNames = new Map<number, string>();
  let fetched = 0;
  let failed = 0;

  for (const itemId of uniqueItemIds) {
    fetched++;
    process.stderr.write(
      `  [${fetched}/${uniqueItemIds.length}] Fetching item ${itemId}...`,
    );

    const name = await fetchItalianName(itemId);

    if (name) {
      italianNames.set(itemId, name);
      process.stderr.write(` ${name}\n`);
    } else {
      failed++;
      process.stderr.write(` FAILED\n`);
    }

    await sleep(FETCH_DELAY_MS);
  }

  process.stderr.write(
    `\nFetched ${italianNames.size} names, ${failed} failed\n\n`,
  );

  // Generate UPDATE SQL
  const lines: string[] = [
    "-- Italian item names fetched from https://nether.wowhead.com/it/tooltip/item/{id}",
    `-- Generated on ${new Date().toISOString()}`,
    `-- ${italianNames.size} names fetched, ${failed} failed`,
    "",
    "START TRANSACTION;",
    "",
    "-- ── shop_items ──────────────────────────────────────────────────────────",
    "",
  ];

  let updatedShopItems = 0;

  for (const item of shopItems) {
    const name = italianNames.get(item.itemId);

    if (!name) continue;
    // Skip if already has the same Italian name
    if (item.currentNameIt === name) continue;

    lines.push(
      `UPDATE shop_items SET name_it = '${escSql(name)}' WHERE id = ${item.id};`,
    );
    updatedShopItems++;
  }

  lines.push(
    "",
    "-- ── shop_set_items ──────────────────────────────────────────────────────",
    "",
  );

  let updatedSetItems = 0;

  for (const item of shopSetItems) {
    const name = italianNames.get(item.itemId);

    if (!name) continue;
    if (item.currentNameIt === name) continue;

    lines.push(
      `UPDATE shop_set_items SET name_it = '${escSql(name)}' WHERE id = ${item.id};`,
    );
    updatedSetItems++;
  }

  lines.push("", "COMMIT;", "");

  // Write output
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, lines.join("\n"), "utf-8");

  process.stderr.write(`Output: ${OUTPUT_FILE}\n`);
  process.stderr.write(
    `Updates: ${updatedShopItems} shop_items, ${updatedSetItems} shop_set_items\n`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
