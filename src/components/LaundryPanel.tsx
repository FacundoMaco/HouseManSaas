"use client";

import { useEffect, useState } from "react";
import type { Machine } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

const WASHER_LOAD_TYPES = ["Towels", "Pillowcases", "Bathroom Mats"] as const;

type LaundryPanelProps = {
  machines: Machine[];
  isRunner?: boolean;
  onStartTimer?: (machineId: string, minutes: number, loadType?: string) => void;
  onMarkDone?: (machineId: string) => void;
};

function formatTimeRemaining(endsAt: string | null): string {
  if (!endsAt) return "--:--";
  const now = new Date();
  const end = new Date(endsAt);
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return "00:00";
  
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function getStatusBadge(status: Machine["status"]) {
  switch (status) {
    case "idle":
      return <Badge tone="neutral">Idle</Badge>;
    case "running":
      return <Badge tone="warning">Running</Badge>;
    case "done":
      return <Badge tone="success">Done</Badge>;
  }
}

export function LaundryPanel({ machines, isRunner = false, onStartTimer, onMarkDone }: LaundryPanelProps) {
  const [, setTick] = useState(0);
  const [selectedLoadTypes, setSelectedLoadTypes] = useState<Record<string, string>>({});
  const doneMachines = machines.filter((m) => m.status === "done");

  // Update every second for countdown
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLoadTypeChange = (machineId: string, loadType: string) => {
    setSelectedLoadTypes((prev) => ({ ...prev, [machineId]: loadType }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Laundry Status</h2>
        <span className="text-xs text-zinc-500">{machines.length} machines</span>
      </div>

      {doneMachines.length > 0 && (
        <Card className="border-amber-300 bg-amber-50 text-amber-800">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-semibold text-sm">Laundry Done!</p>
              <p className="text-xs">
                {doneMachines.map((m) => m.name).join(", ")} finished. Start the next load so it doesn&apos;t get forgotten.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {machines.map((machine) => {
          const isWasher = machine.type === "washer";
          const selectedLoadType = selectedLoadTypes[machine.id] || WASHER_LOAD_TYPES[0];

          return (
            <Card key={machine.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{machine.name}</p>
                  <p className="text-[10px] text-zinc-400 uppercase">{machine.type}</p>
                </div>
                {getStatusBadge(machine.status)}
              </div>

              {machine.status === "running" && (
                <div className="text-center">
                  <p className="text-3xl font-mono font-bold text-zinc-900">
                    {formatTimeRemaining(machine.ends_at)}
                  </p>
                  {isWasher && machine.load_type && (
                    <p className="text-sm font-medium text-zinc-700">{machine.load_type}</p>
                  )}
                  <p className="text-[10px] text-zinc-400">
                    Started by {machine.started_by_name || "Unknown"}
                  </p>
                </div>
              )}

              {machine.status === "idle" && (
                <p className="text-center text-sm text-zinc-400">Ready to use</p>
              )}

              {machine.status === "done" && (
                <p className="text-center text-sm text-emerald-600 font-medium">
                  Finished! Start next load.
                </p>
              )}

              {isRunner && onStartTimer && onMarkDone && (
                <div className="space-y-2">
                  {machine.status === "idle" && isWasher && (
                    <>
                      <Select
                        value={selectedLoadType}
                        onChange={(e) => handleLoadTypeChange(machine.id, e.target.value)}
                        className="text-sm"
                      >
                        {WASHER_LOAD_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </Select>
                      <Button
                        className="w-full"
                        onClick={() => onStartTimer(machine.id, 34, selectedLoadType)}
                      >
                        Start Load (34 min)
                      </Button>
                    </>
                  )}
                  {machine.status === "idle" && !isWasher && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="secondary"
                        className="text-xs"
                        onClick={() => onStartTimer(machine.id, 40)}
                      >
                        40m
                      </Button>
                      <Button
                        variant="secondary"
                        className="text-xs"
                        onClick={() => onStartTimer(machine.id, 44)}
                      >
                        44m
                      </Button>
                      <Button
                        variant="secondary"
                        className="text-xs"
                        onClick={() => onStartTimer(machine.id, 48)}
                      >
                        48m
                      </Button>
                      <Button
                        className="text-xs"
                        onClick={() => onStartTimer(machine.id, 52)}
                      >
                        52m
                      </Button>
                    </div>
                  )}
                  {(machine.status === "running" || machine.status === "done") && (
                    <Button
                      variant="ghost"
                      className="w-full text-xs"
                      onClick={() => onMarkDone(machine.id)}
                    >
                      {machine.status === "done" ? "Clear" : "Stop & Clear"}
                    </Button>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
