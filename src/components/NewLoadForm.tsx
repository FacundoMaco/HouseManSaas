"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { LoadType } from "@/lib/types";

export function NewLoadForm() {
  const router = useRouter();
  const [type, setType] = useState<LoadType>("towels");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/loads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          weight_lbs: Number(weight),
          notes: notes.trim() ? notes.trim() : null,
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "No se pudo crear la carga.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
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
          <label className="text-sm font-medium text-zinc-700">Tipo</label>
          <Select value={type} onChange={(e) => setType(e.target.value as LoadType)}>
            <option value="towels">Toallas</option>
            <option value="sheets">Sábanas</option>
            <option value="mixed">Mixta</option>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Peso (lb)</label>
          <Input
            type="number"
            min="1"
            step="1"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            placeholder="Ej. 20"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Notas</label>
          <Input
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Opcional"
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
