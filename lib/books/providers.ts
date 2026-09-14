import type { BookSearchParams, NormalizedBook } from "./types";

const openLibraryBaseUrl = process.env.OPEN_LIBRARY_BASE_URL ?? "https://openlibrary.org";

function firstString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export async function searchOpenLibrary({ query, page = 1, limit = 10 }: BookSearchParams): Promise<NormalizedBook[]> {
  const url = new URL(`${openLibraryBaseUrl}/search.json`);
  url.searchParams.set("q", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error(`Open Library request failed: ${response.status}`);
  const payload = (await response.json()) as { docs?: Record<string, unknown>[] };

  return (payload.docs ?? []).map((book) => {
    const isbns = Array.isArray(book.isbn) ? book.isbn.filter((isbn): isbn is string => typeof isbn === "string") : [];
    const authors = Array.isArray(book.author_name) ? book.author_name.filter((author): author is string => typeof author === "string") : [];
    return {
      provider: "openlibrary",
      providerId: firstString(book.key) ?? "",
      title: firstString(book.title) ?? "Untitled",
      authors,
      isbn10: isbns.find((isbn) => isbn.length === 10),
      isbn13: isbns.find((isbn) => isbn.length === 13),
      publishedYear: typeof book.first_publish_year === "number" ? book.first_publish_year : undefined,
      pages: typeof book.number_of_pages_median === "number" ? book.number_of_pages_median : undefined,
      coverUrl: typeof book.cover_i === "number" ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : undefined,
    } satisfies NormalizedBook;
  });
}
