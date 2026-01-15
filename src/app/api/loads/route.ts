import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getSessionUser } from "@/lib/auth";

const VALID_TYPES = ["towels", "sheets", "mixed"] as const;

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    type?: string;
    weight_lbs?: number;
    notes?: string | null;
  };

  if (!body.type || !VALID_TYPES.includes(body.type as typeof VALID_TYPES[number])) {
    return NextResponse.json({ error: "Tipo inválido." }, { status: 400 });
  }

  const weight = Number(body.weight_lbs);
  if (!weight || weight <= 0) {
    return NextResponse.json({ error: "Peso inválido." }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from("loads")
    .insert({
      user_id: session.userId,
      type: body.type,
      weight_lbs: weight,
      notes: body.notes ?? null,
      washer_started_at: new Date().toISOString(),
      status: "washing",
    })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "No se pudo crear la carga." },
      { status: 500 }
    );
  }

  return NextResponse.json({ load: data });
}
