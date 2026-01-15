import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getSessionUser();
  if (!session) {
    redirect("/login");
  }

  return <>{children}</>;
}
