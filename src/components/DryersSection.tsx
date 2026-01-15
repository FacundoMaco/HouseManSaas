"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Timer } from "@/components/Timer";
import { getLoads, getDryerDuration } from "@/lib/storage";
import type { Load } from "@/lib/types";

type DryersSectionProps = {
  currentTime: number;
  onUpdate: () => void;
};

const DRYER_DURATIONS = [40, 44, 48, 52] as const;

export function DryersSection({ currentTime, onUpdate }: DryersSectionProps) {
  const loads = getLoads();
  const dryingLoads = loads.filter((l) => l.status === "drying" && l.dryer_number !== null);

  const dryer1Load = dryingLoads.find((l) => l.dryer_number === 1);
  const dryer2Load = dryingLoads.find((l) => l.dryer_number === 2);

  const setDryerDuration = (dryerNumber: 1 | 2, duration: number) => {
    const key = `dryer_${dryerNumber}_duration`;
    if (typeof window === "undefined") return;
    localStorage.setItem(key, duration.toString());
    onUpdate();
  };

  const increaseDuration = (dryerNumber: 1 | 2) => {
    const current = getDryerDuration(dryerNumber);
    const currentIndex = DRYER_DURATIONS.indexOf(current as typeof DRYER_DURATIONS[number]);
    if (currentIndex < DRYER_DURATIONS.length - 1) {
      const newDuration = DRYER_DURATIONS[currentIndex + 1];
      setDryerDuration(dryerNumber, newDuration);
    }
  };

  const decreaseDuration = (dryerNumber: 1 | 2) => {
    const current = getDryerDuration(dryerNumber);
    const currentIndex = DRYER_DURATIONS.indexOf(current as typeof DRYER_DURATIONS[number]);
    if (currentIndex > 0) {
      const newDuration = DRYER_DURATIONS[currentIndex - 1];
      setDryerDuration(dryerNumber, newDuration);
    }
  };

  const renderDryer = (dryerNumber: 1 | 2, load: Load | undefined) => {
    const duration = getDryerDuration(dryerNumber);
    const isInUse = !!load;

    return (
      <Card key={dryerNumber} className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">Secadora {dryerNumber}</h3>
          {isInUse ? (
            <span className="text-xs font-medium text-zinc-600">En uso</span>
          ) : (
            <span className="text-xs font-medium text-green-600">Free</span>
          )}
        </div>

        {isInUse ? (
          <div className="space-y-2">
            <Timer
              startedAt={load.dryer_started_at}
              durationMinutes={load.dryer_duration}
              currentTime={currentTime}
            />
            <p className="text-xs text-zinc-500">
              {load.type === "towels"
                ? "5 Toallas"
                : load.type === "pillowcases_towels"
                ? "Pillowcases + Toallas"
                : "Toallas + Toallas pies"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 rounded-full bg-zinc-200" />
              <span className="text-sm font-semibold text-zinc-400">Empty</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Tiempo:</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  className="h-6 w-6 p-0 text-xs"
                  onClick={() => decreaseDuration(dryerNumber)}
                  disabled={duration === DRYER_DURATIONS[0]}
                >
                  −
                </Button>
                <span className="min-w-[2rem] text-center text-sm font-semibold text-zinc-900">
                  {duration} min
                </span>
                <Button
                  variant="ghost"
                  className="h-6 w-6 p-0 text-xs"
                  onClick={() => increaseDuration(dryerNumber)}
                  disabled={duration === DRYER_DURATIONS[DRYER_DURATIONS.length - 1]}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Secadoras</h2>
        <p className="text-xs text-zinc-500">Control de tiempo y estado</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {renderDryer(1, dryer1Load)}
        {renderDryer(2, dryer2Load)}
      </div>
    </section>
  );
}
