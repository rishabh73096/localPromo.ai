import type { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// Supabase session refresh + route guards. With the backend switched off (utils/supabase/config.ts) this is a pass-through.
export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
