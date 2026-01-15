import { supabaseServer } from "@/lib/supabaseServer";
import { getSessionUser } from "@/lib/auth";
import { DashboardClient } from "@/components/DashboardClient";
import type { Load, Task } from "@/lib/types";

export default async function DashboardPage() {
  const session = getSessionUser();
  if (!session) {
    return null;
  }

  const { data: loads } = await supabaseServer
    .from("loads")
    .select("*")
    .eq("user_id", session.userId)
    .order("created_at", { ascending: false });

  const { data: tasks } = await supabaseServer
    .from("tasks")
    .select("*")
    .eq("user_id", session.userId)
    .order("created_at", { ascending: true });

  return (
    <DashboardClient
      initialLoads={(loads ?? []) as Load[]}
      initialTasks={(tasks ?? []) as Task[]}
      username={session.username}
    />
  );
}
