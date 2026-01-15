"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardClient } from "@/components/DashboardClient";
import { isAuthenticated } from "@/lib/auth-simple";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  if (!isAuthenticated()) {
    return null;
  }

  return <DashboardClient />;
}
