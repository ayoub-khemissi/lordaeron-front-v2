import { NextResponse } from "next/server";

import { verifySession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: session });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
