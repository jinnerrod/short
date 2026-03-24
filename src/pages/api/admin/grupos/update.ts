import type { APIRoute } from "astro";
import db from "../../../../db/db";

export const POST: APIRoute = async ({ request }) => {
  const { id, nombre, descripcion } = await request.json();

  if (!Number.isInteger(id) || id < 1) {
    return new Response(JSON.stringify({ error: "ID inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!nombre?.trim()) {
    return new Response(JSON.stringify({ error: "El nombre es requerido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = db
    .prepare("UPDATE grupos SET nombre = ?, descripcion = ? WHERE id = ?")
    .run(nombre.trim(), descripcion?.trim() || null, id);

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
