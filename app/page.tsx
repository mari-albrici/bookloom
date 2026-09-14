use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen, Bookmark, ChevronRight, Compass, Heart, Home, Library, Menu,
  MoreHorizontal, PenLine, Plus, Search, Settings2, Sparkles, Star, UserRound, X,
} from "lucide-react";

type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
  mood: string;
  status: "Reading" | "Want to read" | "Finished";
  color: string;
  progress?: number;
  quote?: string;
};

const books: Book[] = [
  { id: 1, title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", genre: "Speculative fiction", mood: "Atmospheric", status: "Reading", progress: 64, color: "#b9c7bb", quote: "Light is the left hand of darkness." },
  { id: 2, title: "Sea of Tranquility", author: "Emily St. John Mandel", genre: "Literary fiction", mood: "Time-bending", status: "Want to read", color: "#d2baa7" },
  { id: 3, title: "Braiding Sweetgrass", author: "Robin Wall Kimmerer", genre: "Nature writing", mood: "Reflective", status: "Finished", color: "#b7c8b3" },
  { id: 4, title: "Piranesi", author: "Susanna Clarke", genre: "Fantasy", mood: "Dreamlike", status: "Want to read", color: "#c7b6c5" },
];

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Library", href: "/library", icon: Library },
  { label: "Journal", href: "/journal", icon: PenLine },
  { label: "Profile", href: "/profile", icon: UserRound },
];

function BookCover({ book, compact = false }: { book: Book; compact?: boolean }) {
  return (
    <div className={`book-cover ${compact ? "book-cover--compact" : ""}`} style={{ backgroundColor: book.color }}>
      <div className="cover-line" />
      <span className="cover-kicker">{book.genre}</span>
      <strong>{book.title}</strong>
      <small>{book.author}</small>
    </div>
  );
}

