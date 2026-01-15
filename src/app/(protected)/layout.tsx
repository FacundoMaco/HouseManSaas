"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-simple";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return <>{children}</>;
}
