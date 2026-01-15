import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    completed?: boolean;
  };

  if (typeof body.completed !== "boolean") {
    return NextResponse.json(
      { error: "El estado de la tarea es requerido." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("tasks")
    .update({ completed: body.completed })
    .eq("id", params.id)
    .eq("user_id", session.userId)
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "No se pudo actualizar la tarea." },
      { status: 500 }
    );
  }

  return NextResponse.json({ task: data });
}