export default function HomePage() {
  const activeNav = "Home";
  const [query, setQuery] = useState("");
  const [showAddBook, setShowAddBook] = useState(false);
  const [saved, setSaved] = useState<number[]>([1]);

  const filteredBooks = useMemo(() => books.filter((book) =>
    `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(query.toLowerCase())
  ), [query]);

  const toggleSaved = (id: number) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">B</span><span>bookloom</span></div>
        <div className="sidebar-label">Your reading life</div>
        <nav className="nav-list">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link className={`nav-item ${activeNav === label ? "is-active" : ""}`} href={href} key={label}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === "Library" && <span className="nav-count">12</span>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link className="nav-item" href="/settings"><Settings2 size={18} strokeWidth={1.8} /><span>Settings</span></Link>
          <div className="mini-profile"><div className="avatar">MA</div><div><strong>Marta Albrici</strong><span>@marta_reads</span></div><MoreHorizontal size={17} /></div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open menu"><Menu size={21} /></button>
          <div className="breadcrumb"><span>Home</span><ChevronRight size={15} /><strong>{activeNav}</strong></div>
          <div className="top-actions"><label className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search books, authors..." /></label><button className="icon-button" aria-label="Notifications"><Heart size={18} /></button><button className="avatar avatar-button">MA</button></div>
        </header>

        <div className="page-wrap">
          <section className="welcome-row"><div><p className="eyebrow">Monday, September 14</p><h1>Good morning, Marta<span className="title-dot">.</span></h1><p className="lede">A quiet moment for the stories that stay with you.</p></div><button className="primary-button" onClick={() => setShowAddBook(true)}><Plus size={17} /> Add a book</button></section>

          <section className="reading-hero">
            <div className="hero-copy"><div className="section-kicker"><span className="live-dot" /> Currently reading</div><h2>One chapter at a time.</h2><p>Keep going with <strong>The Left Hand of Darkness</strong>. You are in the middle of chapter 8.</p><div className="progress-meta"><span>64% complete</span><span>87 pages left</span></div><div className="progress-track"><span style={{ width: "64%" }} /></div><button className="text-button">Update progress <ChevronRight size={16} /></button></div><div className="hero-book"><BookCover book={books[0]} /></div><div className="hero-note"><span className="note-label">Last journal note</span><p>“The world feels wider every time Genj explains it.”</p><span className="note-page">p. 142 · 2 days ago</span></div></section>

          <div className="section-heading"><div><p className="eyebrow">Curated for your taste</p><h2>Books you may keep thinking about</h2></div><button className="quiet-button">View all <ChevronRight size={16} /></button></div>
          <section className="book-grid">{filteredBooks.filter((book) => book.id !== 1).slice(0, 3).map((book) => <article className="book-card" key={book.id}><div className="card-cover-wrap"><BookCover book={book} compact /><button className={`save-button ${saved.includes(book.id) ? "is-saved" : ""}`} onClick={() => toggleSaved(book.id)} aria-label={`Save ${book.title}`}><Bookmark size={16} fill={saved.includes(book.id) ? "currentColor" : "none"} /></button></div><div className="book-card-copy"><div className="card-topline"><span>{book.mood}</span><span className="match"><Sparkles size={13} /> {book.id === 2 ? "94" : book.id === 3 ? "89" : "86"}% match</span></div><h3>{book.title}</h3><p>{book.author}</p><div className="tag-row"><span>{book.genre}</span><span>Quietly moving</span></div></div></article>)}</section>

          <section className="lower-grid"><div className="journal-panel"><div className="panel-heading"><div><p className="eyebrow">Your journal</p><h2>Small notes, lasting traces.</h2></div><button className="icon-button warm" aria-label="Write journal entry"><PenLine size={17} /></button></div><div className="journal-entry"><div className="entry-date"><strong>12</strong><span>SEP</span></div><div><span className="entry-type">Reflection · The Left Hand of Darkness</span><p>“Maybe home is not a place, but the people who let us become unknowable.”</p><span className="entry-meta">Chapter 7 · Private</span></div></div><div className="journal-entry"><div className="entry-date"><strong>04</strong><span>SEP</span></div><div><span className="entry-type">Favorite passage · Braiding Sweetgrass</span><p>The grammar of animacy asks us to notice what is alive around us.</p><span className="entry-meta">p. 48 · Private</span></div></div><button className="quiet-button journal-link">Open journal <ChevronRight size={16} /></button></div><div className="dna-panel"><div className="panel-heading"><div><p className="eyebrow">Reader DNA</p><h2>The shape of your taste.</h2></div><button className="quiet-button">Explore</button></div><div className="dna-bars"><div><span>Atmospheric</span><div className="dna-track"><i style={{ width: "88%" }} /></div><b>88</b></div><div><span>Character-driven</span><div className="dna-track"><i style={{ width: "81%" }} /></div><b>81</b></div><div><span>Thought-provoking</span><div className="dna-track"><i style={{ width: "76%" }} /></div><b>76</b></div><div><span>Slow-burn</span><div className="dna-track"><i style={{ width: "69%" }} /></div><b>69</b></div></div><div className="dna-foot"><span><Star size={14} fill="currentColor" /> Based on 24 books</span><span>Updated today</span></div></div></section>
        </div>
      </section>

      <nav className="mobile-nav">{navItems.map(({ label, href, icon: Icon }) => <Link className={activeNav === label ? "is-active" : ""} href={href} key={label}><Icon size={19} /><span>{label}</span></Link>)}</nav>
      {showAddBook && <div className="modal-backdrop" onClick={() => setShowAddBook(false)}><div className="add-modal" onClick={(event) => event.stopPropagation()}><button className="close-button" onClick={() => setShowAddBook(false)} aria-label="Close"><X size={18} /></button><div className="modal-icon"><BookOpen size={20} /></div><p className="eyebrow">Add to your library</p><h2>What are you reading next?</h2><p className="modal-copy">Search the world of books and make the next one part of your story.</p><label className="modal-search"><Search size={17} /><input autoFocus placeholder="Title, author or ISBN" /></label><div className="modal-suggestions">{books.slice(1, 3).map((book) => <button key={book.id} onClick={() => setShowAddBook(false)}><BookCover book={book} compact /><span><strong>{book.title}</strong><small>{book.author}</small></span><Plus size={17} /></button>)}</div></div></div>}
    </main>
  );
}
