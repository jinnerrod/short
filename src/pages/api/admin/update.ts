import db from "../../../db/db";

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST({ request }) {
  const body = await request.json();
  const id = Number(body.id);
  const { url, descripcion } = body;

  if (!Number.isInteger(id) || id <= 0) {
    return new Response(JSON.stringify({ error: "ID inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!url || !isValidUrl(url)) {
    return new Response(JSON.stringify({ error: "URL inválida" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = db
    .prepare("UPDATE urls SET url = ?, descripcion = ? WHERE id = ?")
    .run(url, descripcion || null, id);

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
