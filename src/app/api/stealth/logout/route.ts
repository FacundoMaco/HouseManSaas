import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/", request.url));
  
  // Borrar la cookie de acceso stealth
  response.cookies.set("stealth_access", "", {
    maxAge: 0,
    path: "/",
  });

  return response;
}
