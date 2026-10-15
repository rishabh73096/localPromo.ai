import { createBrowserClient } from "@supabase/ssr";
import { SAFE_KEY, SAFE_URL } from "@/utils/supabase/config";

export const createClient = () => createBrowserClient(SAFE_URL, SAFE_KEY);
