"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLoad, getLoads } from "@/lib/storage";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import type { LoadType } from "@/lib/types";

const LOAD_TYPE_LABELS: Record<LoadType, string> = {
  towels: "5 Toallas",
  pillowcases_towels: "Pillowcases + Toallas mano/cara",
  towels_feet: "Toallas + Toallas pies (⚠️ puede no escurrir bien)",
};

export function NewLoadForm() {
  const router = useRouter();
  const [type, setType] = useState<LoadType>("towels");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    // Verificar que la lavadora no esté ocupada
    const loads = getLoads();
    const washingLoad = loads.find((l) => l.status === "washing");
    if (washingLoad) {
      setError("La lavadora ya está en uso. Espera a que termine.");
      setLoading(false);
      return;
    }

    try {
      createLoad({
        type,
        notes: notes.trim() || null,
        washer_started_at: new Date().toISOString(),
        washer_duration: 35,
        dryer_started_at: null,
        dryer_duration: 42, // 40-45 min default, usar 42
        dryer_number: null,
        status: "washing",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
      setLoading(false);
    }
  };

  return (
    <Card className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900">Nueva carga</h1>
        <p className="text-sm text-zinc-500">
          Inicia la lavadora con la carga actual.
        </p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Tipo de carga</label>
          <Select value={type} onChange={(e) => setType(e.target.value as LoadType)}>
            {Object.entries(LOAD_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          {type === "towels_feet" && (
            <p className="text-xs text-amber-600">
              ⚠️ Advertencia: Combinar toallas con toallas para pies puede generar que no se escurran bien debido a que ambos tipos son de materiales gruesos.
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Notas</label>
          <Input
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Opcional - Ej: cantidad específica, detalles, etc."
          />
        </div>
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Start Washer"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/dashboard")}
          >
            Volver
          </Button>
        </div>
      </form>
    </Card>
  );
}
