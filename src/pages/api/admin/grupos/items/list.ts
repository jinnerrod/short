import type { APIRoute } from "astro";
import db from "../../../../../db/db";

export const GET: APIRoute = ({ url }) => {
  const grupoId = parseInt(url.searchParams.get("grupo_id") ?? "", 10);

  if (!Number.isInteger(grupoId) || grupoId < 1) {
    return new Response(JSON.stringify({ error: "grupo_id inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const items = db
    .prepare("SELECT id, titulo, url FROM grupo_items WHERE grupo_id = ? ORDER BY id ASC")
    .all(grupoId);

  return new Response(JSON.stringify({ items }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
