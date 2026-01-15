"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth-simple";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (login(username, password)) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("Credenciales inválidas.");
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">HouseMen</h1>
        <p className="text-sm text-zinc-500">Acceso interno</p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">
            Usuario
          </label>
          <Input
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="usuario"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">
            Contraseña
          </label>
          <Input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Login"}
        </Button>
      </form>
    </Card>
  );
}
