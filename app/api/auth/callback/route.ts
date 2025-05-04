import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/lib/spotify";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/?error=auth_failed", req.url));
  }

  try {
    const tokens = await getAccessToken(code);

    const res = NextResponse.redirect(new URL("/dashboard", req.url));

    // ✅ Set access token cookie (1 hour)
    res.cookies.set("spotify_access_token", tokens.access_token, {
      path: "/",
      maxAge: tokens.expires_in,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // ✅ Set refresh token cookie (30 days)
    if (tokens.refresh_token) {
      res.cookies.set("spotify_refresh_token", tokens.refresh_token, {
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    return res;
  } catch (e) {
    console.error("Auth error:", e);
    return NextResponse.redirect(new URL("/?error=auth_failed", req.url));
  }
}
