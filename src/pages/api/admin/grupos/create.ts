import type { APIRoute } from "astro";
import db from "../../../../db/db";
import { generateCode } from "../../../../utils/base62";

export const POST: APIRoute = async ({ request }) => {
  const { nombre, descripcion } = await request.json();

  if (!nombre?.trim()) {
    return new Response(JSON.stringify({ error: "El nombre es requerido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let slug: string | null = null;
  for (let i = 0; i < 10; i++) {
    const candidate = generateCode(6);
    const existing = db.prepare("SELECT id FROM grupos WHERE slug = ?").get(candidate);
    if (!existing) { slug = candidate; break; }
  }

  if (!slug) {
    return new Response(JSON.stringify({ error: "No se pudo generar un slug único" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = db
    .prepare("INSERT INTO grupos (slug, nombre, descripcion, created_at) VALUES (?, ?, ?, datetime('now'))")
    .run(slug, nombre.trim(), descripcion?.trim() || null);

  return new Response(
    JSON.stringify({
      id: result.lastInsertRowid,
      slug,
      nombre: nombre.trim(),
      descripcion: descripcion?.trim() || null,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
