import { getAuthUrl } from "@/lib/spotify";
import { redirect } from "next/navigation";

export async function GET() {
  const authUrl = getAuthUrl();
  return redirect(authUrl);
}
