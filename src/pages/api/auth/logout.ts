import { destroySession } from "../../../lib/session";

export async function POST({ cookies }) {
  const token = cookies.get("session")?.value;

  if (token) {
    destroySession(token);
  }

  cookies.delete("session", { path: "/" });

  return new Response(null, {
    status: 302,
    headers: { Location: "/login" },
  });
}
