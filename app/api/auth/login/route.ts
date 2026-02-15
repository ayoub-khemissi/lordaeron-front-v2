import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { verifyLogin } from "@/lib/srp6";
import { createSession, getSessionCookieOptions } from "@/lib/auth";
import { findAccountByUsername } from "@/lib/queries/account";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "usernameRequired" },
        { status: 400 },
      );
    }
    if (!password) {
      return NextResponse.json(
        { error: "passwordRequired" },
        { status: 400 },
      );
    }

    const account = await findAccountByUsername(username);
    if (!account) {
      return NextResponse.json(
        { error: "invalidCredentials" },
        { status: 401 },
      );
    }

    const valid = verifyLogin(
      username,
      password,
      account.salt,
      account.verifier,
    );
    if (!valid) {
      return NextResponse.json(
        { error: "invalidCredentials" },
        { status: 401 },
      );
    }

    const token = await createSession({
      id: account.id,
      username: account.username,
    });

    const cookieStore = await cookies();
    const cookieOptions = getSessionCookieOptions(token);
    cookieStore.set(cookieOptions);

    return NextResponse.json({
      success: true,
      user: {
        id: account.id,
        username: account.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "serverError" }, { status: 500 });
  }
}
