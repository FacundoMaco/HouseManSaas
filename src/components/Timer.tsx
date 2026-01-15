"use client";

import { useMemo } from "react";

type TimerProps = {
  startedAt: string | null;
  durationMinutes: number;
  currentTime: number;
};

export function Timer({ startedAt, durationMinutes, currentTime }: TimerProps) {
  const progress = useMemo(() => {
    if (!startedAt) return 0;
    const startTime = new Date(startedAt).getTime();
    const endTime = startTime + durationMinutes * 60 * 1000;
    const elapsed = currentTime - startTime;
    const total = endTime - startTime;
    
    if (elapsed >= total) return 100;
    return Math.max(0, Math.min(100, (elapsed / total) * 100));
  }, [startedAt, durationMinutes, currentTime]);

  const remaining = useMemo(() => {
    if (!startedAt) return null;
    const startTime = new Date(startedAt).getTime();
    const endTime = startTime + durationMinutes * 60 * 1000;
    const remainingMs = endTime - currentTime;
    
    if (remainingMs <= 0) return { minutes: 0, seconds: 0, ready: true };
    
    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);
    return { minutes, seconds, ready: false };
  }, [startedAt, durationMinutes, currentTime]);

  if (!startedAt || !remaining) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-2 w-24 rounded-full bg-zinc-200" />
        <span className="text-sm text-zinc-500">Sin iniciar</span>
      </div>
    );
  }

  if (remaining.ready) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-2 w-24 rounded-full bg-green-500" />
        <span className="text-sm font-semibold text-green-700">Listo</span>
      </div>
    );
  }

  const displayTime = `${remaining.minutes}:${remaining.seconds.toString().padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-3 w-32 overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full bg-zinc-900 transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="min-w-[3rem] text-sm font-mono font-semibold text-zinc-900">
        {displayTime}
      </span>
    </div>
  );
}
