"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { supabaseBrowser } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = supabaseBrowser();

  const handleLogin = async (role: "frontdesk" | "runner") => {
    setError("");
    setLoading(true);

    const email = role === "frontdesk" 
      ? "facundomacoreb+front@gmail.com" 
      : "facundomacoreb@gmail.com";
    const password = role === "frontdesk" ? "front132" : "house123";

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message || "Invalid login credentials.");
      setLoading(false);
      return;
    }

    router.push("/redirect");
  };

  return (
    <Card className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          HouseMen Pilot Demo
        </p>
        <h1 className="text-2xl font-bold text-zinc-900">Direct Access</h1>
        <p className="text-sm text-zinc-500 mt-1">Select your role to start</p>
      </div>

      <div className="space-y-3">
        <Button 
          className="w-full h-12 text-base font-semibold" 
          onClick={() => handleLogin("frontdesk")} 
          disabled={loading}
          variant="secondary"
        >
          {loading ? "Logging in..." : "Login as Front Desk"}
        </Button>
        <Button 
          className="w-full h-12 text-base font-semibold" 
          onClick={() => handleLogin("runner")} 
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login as Runner"}
        </Button>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 text-center">
          {error}
        </p>
      ) : null}

      <p className="text-[10px] text-center text-zinc-400">
        Demo bypass enabled. No PIN required.
      </p>
    </Card>
  );
}
