import type { APIRoute } from "astro";
import db from "../../../../db/db";

export const POST: APIRoute = async ({ request }) => {
  const { id } = await request.json();

  if (!Number.isInteger(id) || id < 1) {
    return new Response(JSON.stringify({ error: "ID inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = db.prepare("DELETE FROM grupos WHERE id = ?").run(id);

  if (result.changes === 0) {
    return new Response(JSON.stringify({ error: "Grupo no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
