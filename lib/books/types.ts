export type BookProvider = "openlibrary" | "google-books";

export type NormalizedBook = {
  provider: BookProvider;
  providerId: string;
  workId?: string;
  editionId?: string;
  title: string;
  authors: string[];
  description?: string;
  isbn10?: string;
  isbn13?: string;
  publishedYear?: number;
  pages?: number;
  language?: string;
  coverUrl?: string;
};

export type BookSearchParams = {
  query: string;
  page?: number;
  limit?: number;
};
