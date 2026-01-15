import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getSessionUser } from "@/lib/auth";

type LoadAction = "start_washer" | "start_dryer" | "mark_done";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    action?: LoadAction;
  };

  if (!body.action) {
    return NextResponse.json({ error: "Acción requerida." }, { status: 400 });
  }

  const { data: load, error } = await supabaseServer
    .from("loads")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", session.userId)
    .maybeSingle();

  if (error || !load) {
    return NextResponse.json({ error: "Carga no encontrada." }, { status: 404 });
  }

  const updates: Record<string, string> = {};

  if (body.action === "start_washer" && load.status === "waiting") {
    updates.washer_started_at = new Date().toISOString();
    updates.status = "washing";
  }

  if (body.action === "start_dryer" && load.status === "washing") {
    updates.dryer_started_at = new Date().toISOString();
    updates.status = "drying";
  }

  if (body.action === "mark_done" && load.status === "drying") {
    updates.status = "done";
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json(
      { error: "Acción no permitida para el estado actual." },
      { status: 400 }
    );
  }

  const { data: updated, error: updateError } = await supabaseServer
    .from("loads")
    .update(updates)
    .eq("id", params.id)
    .eq("user_id", session.userId)
    .select("*")
    .single();

  if (updateError || !updated) {
    return NextResponse.json(
      { error: "No se pudo actualizar la carga." },
      { status: 500 }
    );
  }

  return NextResponse.json({ load: updated });
}
