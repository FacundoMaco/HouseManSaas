"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";
import type { Machine, Profile, Task, TaskPriority, TaskType } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TaskCard } from "@/components/TaskCard";
import { QuickTaskGrid } from "@/components/QuickTaskGrid";
import { RunnerSelector } from "@/components/RunnerSelector";
import { FrontDeskIdentitySelector } from "@/components/FrontDeskIdentitySelector";
import { LaundryPanel } from "@/components/LaundryPanel";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "urgent", label: "Urgent" },
];

const STORAGE_KEY = "frontdesk_identity";

export default function FrontdeskPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [frontDeskName, setFrontDeskName] = useState<string | null>(null);
  const [runners, setRunners] = useState<Profile[]>([]);
  const [selectedRunnerId, setSelectedRunnerId] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [room, setRoom] = useState("");
  const [customRoom, setCustomRoom] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [customPriority, setCustomPriority] = useState<TaskPriority>("normal");
  const [sendingType, setSendingType] = useState<TaskType | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const supabase = supabaseBrowser();

  const currentRunner = useMemo(
    () => runners.find((runner) => runner.id === selectedRunnerId) || null,
    [runners, selectedRunnerId]
  );

  // Load identity from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFrontDeskName(stored);
    }
  }, []);

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

      const { data: runnerData } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "runner")
        .order("on_shift", { ascending: false })
        .order("full_name", { ascending: true });

      const runnerList = (runnerData as Profile[]) || [];
      setRunners(runnerList);

      const defaultRunner = runnerList.find(r => r.on_shift) || runnerList[0];
      setSelectedRunnerId(defaultRunner?.id || "");
    };

    init();
  }, [router, supabase]);

  // Polling for tasks
  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(25);

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

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 1600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleIdentitySelect = (name: string) => {
    localStorage.setItem(STORAGE_KEY, name);
    setFrontDeskName(name);
  };

  const sendTask = async (type: TaskType, payload?: { room?: string; note?: string }) => {
    setError("");
    if (!selectedRunnerId || !profile) {
      setError("Please select a runner.");
      return;
    }
    setSendingType(type);

    const { error: insertError } = await supabase.from("tasks").insert({
      type,
      room: payload?.room?.trim() || null,
      note: payload?.note?.trim() || null,
      priority: type === "custom" ? customPriority : "normal",
      status: "pending",
      assigned_to: selectedRunnerId,
      created_by: profile.id,
      created_by_name: frontDeskName || profile.full_name,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setToast("Sent ✓");
      setRoom("");
      setCustomRoom("");
      setCustomNote("");
      setCustomPriority("normal");
      setCustomOpen(false);
    }
    setSendingType(null);
  };

  const handleQuickSend = async (type: TaskType) => {
    await sendTask(type, { room });
  };

  const handleCustomSend = async () => {
    await sendTask("custom", { room: customRoom, note: customNote });
  };

  const handleSignOut = async () => {
    localStorage.removeItem(STORAGE_KEY);
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Show identity selector if not selected
  if (!frontDeskName) {
    return <FrontDeskIdentitySelector onSelect={handleIdentitySelect} />;
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Front Desk
          </p>
          <h1 className="text-2xl font-semibold text-zinc-900">Task Dispatch</h1>
          <p className="text-sm text-zinc-500">
            Assign tasks to runners quickly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-500">
            {frontDeskName}
          </span>
          <Button variant="ghost" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </header>

      {toast ? (
        <div className="pointer-events-none fixed right-6 top-6 z-50 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all">
          {toast}
        </div>
      ) : null}

      {error ? (
        <Card className="border-red-200 bg-red-50 text-sm text-red-700">
          {error}
        </Card>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <QuickTaskGrid
          room={room}
          onRoomChange={setRoom}
          onSend={handleQuickSend}
          sendingType={sendingType}
        />

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Assign Runner</h2>
              <p className="text-xs text-zinc-500">
                {currentRunner?.on_shift ? "On Shift" : "Off Shift"} · {currentRunner?.full_name || "Select a runner"}
              </p>
            </div>
            <Button variant="secondary" onClick={() => setCustomOpen(true)}>
              Custom Task
            </Button>
          </div>
          <RunnerSelector
            runners={runners}
            selectedRunnerId={selectedRunnerId}
            onChange={setSelectedRunnerId}
          />
        </Card>
      </section>

      {/* Laundry Status (Read-only for Front Desk) */}
      <LaundryPanel machines={machines} isRunner={false} />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Live Tasks</h2>
          <span className="text-xs text-zinc-500">Last 25 tasks</span>
        </div>
        {tasks.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-sm text-zinc-500">
              No tasks yet.
            </p>
          </Card>
        )}
      </section>

      {customOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setCustomOpen(false)}
          />
          <Card className="relative z-50 w-full max-w-lg space-y-4 shadow-xl">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">Custom Task</h3>
              <p className="text-sm text-zinc-500">
                Add a note or special request for the runner.
              </p>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Room (optional)</label>
                <Input
                  value={customRoom}
                  onChange={(event) => setCustomRoom(event.target.value)}
                  placeholder="214"
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Priority</label>
                <Select
                  value={customPriority}
                  onChange={(event) => setCustomPriority(event.target.value as TaskPriority)}
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Note</label>
                <Input
                  value={customNote}
                  onChange={(event) => setCustomNote(event.target.value)}
                  placeholder="Example: Extra pillows for VIP arrival"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={() => setCustomOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCustomSend}
                disabled={sendingType === "custom"}
              >
                {sendingType === "custom" ? "Sending..." : "Send Task"}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
