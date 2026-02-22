import { NextRequest, NextResponse } from "next/server";

import { verifySession } from "@/lib/auth";
import {
  findAccountByUsername,
  updateAccountPassword,
} from "@/lib/queries/account";
import { verifyLogin, generateSalt, calculateVerifier } from "@/lib/srp6";

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword) {
      return NextResponse.json(
        { error: "currentPasswordRequired" },
        { status: 400 },
      );
    }

    if (!newPassword || newPassword.length < 6 || newPassword.length > 16) {
      return NextResponse.json({ error: "passwordLength" }, { status: 400 });
    }

    const account = await findAccountByUsername(session.username);

    if (!account) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Verify current password using SRP6 timing-safe comparison
    const valid = verifyLogin(
      session.username,
      currentPassword,
      account.salt,
      account.verifier,
    );

    if (!valid) {
      return NextResponse.json(
        { error: "invalidCurrentPassword" },
        { status: 400 },
      );
    }

    // Generate new SRP6 salt + verifier
    const salt = generateSalt();
    const verifier = calculateVerifier(session.username, newPassword, salt);

    await updateAccountPassword(account.id, salt, verifier);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);

    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
