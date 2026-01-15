import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  return <>{children}</>;
}
