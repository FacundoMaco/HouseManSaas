"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { isAuthenticated } from "@/lib/auth-simple";

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  if (isAuthenticated()) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
