"use client";

import { Bookmark, ChevronRight, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { BookCover } from "@/components/book-cover";
import { books as seedBooks, type Book } from "@/lib/books/seed";
import type { NormalizedBook } from "@/lib/books/types";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<number[]>([1]);
  const [providerBooks, setProviderBooks] = useState<NormalizedBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [providerError, setProviderError] = useState(false);
  const filtered = useMemo(() => seedBooks.filter((book) => `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(query.toLowerCase())), [query]);

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 3) {
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      setProviderError(false);
      try {
        const response = await fetch(`/api/books/search?q=${encodeURIComponent(normalizedQuery)}`, { signal: controller.signal });
        if (!response.ok) throw new Error("provider error");
        const payload = await response.json() as { books?: NormalizedBook[] };
        setProviderBooks(payload.books ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setProviderError(true);
        setProviderBooks([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query]);

  const liveBooks: Book[] = providerBooks.map((book, index) => ({ id: 1000 + index, title: book.title, author: book.authors[0] ?? "Unknown author", genre: "From Open Library", mood: "Discoverable", status: "Want to read", color: ["#d2baa7", "#b7c8b3", "#c7b6c5"][index % 3] }));
  const results = query.trim().length >= 3 && !isSearching && !providerError ? liveBooks : filtered;

  return <AppShell><div className="page-wrap"><div className="subpage-hero"><div><p className="eyebrow">Explore by feeling</p><h1>Find a book that meets you where you are.</h1><p className="lede">Recommendations shaped by your reading patterns, not popularity alone.</p></div><Sparkles size={46} strokeWidth={1} /></div><div className="explore-toolbar"><label className="wide-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, author, genre..." /></label><button className="secondary-button"><SlidersHorizontal size={16} /> Filters</button></div><div className="section-heading compact-heading"><div><p className="eyebrow">{query.trim().length >= 3 ? "Open Library results" : "Because you love atmospheric fiction"}</p><h2>{isSearching ? "Searching..." : providerError ? "Showing your shelf" : query.trim().length >= 3 ? `${results.length} books found` : "For you"}</h2></div><button className="quiet-button">Tune your taste <ChevronRight size={16} /></button></div><section className="explore-grid">{results.map((book, index) => <article className="explore-card" key={book.id}><div className="explore-cover"><BookCover book={book} /><button className={`save-button ${saved.includes(book.id) ? "is-saved" : ""}`} onClick={() => setSaved((current) => current.includes(book.id) ? current.filter((id) => id !== book.id) : [...current, book.id])} aria-label={`Save ${book.title}`}><Bookmark size={16} fill={saved.includes(book.id) ? "currentColor" : "none"} /></button></div><div className="explore-card-copy"><span className="match"><Sparkles size={13} /> {94 - index * 3}% taste match</span><h3><Link href={`/books/openlibrary/${encodeURIComponent(book.title.toLowerCase().replaceAll(" ", "-"))}`}>{book.title}</Link></h3><p>{book.author}</p><div className="tag-row"><span>{book.mood}</span><span>{book.genre}</span></div><p className="why-match">Because you enjoy thoughtful, slow-burn stories with a strong sense of place.</p></div></article>)}</section></div></AppShell>;
}
