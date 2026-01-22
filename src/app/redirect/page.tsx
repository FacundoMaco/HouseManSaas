import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function RedirectPage() {
  const supabase = await supabaseServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Intentamos leer el perfil
  let { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Si no existe, el trigger de la DB podría estar terminando. 
  // Esperamos 500ms y reintentamos UNA vez.
  if (profileError || !profile) {
    console.log("Redirect: Profile not found, retrying once...");
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const { data: retryProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    
    profile = retryProfile;
  }

  if (!profile) {
    console.error("Redirect: Profile still not found after retry. Is the trigger working?");
    redirect("/login?error=profile-missing");
  }

  const role = profile.role;
  console.log(`Redirect: Routing user ${user.email} to ${role}`);

  if (role === "runner") {
    redirect("/runner");
  } else {
    // Default para frontdesk o manager
    redirect("/frontdesk");
  }
}
