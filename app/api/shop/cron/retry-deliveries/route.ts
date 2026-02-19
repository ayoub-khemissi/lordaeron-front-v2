import { NextRequest, NextResponse } from "next/server";

import { getPendingDeliveryPurchases } from "@/lib/queries/shop-purchases";
import { retryPurchaseDelivery } from "@/lib/soap";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.CRON_SECRET;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const purchases = await getPendingDeliveryPurchases();
    let succeeded = 0;
    let failed = 0;

    for (const purchase of purchases) {
      const result = await retryPurchaseDelivery(purchase);

      if (result.success) {
        succeeded++;
      } else {
        failed++;
        console.error(
          `Retry failed for purchase #${purchase.id}:`,
          result.message,
        );
      }
    }

    return NextResponse.json({
      processed: purchases.length,
      succeeded,
      failed,
    });
  } catch (error) {
    console.error("Cron retry-deliveries error:", error);

    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
