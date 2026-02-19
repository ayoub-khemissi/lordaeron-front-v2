import { NextRequest, NextResponse } from "next/server";

import { verifySession } from "@/lib/auth";
import { getActiveBan } from "@/lib/queries/shop-bans";
import { createShardTransaction } from "@/lib/queries/shard-transactions";
import { getStripe, getPackageById } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const ban = await getActiveBan(session.id);

    if (ban) {
      return NextResponse.json({ error: "accountBanned" }, { status: 403 });
    }

    const { packageId, locale } = await request.json();
    const pkg = getPackageById(packageId);

    if (!pkg) {
      return NextResponse.json({ error: "invalidPackage" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const localePrefix = locale || "en";

    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${pkg.shards} Soul Shards`,
              description: `${pkg.shards} Soul Shards for Lordaeron Shop`,
            },
            unit_amount: pkg.priceEurCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        account_id: String(session.id),
        package_id: pkg.id,
        shards: String(pkg.shards),
      },
      success_url: `${baseUrl}/${localePrefix}/shop?checkout=success`,
      cancel_url: `${baseUrl}/${localePrefix}/shop?checkout=cancelled`,
    });

    await createShardTransaction(
      session.id,
      checkoutSession.id,
      pkg.shards,
      pkg.priceEurCents,
    );

    return NextResponse.json({ success: true, url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json({ error: "checkoutFailed" }, { status: 500 });
  }
}
