//export { auth as middleware } from "@/lib/auth"
import { auth } from "@/auth";

export default auth((req) => {
  const isAuthenticated = !!req.auth;

  if (isAuthenticated) return Response.redirect(new URL("https://misy.online", req.nextUrl.origin));
});

export const config = { matcher: ["/((?!api|_next/static|_next/image|images|robots.txt|favicon.ico).*)"] };