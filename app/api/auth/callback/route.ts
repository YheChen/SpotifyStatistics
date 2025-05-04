import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getAccessToken } from "@/lib/spotify"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error || !code) {
    return redirect("/?error=auth_failed")
  }

  try {
    const tokenResponse = await getAccessToken(code)

    // Set cookies with the tokens
    const cookieStore = cookies()

    // Set access token cookie (expires in 1 hour)
    cookieStore.set("spotify_access_token", tokenResponse.access_token, {
      maxAge: tokenResponse.expires_in,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    // Set refresh token cookie (if available)
    if (tokenResponse.refresh_token) {
      cookieStore.set("spotify_refresh_token", tokenResponse.refresh_token, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
    }

    // Redirect to dashboard
    return redirect("/dashboard")
  } catch (error) {
    console.error("Error during authentication:", error)
    return redirect("/?error=auth_failed")
  }
}
