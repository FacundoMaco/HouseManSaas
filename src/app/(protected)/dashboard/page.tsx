"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardClient } from "@/components/DashboardClient";
import { isAuthenticated } from "@/lib/auth-simple";

export default function DashboardPage() {
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

  return <DashboardClient />;
}
