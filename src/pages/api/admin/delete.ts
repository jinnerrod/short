import db from "../../../db/db";

export async function POST({ request }) {
  const body = await request.json();
  const id = Number(body.id);

  if (!Number.isInteger(id) || id <= 0) {
    return new Response(JSON.stringify({ error: "ID inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = db.prepare("DELETE FROM urls WHERE id = ?").run(id);

  if (result.changes === 0) {
    return new Response(JSON.stringify({ error: "URL no encontrada" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
