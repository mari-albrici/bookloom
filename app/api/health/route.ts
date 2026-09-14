import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export function GET() {
  const supabase = getSupabaseConfig();
  return NextResponse.json({
    ok: true,
    services: {
      supabase: supabase.isConfigured ? "configured" : "local-fallback",
      openLibrary: process.env.OPEN_LIBRARY_BASE_URL ? "configured" : "default",
    },
  });
}
