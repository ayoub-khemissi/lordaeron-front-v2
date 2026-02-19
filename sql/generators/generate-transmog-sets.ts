/**
 * Generate shop_sets + shop_set_items SQL from transmog.html (Wowhead scrape).
 *
 * Usage:
 *   npx tsx sql/generators/generate-transmog-sets.ts
 *
 * What it does:
 *   1. Parses doc/transmog.html to extract all transmog sets
 *   2. Extracts item IDs from Wowhead URLs and icon URLs
 *   3. Fetches item names from Wowhead tooltip API (all 5 locales)
 *   4. Outputs INSERT SQL for shop_sets and shop_set_items
 *
 * Pricing (100 Soul Shards ≈ 1 EUR):
 *   - Based on armor quality, piece count, and popularity
 */

import fs from "fs";
import path from "path";

// ── Config ──────────────────────────────────────────────────────────────────

const WOWHEAD_TOOLTIP_URL = "https://nether.wowhead.com/wotlk/tooltip/item/";
const FETCH_DELAY_MS = 150;

// ── Types ───────────────────────────────────────────────────────────────────

interface TransmogItem {
  itemId: number;
  iconUrl: string;
}

interface TransmogSet {
  name: string;
  quality: number; // 3=rare, 4=epic
  setType: string; // e.g. "Set de Raid Palier 2"
  reqLevel: number;
  armorType: string; // Plaques, Mailles, Cuir, Tissu
  style: string; // Ensemble de raid, Ensemble JcJ, etc.
  popularity: number; // 1-8
  items: TransmogItem[];
}

interface ItemLocale {
  name_en: string;
  name_fr: string;
  name_es: string;
  name_de: string;
  name_it: string;
  quality: number;
}

// ── Armor type → class IDs mapping ──────────────────────────────────────────

const ARMOR_CLASS_IDS: Record<string, number[] | null> = {
  Plaques: [1, 2, 6], // Warrior, Paladin, Death Knight
  Mailles: [3, 7], // Hunter, Shaman
  Cuir: [4, 11], // Rogue, Druid
  Tissu: [5, 8, 9], // Priest, Mage, Warlock
};

// ── Pricing formula ─────────────────────────────────────────────────────────

function computeSetPrice(set: TransmogSet): number {
  const basePricePerPiece = set.quality >= 4 ? 120 : 80;
  const pieceCount = set.items.length;
  let total = basePricePerPiece * pieceCount;

  // Popularity bonus (higher popularity = slightly higher price)
  if (set.popularity >= 7) total = Math.round(total * 1.2);
  else if (set.popularity >= 5) total = Math.round(total * 1.1);

  // Round to nearest 50
  total = Math.round(total / 50) * 50;

  // Floor 300, cap 2000
  return Math.max(300, Math.min(2000, total));
}

// ── Description generators ──────────────────────────────────────────────────

type Locale5 = "en" | "fr" | "es" | "de" | "it";

const ARMOR_TYPE_LOCALE: Record<Locale5, Record<string, string>> = {
  en: { Plaques: "Plate", Mailles: "Mail", Cuir: "Leather", Tissu: "Cloth" },
  fr: { Plaques: "Plaques", Mailles: "Mailles", Cuir: "Cuir", Tissu: "Tissu" },
  es: { Plaques: "Placas", Mailles: "Malla", Cuir: "Cuero", Tissu: "Tela" },
  de: { Plaques: "Platte", Mailles: "Kette", Cuir: "Leder", Tissu: "Stoff" },
  it: { Plaques: "Piastre", Mailles: "Maglia", Cuir: "Cuoio", Tissu: "Stoffa" },
};

function makeDescription(set: TransmogSet, locale: Locale5): string {
  const armor = ARMOR_TYPE_LOCALE[locale][set.armorType] || set.armorType;
  const pieces = set.items.length;

  switch (locale) {
    case "en":
      return `${armor} transmog set — ${pieces} pieces`;
    case "fr":
      return `Set transmog ${armor} — ${pieces} pièces`;
    case "es":
      return `Set transmog ${armor} — ${pieces} piezas`;
    case "de":
      return `Transmog-Set ${armor} — ${pieces} Teile`;
    case "it":
      return `Set transmog ${armor} — ${pieces} pezzi`;
  }
}

