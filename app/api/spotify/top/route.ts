import { cookies } from "next/headers";
import { getTopItems, refreshAccessToken } from "@/lib/spotify";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const limit = searchParams.get("limit");
  const time_range = searchParams.get("time_range");

  if (!type || !limit || !time_range) {
    return new Response(JSON.stringify({ error: "Missing query parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cookieStore = await cookies();
  let accessToken = cookieStore.get("spotify_access_token")?.value;
  const refreshToken = cookieStore.get("spotify_refresh_token")?.value;

  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Missing access token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const items = await getTopItems(
      type as "tracks" | "artists",
      {
        limit: parseInt(limit),
        time_range,
      },
      accessToken
    );

    return new Response(JSON.stringify(items), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    // If token expired, try refreshing
    if (err.message === "Unauthorized" && refreshToken) {
      try {
        const newTokens = await refreshAccessToken(refreshToken);

        // NOTE: You would normally set cookies here again using a custom cookie utility or redirect to re-initiate login.
        const items = await getTopItems(
          type as "tracks" | "artists",
          {
            limit: parseInt(limit),
            time_range,
          },
          newTokens.access_token
        );

        return new Response(JSON.stringify(items), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (refreshErr) {
        return new Response(JSON.stringify({ error: "Re-auth required" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
