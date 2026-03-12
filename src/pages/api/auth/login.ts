import { verifyPassword } from "../../../lib/auth";
import { createSession } from "../../../lib/session";

export async function POST({ request, cookies }) {
  const { password } = await request.json();

  if (!password || !verifyPassword(password)) {
    return new Response(JSON.stringify({ error: "Credenciales inválidas" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = createSession();

  cookies.set("session", token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "strict",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
