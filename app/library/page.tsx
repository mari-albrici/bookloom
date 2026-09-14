"use client";

import { BookOpen, Grid2X2, List, Plus, SlidersHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { BookCover } from "@/components/book-cover";
import { books } from "@/lib/books/seed";
import { useBookloom } from "@/lib/local-store";

const tabs = ["All books", "Reading", "Want to read", "Finished", "Paused", "DNF"];

export default function LibraryPage() {
  const { library, addBook, updateBook, removeBook } = useBookloom();
  const [activeTab, setActiveTab] = useState("All books");
  const [view, setView] = useState<"grid" | "list">("grid");
  const visibleBooks = activeTab === "All books" ? library : library.filter((book) => book.status === activeTab);
  const count = (tab: string) => tab === "All books" ? library.length : library.filter((book) => book.status === tab).length;
  const addNextBook = () => { const next = books.find((book) => !library.some((item) => item.id === book.id)); if (next) addBook(next); };

  return <AppShell><div className="page-wrap"><div className="subpage-heading"><div><p className="eyebrow">Your collection</p><h1>Library</h1><p className="lede">{library.length} books arranged around the way you read.</p></div><button className="primary-button" onClick={addNextBook}><Plus size={17} /> Add a book</button></div><div className="library-toolbar"><div className="tab-list">{tabs.map((tab) => <button className={activeTab === tab ? "active" : ""} key={tab} onClick={() => setActiveTab(tab)}>{tab}<span>{count(tab)}</span></button>)}</div><div className="toolbar-actions"><button className="secondary-button"><SlidersHorizontal size={16} /> Filter</button><button className={`view-button ${view === "grid" ? "active" : ""}`} onClick={() => setView("grid")} aria-label="Grid view"><Grid2X2 size={17} /></button><button className={`view-button ${view === "list" ? "active" : ""}`} onClick={() => setView("list")} aria-label="List view"><List size={17} /></button></div></div><section className={view === "grid" ? "library-grid" : "library-list"}>{visibleBooks.map((book) => <article className="library-book" key={book.id}><BookCover book={book} /><div className="library-book-info"><span className={`status-pill ${book.status === "Reading" ? "reading" : ""}`}><BookOpen size={12} /> {book.status}</span><h3>{book.title}</h3><p>{book.author}</p><div className="library-controls"><label>Progress <input type="range" min="0" max="100" value={book.progress} onChange={(event) => updateBook(book.id, { progress: Number(event.target.value) })} /></label><strong>{book.progress}%</strong><select value={book.status} onChange={(event) => updateBook(book.id, { status: event.target.value as typeof book.status })}><option>Want to read</option><option>Reading</option><option>Finished</option><option>Paused</option><option>DNF</option><option>Re-reading</option></select><button className="danger-button" onClick={() => removeBook(book.id)} aria-label={`Remove ${book.title}`}><Trash2 size={15} /></button></div>{book.rating && <span className="local-rating">Your rating: {book.rating}/5</span>}</div></article>)}</section></div></AppShell>;
}
