import type { Book } from "@/lib/books/seed";

export function BookCover({ book, compact = false }: { book: Book; compact?: boolean }) {
  return (
    <div className={`book-cover ${compact ? "book-cover--compact" : ""}`} style={{ backgroundColor: book.color }}>
      <div className="cover-line" />
      <span className="cover-kicker">{book.genre}</span>
      <strong>{book.title}</strong>
      <small>{book.author}</small>
    </div>
  );
}
