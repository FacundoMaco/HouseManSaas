import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseServer } from "@/lib/supabaseServer";
import { createSessionToken } from "@/lib/session";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };

  if (!body.username || !body.password) {
    return NextResponse.json(
      { error: "Usuario y contraseña son requeridos." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("users")
    .select("id, username, password")
    .eq("username", body.username)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { error: "Credenciales inválidas." },
      { status: 401 }
    );
  }

  const matches = await bcrypt.compare(body.password, data.password);
  if (!matches) {
    return NextResponse.json(
      { error: "Credenciales inválidas." },
      { status: 401 }
    );
  }

  const token = createSessionToken({
    userId: data.id,
    username: data.username,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set("hm_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
