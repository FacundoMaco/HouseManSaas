import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;
  
  // Usamos el PIN 3030 por defecto si no hay variable de entorno
  const STEALTH_KEY = process.env.STEALTH_KEY || "3030";

  // 1. Lógica de Stealth Mode
  const stealthCookie = request.cookies.get("stealth_access")?.value;
  const keyParam = searchParams.get("key");

  // Si hay un key en el query param, verificarlo
  if (keyParam && keyParam === STEALTH_KEY) {
    const response = NextResponse.redirect(new URL(pathname, request.url));
    response.cookies.set("stealth_access", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: "/",
    });
    return response;
  }

  // Rutas que SIEMPRE deben estar disponibles (assets, api, etc)
  const isPublicAsset = 
    pathname.startsWith("/_next") || 
    pathname.startsWith("/api") || 
    pathname.startsWith("/favicon.ico") || 
    pathname.startsWith("/robots.txt") || 
    pathname.startsWith("/sitemap.xml") ||
    pathname.includes("."); // Para archivos estáticos en public/

  // Si no tiene acceso y no es un asset público, mostrar 404 (rewrite a /not-found)
  if (!stealthCookie && !isPublicAsset) {
    // Permitir acceso a la ruta de logout para limpiar cookies si fuera necesario
    if (pathname !== "/api/stealth/logout") {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
  }

  // 2. Lógica de Supabase Auth
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Rutas públicas de auth
  if (pathname.startsWith("/login") || pathname.startsWith("/auth")) {
    return supabaseResponse;
  }

  // 4. Redirigir raíz a /redirect
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/redirect", request.url));
  }

  // 5. Proteger rutas privadas
  if (!user && (pathname.startsWith("/frontdesk") || pathname.startsWith("/runner") || pathname.startsWith("/redirect"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
