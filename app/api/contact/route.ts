import { NextRequest, NextResponse } from "next/server";

import { verifySession } from "@/lib/auth";
import { findAccountById } from "@/lib/queries/account";
import { createContactMessage } from "@/lib/queries/contact";

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { subject, message } = await request.json();

    if (!subject || !subject.trim()) {
      return NextResponse.json({ error: "subjectRequired" }, { status: 400 });
    }
    if (subject.length > 255) {
      return NextResponse.json({ error: "subjectTooLong" }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "messageRequired" }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: "messageTooLong" }, { status: 400 });
    }

    const account = await findAccountById(session.id);

    if (!account) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    await createContactMessage(
      account.id,
      account.username,
      account.email,
      subject.trim(),
      message.trim(),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);

    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
