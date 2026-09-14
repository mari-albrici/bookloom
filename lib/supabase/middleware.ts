import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";
import { getSupabaseConfig } from "./config";

export async function updateSupabaseSession(request: NextRequest) {
  const config = getSupabaseConfig();
  if (!config.isConfigured || !config.url || !config.anonKey) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const client = createServerClient<Database>(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(values) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  await client.auth.getUser();
  return response;
}
