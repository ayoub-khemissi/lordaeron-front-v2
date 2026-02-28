import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory cache: icon name + displayId from Wowhead
const itemCache = new Map<number, { icon: string; displayId: number }>();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const { itemId: itemIdStr } = await params;
  const itemId = Number(itemIdStr);

  if (isNaN(itemId) || itemId <= 0) {
    return NextResponse.json({ icon: null, displayId: 0 });
  }

  // Check cache
  const cached = itemCache.get(itemId);

  if (cached) {
    return NextResponse.json(cached, {
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  }

  try {
    const res = await fetch(
      `https://www.wowhead.com/wotlk/item=${itemId}&xml`,
      {
        headers: { "User-Agent": "Lordaeron/1.0" },
        signal: AbortSignal.timeout(5000),
      },
    );

    if (!res.ok) {
      return NextResponse.json({ icon: null, displayId: 0 });
    }

    const xml = await res.text();
    const iconMatch = xml.match(/<icon[^>]*>([^<]+)<\/icon>/);
    const icon = iconMatch ? iconMatch[1].trim().toLowerCase() : null;

    const displayMatch = xml.match(/<icon\s+displayId="(\d+)"/);
    const displayId = displayMatch ? Number(displayMatch[1]) : 0;

    const entry = { icon: icon || "", displayId };

    if (icon) {
      itemCache.set(itemId, entry);
    }

    return NextResponse.json(entry, {
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  } catch {
    return NextResponse.json({ icon: null, displayId: 0 });
  }
}
