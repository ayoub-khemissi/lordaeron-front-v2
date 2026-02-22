import crypto from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { findAccountById, updateAccountPassword } from "@/lib/queries/account";
import {
  findValidResetToken,
  markTokenAsUsed,
} from "@/lib/queries/password-reset";
import { generateSalt, calculateVerifier } from "@/lib/srp6";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "invalidToken" }, { status: 400 });
    }

    if (!password || password.length < 6 || password.length > 16) {
      return NextResponse.json({ error: "passwordLength" }, { status: 400 });
    }

    // Hash the raw token to look it up
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const resetToken = await findValidResetToken(tokenHash);

    if (!resetToken) {
      return NextResponse.json(
        { error: "invalidOrExpiredToken" },
        { status: 400 },
      );
    }

    const account = await findAccountById(resetToken.account_id);

    if (!account) {
      return NextResponse.json(
        { error: "invalidOrExpiredToken" },
        { status: 400 },
      );
    }

    // Generate new SRP6 salt + verifier
    const salt = generateSalt();
    const verifier = calculateVerifier(account.username, password, salt);

    await updateAccountPassword(account.id, salt, verifier);
    await markTokenAsUsed(resetToken.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
