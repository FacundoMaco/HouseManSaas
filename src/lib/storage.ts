"use client";

import type { Load, Task } from "./types";

const STORAGE_KEYS = {
  LOADS: "housemen_loads",
  TASKS: "housemen_tasks",
  USERNAME: "housemen_username",
} as const;

// Loads
export function getLoads(): Load[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.LOADS);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as Load[];
  } catch {
    return [];
  }
}

export function saveLoads(loads: Load[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.LOADS, JSON.stringify(loads));
}

export function createLoad(load: Omit<Load, "id" | "created_at">): Load {
  const loads = getLoads();
  const newLoad: Load = {
    ...load,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  loads.unshift(newLoad);
  saveLoads(loads);
  return newLoad;
}

export function updateLoad(id: string, updates: Partial<Load>): Load | null {
  const loads = getLoads();
  const index = loads.findIndex((l) => l.id === id);
  if (index === -1) return null;
  loads[index] = { ...loads[index], ...updates };
  saveLoads(loads);
  return loads[index];
}

// Obtener qué secadora está disponible (1 o 2)
export function getAvailableDryer(): 1 | 2 {
  const loads = getLoads();
  const dryingLoads = loads.filter(
    (l) => l.status === "drying" && l.dryer_number !== null
  );
  const usedDryers = new Set(dryingLoads.map((l) => l.dryer_number));
  
  if (!usedDryers.has(1)) return 1;
  if (!usedDryers.has(2)) return 2;
  // Si ambas están ocupadas, retornar 1 por defecto (el usuario decidirá)
  return 1;
}

// Tasks
export function getTasks(): Task[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
  if (!stored) {
    // Crear tareas iniciales si no existen
    const initialTasks: Task[] = [
      { id: crypto.randomUUID(), label: "Revisar habitaciones", completed: false, created_at: new Date().toISOString() },
      { id: crypto.randomUUID(), label: "Reabastecer amenities", completed: false, created_at: new Date().toISOString() },
      { id: crypto.randomUUID(), label: "Limpiar áreas comunes", completed: false, created_at: new Date().toISOString() },
    ];
    saveTasks(initialTasks);
    return initialTasks;
  }
  try {
    return JSON.parse(stored) as Task[];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  tasks[index] = { ...tasks[index], ...updates };
  saveTasks(tasks);
  return tasks[index];
}

// Username
export function getUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.USERNAME);
}

export function setUsername(username: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.USERNAME, username);
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.USERNAME);
}
