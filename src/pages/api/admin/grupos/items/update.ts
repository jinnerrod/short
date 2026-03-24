import type { APIRoute } from "astro";
import db from "../../../../../db/db";

export const POST: APIRoute = async ({ request }) => {
  const { id, titulo, url } = await request.json();

  if (!Number.isInteger(id) || id < 1) {
    return new Response(JSON.stringify({ error: "ID inválido" }), {
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

  const result = db
    .prepare("UPDATE grupo_items SET titulo = ?, url = ? WHERE id = ?")
    .run(titulo?.trim() || null, url.trim(), id);

  if (result.changes === 0) {
    return new Response(JSON.stringify({ error: "Item no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
