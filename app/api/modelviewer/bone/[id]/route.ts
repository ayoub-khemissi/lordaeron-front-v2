import { NextResponse } from "next/server";

/** Return an empty but valid bone file (4-byte header, no chunks) */
const EMPTY_BONE = new Uint8Array(4);

export async function GET() {
  return new NextResponse(EMPTY_BONE, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
