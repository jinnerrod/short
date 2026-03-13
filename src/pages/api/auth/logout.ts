import { destroySession } from "../../../lib/session";

export async function POST({ cookies, redirect }) {
  const token = cookies.get("session")?.value;

  if (token) {
    destroySession(token);
  }

  // Explicitly overwrite cookie with maxAge:0 — more reliable than cookies.delete()
  cookies.set("session", "", {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return redirect("/login", 302);
}
