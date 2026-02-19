import { NextRequest, NextResponse } from "next/server";

import { verifySession } from "@/lib/auth";
import { getShopItemById } from "@/lib/queries/shop-items";
import { localizeShopItem } from "@/lib/shop-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const itemId = parseInt(id);

    if (isNaN(itemId)) {
      return NextResponse.json({ error: "invalidId" }, { status: 400 });
    }

    const item = await getShopItemById(itemId);

    if (!item || !item.is_active) {
      return NextResponse.json({ error: "itemNotFound" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";

    return NextResponse.json({ item: localizeShopItem(item, locale) });
  } catch (error) {
    console.error("Shop item detail error:", error);

    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
