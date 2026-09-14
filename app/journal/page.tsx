"use client";

import { Lock, PenLine, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useBookloom } from "@/lib/local-store";

export default function JournalPage() {
  const { journal, library, addJournal } = useBookloom();
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState("");
  const [bookId, setBookId] = useState(library[0]?.id ?? 1);
  const filtered = useMemo(() => journal.filter((entry) => `${entry.text} ${entry.type} ${library.find((book) => book.id === entry.bookId)?.title ?? ""}`.toLowerCase().includes(query.toLowerCase())), [journal, library, query]);
  const saveEntry = () => { if (!text.trim()) return; addJournal({ bookId, type: "Thought", text: text.trim(), private: true }); setText(""); setShowForm(false); };

  return <AppShell><div className="page-wrap"><div className="subpage-heading"><div><p className="eyebrow">A private place to notice</p><h1>Reading journal</h1><p className="lede">The thoughts that happen between the pages.</p></div><button className="primary-button" onClick={() => setShowForm(true)}><Plus size={17} /> New entry</button></div><div className="journal-toolbar"><label className="wide-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your notes..." /></label><span className="privacy-note"><Lock size={14} /> Private by default</span></div><section className="journal-feed">{filtered.map((entry) => <article className="journal-full-entry" key={entry.id}><div className="entry-date"><strong>{new Date(entry.createdAt).getDate()}</strong><span>{new Date(entry.createdAt).toLocaleString("en", { month: "short" }).toUpperCase()}</span></div><div className="journal-entry-body"><div className="entry-type"><PenLine size={13} /> {entry.type} · {library.find((book) => book.id === entry.bookId)?.title ?? "Book"}</div><p>{entry.text}</p><span className="entry-meta">{entry.page ?? "No page marker"} · Private</span></div></article>)}</section>{showForm && <div className="modal-backdrop" onClick={() => setShowForm(false)}><form className="add-modal" onSubmit={(event) => { event.preventDefault(); saveEntry(); }} onClick={(event) => event.stopPropagation()}><button type="button" className="close-button" onClick={() => setShowForm(false)} aria-label="Close"><X size={18} /></button><p className="eyebrow">Private journal</p><h2>Keep the thought.</h2><p className="modal-copy">Your note stays private unless you choose to share it later.</p><label className="form-label">Book<select value={bookId} onChange={(event) => setBookId(Number(event.target.value))}>{library.map((book) => <option value={book.id} key={book.id}>{book.title}</option>)}</select></label><label className="form-label">Note<textarea value={text} onChange={(event) => setText(event.target.value)} autoFocus rows={5} placeholder="What stayed with you?" /></label><button className="primary-button" type="submit"><PenLine size={16} /> Save private note</button></form></div>}</div></AppShell>;
}
