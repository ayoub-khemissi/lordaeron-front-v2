import { NextRequest, NextResponse } from "next/server";

import { generateSalt, calculateVerifier } from "@/lib/srp6";
import { findAccountByUsername, createAccount } from "@/lib/queries/account";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // Validation
    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "usernameRequired" },
        { status: 400 },
      );
    }
    if (username.length < 3 || username.length > 16) {
      return NextResponse.json({ error: "usernameLength" }, { status: 400 });
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return NextResponse.json(
        { error: "usernameAlphanumeric" },
        { status: 400 },
      );
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "emailInvalid" }, { status: 400 });
    }
    if (!password || password.length < 6 || password.length > 16) {
      return NextResponse.json({ error: "passwordLength" }, { status: 400 });
    }

    // Check if username exists
    const existing = await findAccountByUsername(username);
    if (existing) {
      return NextResponse.json({ error: "usernameTaken" }, { status: 409 });
    }

    // Generate SRP6 salt and verifier
    const salt = generateSalt();
    const verifier = calculateVerifier(username, password, salt);

    // Create account
    const accountId = await createAccount(username, email, salt, verifier);

    return NextResponse.json(
      { success: true, accountId },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
