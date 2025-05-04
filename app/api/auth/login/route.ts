import { redirect } from "next/navigation"
import { getAuthUrl } from "@/lib/spotify"

export async function GET() {
  const authUrl = getAuthUrl()
  return redirect(authUrl)
}
