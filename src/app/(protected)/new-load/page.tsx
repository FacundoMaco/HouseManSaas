"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NewLoadForm } from "@/components/NewLoadForm";
import { isAuthenticated } from "@/lib/auth-simple";

export default function NewLoadPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          HouseMen
        </p>
        <h1 className="text-xl font-semibold text-zinc-900">
          Nueva carga
        </h1>
      </header>
      <NewLoadForm />
    </div>
  );
}