// ── HTML parser ─────────────────────────────────────────────────────────────

function parseTransmogHtml(html: string): TransmogSet[] {
  const sets: TransmogSet[] = [];

  // Split by listview-row
  const rowRegex = /<tr class="listview-row">([\s\S]*?)<\/tr>/g;
  let match: RegExpExecArray | null;

  while ((match = rowRegex.exec(html)) !== null) {
    const rowHtml = match[1];

    // Extract set name and quality from <a class="q3|q4 listview-cleartext">
    const nameMatch = rowHtml.match(
      /<a class="(q\d) listview-cleartext"[^>]*>([^<]+)<\/a>/,
    );

    if (!nameMatch) continue;

    const qualityClass = nameMatch[1];
    const quality =
      qualityClass === "q4"
        ? 4
        : qualityClass === "q3"
          ? 3
          : parseInt(qualityClass.replace("q", ""));
    const name = nameMatch[2].replace(/\s+/g, " ").trim();

    // Extract set type from <div class="small">
    const typeMatch = rowHtml.match(/<div class="small">([^<]*)<\/div>/);
    const setType = typeMatch ? typeMatch[1].trim() : "";

    // Extract all <td> contents
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/g;
    const tds: string[] = [];
    let tdMatch: RegExpExecArray | null;

    while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
      tds.push(tdMatch[1].trim());
    }

    // tds[0] = name+type, tds[1] = req level, tds[2] = items, tds[3] = armor type, tds[4] = style, tds[5] = popularity
    const reqLevel = tds[1] ? parseInt(tds[1]) || 70 : 70;

    // Armor type (strip tags)
    const armorType = tds[3] ? tds[3].replace(/<[^>]*>/g, "").trim() : "";

    // Style (strip tags)
    const style = tds[4] ? tds[4].replace(/<[^>]*>/g, "").trim() : "";

    // Popularity
    const popMatch = rowHtml.match(/popularity-icon popularity-(\d)/);
    const popularity = popMatch ? parseInt(popMatch[1]) : 5;

    // Extract items from the icons section (tds[2])
    const itemsHtml = tds[2] || "";
    const items: TransmogItem[] = [];

    // Extract item IDs from href="/item=XXXXX/"
    const itemIdRegex = /href="[^"]*\/item=(\d+)[^"]*"/g;
    const iconRegex = /background-image:\s*url\(&quot;([^&]+)&quot;\)/g;

    const itemIds: number[] = [];
    const iconUrls: string[] = [];

    let itemIdMatch: RegExpExecArray | null;

    while ((itemIdMatch = itemIdRegex.exec(itemsHtml)) !== null) {
      itemIds.push(parseInt(itemIdMatch[1]));
    }

    let iconMatch: RegExpExecArray | null;

    while ((iconMatch = iconRegex.exec(itemsHtml)) !== null) {
      // Convert /small/ to /large/
      iconUrls.push(iconMatch[1].replace("/icons/small/", "/icons/large/"));
    }

    for (let i = 0; i < itemIds.length; i++) {
      items.push({
        itemId: itemIds[i],
        iconUrl: iconUrls[i] || "",
      });
    }

    if (items.length === 0) continue;

    sets.push({
      name,
      quality,
      setType,
      reqLevel,
      armorType,
      style,
      popularity,
      items,
    });
  }

  return sets;
}

// ── Wowhead API ─────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const localeCache = new Map<string, ItemLocale>();

