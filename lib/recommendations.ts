import type { LibraryBook } from "@/lib/local-store";
import type { Book } from "@/lib/books/seed";

export type Recommendation = Book & { score: number; explanation: string };

export function getRecommendations(library: LibraryBook[], candidates: Book[]): Recommendation[] {
  const lovedGenres = new Set(library.filter((book) => (book.rating ?? 0) >= 4 || book.status === "Finished").map((book) => book.genre));
  return candidates.filter((candidate) => !library.some((book) => book.id === candidate.id)).map((candidate, index) => {
    const genreBoost = lovedGenres.has(candidate.genre) ? 18 : 0;
    const score = Math.min(99, 72 + genreBoost + Math.max(0, 8 - index * 3));
    return { ...candidate, score, explanation: genreBoost ? `Because you enjoy ${candidate.genre.toLowerCase()} with an atmospheric mood.` : "A thoughtful match for your current reading rhythm." };
  }).sort((a, b) => b.score - a.score);
}
