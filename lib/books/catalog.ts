import type { Book } from "./seed";
import type { NormalizedBook } from "./types";

const palette = ["#d2baa7", "#b7c8b3", "#c7b6c5", "#b9c7bb"];

export function stableBookId(provider: string, providerId: string) {
  let hash = 0;
  for (const character of `${provider}:${providerId}`) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return Math.abs(hash) + 100;
}

export function normalizedToBook(book: NormalizedBook, index = 0): Book {
  return {
    id: stableBookId(book.provider, book.providerId),
    title: book.title,
    author: book.authors[0] ?? "Unknown author",
    genre: "From book provider",
    mood: "Discoverable",
    status: "Want to read",
    color: palette[index % palette.length],
    provider: book.provider,
    providerId: book.providerId,
    isbn10: book.isbn10,
    isbn13: book.isbn13,
    pages: book.pages,
    publishedYear: book.publishedYear,
    description: book.description,
    coverUrl: book.coverUrl,
  };
}

export function bookToNormalized(book: Book): NormalizedBook {
  return {
    provider: book.provider === "google-books" ? "google-books" : "openlibrary",
    providerId: book.providerId ?? String(book.id),
    title: book.title,
    authors: [book.author],
    description: book.description,
    isbn10: book.isbn10,
    isbn13: book.isbn13,
    publishedYear: book.publishedYear,
    pages: book.pages,
    coverUrl: book.coverUrl,
  };
}
