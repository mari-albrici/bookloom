"use client";

import { CalendarDays, MessageCircle, Plus, Users } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { BookCover } from "@/components/book-cover";
import { useBookloom } from "@/lib/local-store";

export default function CirclesPage() {
  const { circles, library, addCircle } = useBookloom();
  const [showForm, setShowForm] = useState(false);
  const currentBook = (id: number) => library.find((book) => book.id === id) ?? library[0];
  return <AppShell><div className="page-wrap"><div className="subpage-heading"><div><p className="eyebrow">Read together, gently</p><h1>Reading Circles</h1><p className="lede">Conversations with more context and less noise.</p></div><button className="primary-button" onClick={() => setShowForm(true)}><Plus size={17} /> New circle</button></div><section className="circle-grid">{circles.map((circle) => <article className="circle-card" key={circle.id}><div className="circle-card-head"><span className="status-pill">{circle.visibility}</span><Users size={18} color="var(--sage)" /></div><h2>{circle.name}</h2><p>{circle.description}</p><div className="circle-book">{currentBook(circle.currentBookId) && <BookCover book={currentBook(circle.currentBookId)} compact />}<div><span className="eyebrow">Currently reading</span><strong>{currentBook(circle.currentBookId)?.title}</strong><small><Users size={12} /> {circle.members} members</small></div></div><div className="circle-card-foot"><span><MessageCircle size={14} /> 12 discussions</span><span><CalendarDays size={14} /> Next Sunday</span></div></article>)}</section>{showForm && <div className="modal-backdrop" onClick={() => setShowForm(false)}><form className="add-modal" onSubmit={(event) => { event.preventDefault(); addCircle({ name: "New reading circle", description: "A new space for shared reading.", currentBookId: library[0]?.id ?? 1, members: 1, visibility: "Private" }); setShowForm(false); }} onClick={(event) => event.stopPropagation()}><p className="eyebrow">Create a circle</p><h2>Give your reading a room.</h2><p className="modal-copy">A private circle is visible only to invited readers.</p><button className="primary-button" type="submit"><Plus size={16} /> Create private circle</button></form></div>}</div></AppShell>;
}
