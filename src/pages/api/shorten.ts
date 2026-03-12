import db from "../../db/db";
import { generateCode } from "../../utils/base62";

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
  const { url, descripcion } = body;

  if (!url || !isValidUrl(url)) {
    return new Response(JSON.stringify({ error: "URL inválida" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Generate unique code with collision retry
  let code: string = "";
  let attempts = 0;
  do {
    code = generateCode();
    attempts++;
    if (attempts > 10) {
      return new Response(
        JSON.stringify({ error: "Error al generar código único" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } while (db.prepare("SELECT 1 FROM urls WHERE code = ?").get(code));

  db.prepare(
    `INSERT INTO urls (code, url, descripcion, created_at)
     VALUES (?, ?, ?, datetime('now'))`
  ).run(code, url, descripcion || null);

  return new Response(JSON.stringify({ short: "/" + code }), {
    headers: { "Content-Type": "application/json" },
  });
}
