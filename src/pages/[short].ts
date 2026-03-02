import db from "../db/db";

export async function GET({ params }) {

  const { short } = params;

  const url = db.prepare(`
    SELECT * FROM urls WHERE code = ?
  `).get(short);

  if (!url) {
    return new Response("Not found", { status: 404 });
  }

  db.prepare(`
    UPDATE urls SET clicks = clicks + 1
    WHERE code = ?
  `).run(short);

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.url
    }
  });
}