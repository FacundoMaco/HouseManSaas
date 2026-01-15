import crypto from "crypto";

export type SessionPayload = {
  userId: string;
  username: string;
  exp: number;
};

const secret = process.env.SESSION_SECRET;

if (!secret) {
  throw new Error("Falta la variable SESSION_SECRET.");
}

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString();
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

export function createSessionToken(payload: Omit<SessionPayload, "exp">) {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 7;
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify({ ...payload, exp }));
  const signature = sign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

export function verifySessionToken(token?: string | null): SessionPayload | null {
  if (!token) return null;
  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) return null;
  const expected = sign(`${header}.${body}`);
  if (signature !== expected) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(body)) as SessionPayload;
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
