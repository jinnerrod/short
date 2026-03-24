import type { APIRoute } from "astro";
import db from "../../../../../db/db";

export const POST: APIRoute = async ({ request }) => {
  const { grupo_id, titulo, url } = await request.json();

  if (!Number.isInteger(grupo_id) || grupo_id < 1) {
    return new Response(JSON.stringify({ error: "grupo_id inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error();
  } catch {
    return new Response(JSON.stringify({ error: "URL inválida (debe ser http o https)" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const grupo = db.prepare("SELECT id FROM grupos WHERE id = ?").get(grupo_id);
  if (!grupo) {
    return new Response(JSON.stringify({ error: "Grupo no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = db
    .prepare("INSERT INTO grupo_items (grupo_id, titulo, url) VALUES (?, ?, ?)")
    .run(grupo_id, titulo?.trim() || null, url.trim());

  return new Response(
    JSON.stringify({ id: result.lastInsertRowid, grupo_id, titulo: titulo?.trim() || null, url: url.trim() }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
