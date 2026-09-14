import { NextRequest, NextResponse } from "next/server";
import { searchOpenLibrary } from "@/lib/books/providers";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query) return NextResponse.json({ books: [] });
  if (query.length > 120) return NextResponse.json({ error: "Search query is too long." }, { status: 400 });

  try {
    const books = await searchOpenLibrary({ query, limit: 12 });
    return NextResponse.json({ books });
  } catch {
    return NextResponse.json({ error: "Book provider unavailable." }, { status: 502 });
  }
}
