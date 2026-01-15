import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { getSessionUser } from "@/lib/auth";

export default function LoginPage() {
  const session = getSessionUser();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
