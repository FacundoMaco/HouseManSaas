import { cookies } from "next/headers";
import type { SessionPayload } from "@/lib/session";
import { verifySessionToken } from "@/lib/session";

export function getSessionUser(): SessionPayload | null {
  const token = cookies().get("hm_session")?.value;
  return verifySessionToken(token);
}
