import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { SAFE_KEY, SAFE_URL } from "@/utils/supabase/config";

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  return createServerClient(SAFE_URL, SAFE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component; safe to ignore if middleware
          // is refreshing user sessions.
        }
      },
    },
  });
};
