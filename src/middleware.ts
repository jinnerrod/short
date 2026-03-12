import { defineMiddleware } from "astro:middleware";
import { validateSession } from "./lib/session";

const PROTECTED_PAGES = ["/admin", "/add"];
const PROTECTED_API = ["/api/admin"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const isProtectedPage = PROTECTED_PAGES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
  const isProtectedApi = PROTECTED_API.some((r) => pathname.startsWith(r));

  if (isProtectedPage || isProtectedApi) {
    const token = context.cookies.get("session")?.value;

    if (!token || !validateSession(token)) {
      if (isProtectedApi) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      return context.redirect("/login");
    }
  }

  return next();
});
