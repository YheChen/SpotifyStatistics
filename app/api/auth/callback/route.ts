import { getAccessToken } from "@/lib/spotify";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    return redirect("/?error=auth_failed");
  }

  try {
    const tokens = await getAccessToken(code);

    const response = NextResponse.redirect(new URL("/dashboard", request.url));

    response.cookies.set("spotify_access_token", tokens.access_token, {
      path: "/",
      maxAge: tokens.expires_in,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    if (tokens.refresh_token) {
      response.cookies.set("spotify_refresh_token", tokens.refresh_token, {
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    return response;
  } catch (e) {
    console.error("Error during callback:", e);
    return redirect("/?error=auth_failed");
  }
}
