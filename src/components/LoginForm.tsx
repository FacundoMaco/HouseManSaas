"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { supabaseBrowser } from "@/lib/supabase/browser";

const CORRECT_PIN = "3007";
const PIN_STORAGE_KEY = "housemen_pin_verified";

export function LoginForm() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [pinVerified, setPinVerified] = useState(false);
  const [pinError, setPinError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = supabaseBrowser();

  // Check if PIN was already verified this session
  useEffect(() => {
    const verified = sessionStorage.getItem(PIN_STORAGE_KEY);
    if (verified === "true") {
      setPinVerified(true);
    }
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    
    if (pin === CORRECT_PIN) {
      sessionStorage.setItem(PIN_STORAGE_KEY, "true");
      setPinVerified(true);
    } else {
      setPinError("Invalid PIN. Please try again.");
      setPin("");
    }
  };

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

  // PIN Entry Screen
  if (!pinVerified) {
    return (
      <Card className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            HouseMen
          </p>
          <h1 className="text-2xl font-bold text-zinc-900">Enter PIN</h1>
          <p className="text-sm text-zinc-500 mt-1">Staff access only</p>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <Input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="••••"
            className="text-center text-2xl tracking-[0.5em] font-mono"
            autoFocus
          />
          
          {pinError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 text-center">
              {pinError}
            </p>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold"
            disabled={pin.length !== 4}
          >
            Continue
          </Button>
        </form>
      </Card>
    );
  }

  // Role Selection Screen (after PIN verified)
  return (
    <Card className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          HouseMen Pilot
        </p>
        <h1 className="text-2xl font-bold text-zinc-900">Select Role</h1>
        <p className="text-sm text-zinc-500 mt-1">Choose your position</p>
      </div>

      <div className="space-y-3">
        <Button 
          className="w-full h-12 text-base font-semibold" 
          onClick={() => handleLogin("frontdesk")} 
          disabled={loading}
          variant="secondary"
        >
          {loading ? "Logging in..." : "Front Desk"}
        </Button>
        <Button 
          className="w-full h-12 text-base font-semibold" 
          onClick={() => handleLogin("runner")} 
          disabled={loading}
        >
          {loading ? "Logging in..." : "Runner / Houseman"}
        </Button>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 text-center">
          {error}
        </p>
      ) : null}
    </Card>
  );
}