async function fetchItemLocales(itemId: number): Promise<ItemLocale> {
  const key = String(itemId);

  if (localeCache.has(key)) return localeCache.get(key)!;

  const result: ItemLocale = {
    name_en: "",
    name_fr: "",
    name_es: "",
    name_de: "",
    name_it: "",
    quality: 0,
  };

  // Fetch English first (always available)
  try {
    const res = await fetch(`${WOWHEAD_TOOLTIP_URL}${itemId}`, {
      headers: { "User-Agent": "Lordaeron-Shop-Generator/1.0" },
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      const data = await res.json();

      result.name_en = data.name || "";
      result.quality = data.quality ?? 0;
    }
  } catch {}

  // Fetch FR
  try {
    const res = await fetch(
      `https://nether.wowhead.com/wotlk/fr/tooltip/item/${itemId}`,
      {
        headers: { "User-Agent": "Lordaeron-Shop-Generator/1.0" },
        signal: AbortSignal.timeout(8000),
      },
    );

    if (res.ok) {
      const data = await res.json();

      result.name_fr = data.name || "";
    }
  } catch {}
  await sleep(FETCH_DELAY_MS);

  // Fetch ES
  try {
    const res = await fetch(
      `https://nether.wowhead.com/wotlk/es/tooltip/item/${itemId}`,
      {
        headers: { "User-Agent": "Lordaeron-Shop-Generator/1.0" },
        signal: AbortSignal.timeout(8000),
      },
    );

    if (res.ok) {
      const data = await res.json();

      result.name_es = data.name || "";
    }
  } catch {}
  await sleep(FETCH_DELAY_MS);

  // Fetch DE
  try {
    const res = await fetch(
      `https://nether.wowhead.com/wotlk/de/tooltip/item/${itemId}`,
      {
        headers: { "User-Agent": "Lordaeron-Shop-Generator/1.0" },
        signal: AbortSignal.timeout(8000),
      },
    );

    if (res.ok) {
      const data = await res.json();

      result.name_de = data.name || "";
    }
  } catch {}
  await sleep(FETCH_DELAY_MS);

  localeCache.set(key, result);

  return result;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function escSql(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

// ── Main ────────────────────────────────────────────────────────────────────

const HTML_FILE = path.join(
  path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")),
  "..",
  "..",
  "doc",
  "transmog.html",
);

const OUTPUT_FILE = path.join(
  path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")),
  "output",
  "transmog-sets.sql",
);

async function main() {
  process.stderr.write(`Reading ${HTML_FILE}...\n`);
  const html = fs.readFileSync(HTML_FILE, "utf-8");

  process.stderr.write("Parsing transmog sets...\n");
  const sets = parseTransmogHtml(html);

  process.stderr.write(`Found ${sets.length} transmog sets\n\n`);

  const lines: string[] = [];
  const out = (line = "") => lines.push(line);

  out(
    "-- =============================================================================",
  );
  out("-- Transmog Sets Seed — Auto-generated from doc/transmog.html");
  out(`-- Generated: ${new Date().toISOString()}`);
  out("-- Database: lordaeron_website");
  out("-- Pricing: 100 Soul Shards = 1 EUR");
  out(
    "-- =============================================================================",
  );
  out();
  out("SET FOREIGN_KEY_CHECKS = 0;");
  out("DELETE FROM shop_set_items;");
  out("DELETE FROM shop_sets;");
  out("SET FOREIGN_KEY_CHECKS = 1;");
  out();

  // Collect all unique item IDs to batch fetch
  const allItemIds = new Set<number>();

  for (const set of sets) {
    for (const item of set.items) {
      allItemIds.add(item.itemId);
    }
  }

  process.stderr.write(
    `Fetching localized names for ${allItemIds.size} unique items...\n`,
  );

  // Fetch all item locales
  let fetchCount = 0;

  for (const itemId of allItemIds) {
    fetchCount++;
    process.stderr.write(
      `  [${fetchCount}/${allItemIds.size}] Fetching item ${itemId}...`,
    );
    const locale = await fetchItemLocales(itemId);

    process.stderr.write(` ${locale.name_en || "(no name)"}\n`);
    await sleep(FETCH_DELAY_MS);
  }

  // Sort sets by: popularity DESC, quality DESC, name ASC
  sets.sort((a, b) => {
    if (b.popularity !== a.popularity) return b.popularity - a.popularity;
    if (b.quality !== a.quality) return b.quality - a.quality;

    return a.name.localeCompare(b.name);
  });

  // ── Generate shop_sets SQL ──

  out(
    "-- ─────────────────────────────────────────────────────────────────────────────",
  );
  out(`-- SHOP_SETS (${sets.length} sets)`);
  out(
    "-- ─────────────────────────────────────────────────────────────────────────────",
  );
  out();

  for (let i = 0; i < sets.length; i++) {
    const set = sets[i];
    const price = computeSetPrice(set);
    const classIds = ARMOR_CLASS_IDS[set.armorType] || null;
    const classIdsStr = classIds ? `'${JSON.stringify(classIds)}'` : "NULL";
    const iconUrl = set.items[0]?.iconUrl || null;
    const iconStr = iconUrl ? `'${escSql(iconUrl)}'` : "NULL";
    const isHighlighted = set.popularity >= 7 ? 1 : 0;
    const sortOrder = (i + 1) * 10;

    const descEn = makeDescription(set, "en");
    const descFr = makeDescription(set, "fr");
    const descEs = makeDescription(set, "es");
    const descDe = makeDescription(set, "de");
    const descIt = makeDescription(set, "it");

    out(
      `INSERT INTO shop_sets (id, name_en, name_fr, name_es, name_de, name_it, description_en, description_fr, description_es, description_de, description_it, price, discount_percentage, class_ids, faction, icon_url, is_highlighted, is_active, min_level, sort_order) VALUES`,
    );
    out(
      `  (${i + 1}, '${escSql(set.name)}', '${escSql(set.name)}', '${escSql(set.name)}', '${escSql(set.name)}', '${escSql(set.name)}', '${escSql(descEn)}', '${escSql(descFr)}', '${escSql(descEs)}', '${escSql(descDe)}', '${escSql(descIt)}', ${price}, 0, ${classIdsStr}, 'both', ${iconStr}, ${isHighlighted}, 1, ${set.reqLevel}, ${sortOrder});`,
    );
  }

  out();

  // ── Generate shop_set_items SQL ──

  out(
    "-- ─────────────────────────────────────────────────────────────────────────────",
  );
  out("-- SHOP_SET_ITEMS");
  out(
    "-- ─────────────────────────────────────────────────────────────────────────────",
  );
  out();

  for (let i = 0; i < sets.length; i++) {
    const set = sets[i];
    const setId = i + 1;

    out(`-- Set ${setId}: ${set.name}`);

    for (let j = 0; j < set.items.length; j++) {
      const item = set.items[j];
      const locale = localeCache.get(String(item.itemId));
      const nameEn = locale?.name_en || "";
      const nameFr = locale?.name_fr || "";
      const nameEs = locale?.name_es || "";
      const nameDe = locale?.name_de || "";
      const nameIt = ""; // no itIT in 3.3.5a
      const quality = locale?.quality ?? "NULL";
      const iconStr = item.iconUrl ? `'${escSql(item.iconUrl)}'` : "NULL";

      out(
        `INSERT INTO shop_set_items (set_id, item_id, name_en, name_fr, name_es, name_de, name_it, icon_url, quality, sort_order) VALUES`,
      );
      out(
        `  (${setId}, ${item.itemId}, '${escSql(nameEn)}', '${escSql(nameFr)}', '${escSql(nameEs)}', '${escSql(nameDe)}', '${escSql(nameIt)}', ${iconStr}, ${quality}, ${(j + 1) * 10});`,
      );
    }

    out();
  }

  // Write file
  fs.writeFileSync(OUTPUT_FILE, lines.join("\n"), "utf-8");
  process.stderr.write(
    `\nDone! ${sets.length} sets written to ${OUTPUT_FILE}\n`,
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
