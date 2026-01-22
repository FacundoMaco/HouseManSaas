"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";
import type { Machine, Profile, Task, TaskStatus } from "@/lib/types";
import { TaskCard } from "@/components/TaskCard";
import { LaundryPanel } from "@/components/LaundryPanel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function RunnerPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [error, setError] = useState("");
  const supabase = supabaseBrowser();

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      setProfile((profileData as Profile) || null);
    };

    init();
  }, [router, supabase]);

  // Polling for tasks assigned to the current runner
  useEffect(() => {
    const fetchTasks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("assigned_to", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      setTasks((data as Task[]) || []);
    };

    fetchTasks();
    const interval = setInterval(fetchTasks, 3000);
    return () => clearInterval(interval);
  }, [supabase]);

  // Polling for machines
  useEffect(() => {
    const fetchMachines = async () => {
      const { data } = await supabase
        .from("machines")
        .select("*")
        .order("name", { ascending: true });

      if (data) {
        // Check for machines that have passed their end time
        const now = new Date();
        const updated = (data as Machine[]).map((m) => {
          if (m.status === "running" && m.ends_at && new Date(m.ends_at) <= now) {
            return { ...m, status: "done" as const };
          }
          return m;
        });
        setMachines(updated);
      }
    };

    fetchMachines();
    const interval = setInterval(fetchMachines, 3000);
    return () => clearInterval(interval);
  }, [supabase]);

  const updateTaskStatus = async (task: Task, status: TaskStatus) => {
    setError("");
    const { error: updateError } = await supabase
      .from("tasks")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", task.id)
      .eq("assigned_to", task.assigned_to);

    if (updateError) {
      setError(updateError.message);
    }
  };

  const handleStartTimer = async (machineId: string, minutes: number, loadType?: string) => {
    setError("");
    const endsAt = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    
    const { error: updateError } = await supabase
      .from("machines")
      .update({
        status: "running",
        ends_at: endsAt,
        started_by: profile?.id,
        started_by_name: profile?.full_name || "Runner",
        load_type: loadType || null,
      })
      .eq("id", machineId);

    if (updateError) {
      setError(updateError.message);
    }
  };

  const handleMarkDone = async (machineId: string) => {
    setError("");
    const { error: updateError } = await supabase
      .from("machines")
      .update({
        status: "idle",
        ends_at: null,
        started_by: null,
        started_by_name: null,
        load_type: null,
      })
      .eq("id", machineId);

    if (updateError) {
      setError(updateError.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const pendingTasks = tasks.filter((t) => t.status !== "done");
  const doneTasks = tasks.filter((t) => t.status === "done");

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Runner
          </p>
          <h1 className="text-2xl font-semibold text-zinc-900">My Inbox</h1>
          <p className="text-sm text-zinc-500">
            Tasks assigned to you.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-500">
            {profile?.full_name || "Runner"}
          </span>
          <Button variant="ghost" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </header>

      {error ? (
        <Card className="border-red-200 bg-red-50 text-sm text-red-700">
          {error}
        </Card>
      ) : null}

      {/* Laundry Controls (Runner can control) */}
      <LaundryPanel
        machines={machines}
        isRunner={true}
        onStartTimer={handleStartTimer}
        onMarkDone={handleMarkDone}
      />

      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Active Tasks ({pendingTasks.length})
        </h2>
        {pendingTasks.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {pendingTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                showActions={true}
                onStatusChange={(status) => updateTaskStatus(task, status)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-sm text-zinc-500">
              No active tasks.
            </p>
          </Card>
        )}
      </div>

      {doneTasks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Completed ({doneTasks.length})
          </h2>
          <div className="grid gap-3 md:grid-cols-2 opacity-60">
            {doneTasks.slice(0, 6).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
