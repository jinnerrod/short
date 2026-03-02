import db from "../../db/db";
import { generateCode } from "../../utils/base62";

export async function POST({ request }) {

  const { url, author } = await request.json();

  const code = generateCode();

  db.prepare(`
    INSERT INTO urls (code, url, author, created_at)
    VALUES (?, ?, ?, datetime('now'))
  `).run(code, url, author);

  return new Response(JSON.stringify({
    short: "/" + code
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
