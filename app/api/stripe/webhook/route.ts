import { NextRequest, NextResponse } from "next/server";

import { getStripe } from "@/lib/stripe";
import {
  completeShardTransaction,
  expireTransaction,
} from "@/lib/queries/shard-transactions";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "missingSignature" }, { status: 400 });
  }

  let event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);

    return NextResponse.json({ error: "invalidSignature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        await completeShardTransaction(
          session.id,
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : (session.payment_intent?.id ?? null),
        );
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object;

        await expireTransaction(session.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);

    return NextResponse.json({ error: "webhookError" }, { status: 500 });
  }
}
