"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Load, Task } from "@/lib/types";
import { getLoads, updateLoad, getTasks, updateTask, getAvailableDryer } from "@/lib/storage";
import { logout, getCurrentUsername } from "@/lib/auth-simple";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Timer } from "@/components/Timer";

type DashboardClientProps = {};

type LoadAction = "start_washer" | "start_dryer" | "mark_done";

const STATUS_LABELS: Record<Load["status"], string> = {
  waiting: "En espera",
  washing: "Lavando",
  drying: "Secando",
  done: "Finalizado",
};

const LOAD_TYPE_LABELS: Record<Load["type"], string> = {
  towels: "5 Toallas",
  pillowcases_towels: "Pillowcases + Toallas",
  towels_feet: "Toallas + Toallas pies",
};

export function DashboardClient({}: DashboardClientProps) {
  const router = useRouter();
  const [loads, setLoads] = useState<Load[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());
  const username = getCurrentUsername() || "Usuario";

  useEffect(() => {
    setLoads(getLoads());
    setTasks(getTasks());
    const timer = setInterval(() => {
      setNow(Date.now());
      setLoads(getLoads());
      setTasks(getTasks());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const progress = useMemo(() => {
    if (!tasks.length) return 0;
    const completed = tasks.filter((task) => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  const handleLogout = () => {
    logout();
    router.push("/login");
    router.refresh();
  };

  const handleLoadAction = (loadId: string, action: LoadAction) => {
    setError("");
    const load = loads.find((l) => l.id === loadId);
    if (!load) {
      setError("Carga no encontrada.");
      return;
    }

    let updates: Partial<Load> = {};
    if (action === "start_washer" && load.status === "waiting") {
      // Verificar que la lavadora no esté ocupada
      const washingLoad = loads.find((l) => l.status === "washing");
      if (washingLoad) {
        setError("La lavadora ya está en uso. Espera a que termine.");
        return;
      }
      updates = {
        washer_started_at: new Date().toISOString(),
        status: "washing",
      };
    } else if (action === "start_dryer" && load.status === "washing") {
      // Asignar secadora disponible
      const availableDryer = getAvailableDryer();
      const dryingLoads = loads.filter((l) => l.status === "drying" && l.dryer_number !== null);
      const usedDryers = new Set(dryingLoads.map((l) => l.dryer_number));
      
      if (usedDryers.has(1) && usedDryers.has(2)) {
        setError("Ambas secadoras están ocupadas. Espera a que una termine.");
        return;
      }
      
      updates = {
        dryer_started_at: new Date().toISOString(),
        dryer_number: availableDryer,
        status: "drying",
      };
    } else if (action === "mark_done" && load.status === "drying") {
      updates = {
        status: "done",
      };
    } else {
      setError("Acción no permitida para el estado actual.");
      return;
    }

    const updated = updateLoad(loadId, updates);
    if (updated) {
      setLoads(getLoads());
    } else {
      setError("No se pudo actualizar la carga.");
    }
  };

  const handleTaskToggle = (task: Task) => {
    setError("");
    const updated = updateTask(task.id, { completed: !task.completed });
    if (updated) {
      setTasks(getTasks());
    } else {
      setError("No se pudo actualizar la tarea.");
    }
  };

  const isReady = (load: Load): boolean => {
    if (load.status === "waiting") return true;
    const startedAt =
      load.status === "washing" ? load.washer_started_at : load.dryer_started_at;
    const duration =
      load.status === "washing" ? load.washer_duration : load.dryer_duration;
    if (!startedAt) return true;

    const endTime = new Date(startedAt).getTime() + duration * 60 * 1000;
    return now >= endTime;
  };

  const getAction = (load: Load) => {
    if (load.status === "waiting") {
      return { label: "Iniciar lavadora", action: "start_washer" as const };
    }
    if (load.status === "washing") {
      return { label: "Iniciar secadora", action: "start_dryer" as const };
    }
    if (load.status === "drying") {
      return { label: "Marcar finalizado", action: "mark_done" as const };
    }
    return null;
  };

  const activeLoads = loads.filter((load) => load.status !== "done");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            HouseMen
          </p>
          <h1 className="text-xl font-semibold text-zinc-900">
            Hola, {username}
          </h1>
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          Salir
        </Button>
      </header>

      {error ? (
        <Card className="border-red-200 bg-red-50 text-sm text-red-700">
          {error}
        </Card>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Laundry Loads</h2>
          <Link href="/new-load">
            <Button>+ New Load</Button>
          </Link>
        </div>

        {activeLoads.length ? (
          <div className="space-y-3">
            {activeLoads.map((load) => {
              const action = getAction(load);
              const ready = isReady(load);
              const tone =
                load.status === "done"
                  ? "success"
                  : load.status === "waiting"
                  ? "warning"
                  : "neutral";

              const startedAt =
                load.status === "washing" ? load.washer_started_at : load.dryer_started_at;
              const duration =
                load.status === "washing" ? load.washer_duration : load.dryer_duration;

              return (
                <Card key={load.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-zinc-900">
                        {LOAD_TYPE_LABELS[load.type]}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {load.status === "drying" && load.dryer_number
                          ? `Secadora ${load.dryer_number} · `
                          : ""}
                        {load.notes ?? "Sin notas"}
                      </p>
                    </div>
                    <Badge tone={tone}>{STATUS_LABELS[load.status]}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">
                        {load.status === "washing" ? "Lavadora:" : "Secadora:"}
                      </span>
                      <Timer
                        startedAt={startedAt}
                        durationMinutes={duration}
                        currentTime={now}
                      />
                    </div>
                    {action ? (
                      <Button
                        variant="secondary"
                        onClick={() => handleLoadAction(load.id, action.action)}
                        disabled={!ready}
                      >
                        {action.label}
                      </Button>
                    ) : null}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <p className="text-sm text-zinc-500">
              No hay cargas activas. Crea una nueva carga para comenzar.
            </p>
          </Card>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Checklist</h2>
            <p className="text-sm text-zinc-500">
              Progreso: {progress}%
            </p>
          </div>
        </div>
        <Card className="space-y-4">
          <Progress value={progress} />
          <div className="space-y-3">
            {tasks.length ? (
              tasks.map((task) => (
                <label
                  key={task.id}
                  className="flex items-center justify-between gap-3 text-sm text-zinc-700"
                >
                  <span className={task.completed ? "line-through" : ""}>
                    {task.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleTaskToggle(task)}
                    className="h-5 w-5 accent-zinc-900"
                  />
                </label>
              ))
            ) : (
              <p className="text-sm text-zinc-500">
                Sin tareas configuradas todavía.
              </p>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
