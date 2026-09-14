import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { requireSupabaseConfig } from "./config";

let client: SupabaseClient<Database> | undefined;

export function getSupabaseBrowserClient() {
  if (!client) {
    const config = requireSupabaseConfig();
    client = createBrowserClient<Database>(config.url, config.anonKey);
  }
  return client;
}
