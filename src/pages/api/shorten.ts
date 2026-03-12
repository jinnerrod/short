import db from "../../db/db";
import { generateCode } from "../../utils/base62";

export async function POST({ request }) {

  const { url, descripcion } = await request.json();

  const code = generateCode();

  db.prepare(`
    INSERT INTO urls (code, url, descripcion, created_at)
    VALUES (?, ?, ?, datetime('now'))
  `).run(code, url, descripcion);

  return new Response(JSON.stringify({
    short: "/" + code
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
