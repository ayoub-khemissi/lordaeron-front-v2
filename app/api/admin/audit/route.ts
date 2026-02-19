import { NextRequest, NextResponse } from "next/server";

import { verifyAdminSession } from "@/lib/admin-auth";
import { getAuditLog } from "@/lib/queries/shop-stats";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await verifyAdminSession();
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const result = await getAuditLog(limit, offset);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin audit fetch error:", error);
    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
