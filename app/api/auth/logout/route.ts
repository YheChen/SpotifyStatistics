import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();

  // Clear tokens
  cookieStore.set("spotify_access_token", "", {
    path: "/",
    maxAge: 0,
  });

  cookieStore.set("spotify_refresh_token", "", {
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ success: true });
}
