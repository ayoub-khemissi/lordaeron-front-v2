import { NextRequest, NextResponse } from "next/server";

import { verifySession } from "@/lib/auth";
import { getShopSetById } from "@/lib/queries/shop-sets";
import { localizeShopSet } from "@/lib/shop-utils";

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
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";

    const set = await getShopSetById(parseInt(id));

    if (!set || !set.is_active) {
      return NextResponse.json({ error: "setNotFound" }, { status: 404 });
    }

    return NextResponse.json({ set: localizeShopSet(set, locale) });
  } catch (error) {
    console.error("Shop set detail error:", error);

    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
