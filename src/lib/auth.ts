import { cookies } from "next/headers";
import type { SessionPayload } from "@/lib/session";
import { verifySessionToken } from "@/lib/session";

export async function getSessionUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("hm_session")?.value;
  return verifySessionToken(token);
}
