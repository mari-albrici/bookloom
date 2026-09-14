"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Book } from "@/lib/books/seed";
import { books as seedBooks } from "@/lib/books/seed";

export type LibraryBook = Book & { status: Book["status"] | "Paused" | "DNF" | "Re-reading"; progress: number; addedAt: string; rating?: number; edition?: string; startedAt?: string; finishedAt?: string };
export type JournalEntry = { id: string; bookId: number; type: string; text: string; page?: string; createdAt: string; private: boolean };
export type ReadingGoal = { id: string; label: string; target: number; current: number; unit: string; year: number };
export type ReadingCircle = { id: string; name: string; description: string; currentBookId: number; members: number; visibility: "Public" | "Private" };
export type AppEvent = { type: string; bookId?: number; createdAt: string };
export type AppState = { library: LibraryBook[]; journal: JournalEntry[]; goals: ReadingGoal[]; circles: ReadingCircle[]; events: AppEvent[]; savedBookIds: number[]; profile: { name: string; username: string; bio: string } };

type Store = AppState & { addBook: (book: Book) => void; updateBook: (id: number, patch: Partial<LibraryBook>) => void; removeBook: (id: number) => void; addJournal: (entry: Omit<JournalEntry, "id" | "createdAt">) => void; addGoal: (goal: Omit<ReadingGoal, "id">) => void; toggleSaved: (id: number) => void; addCircle: (circle: Omit<ReadingCircle, "id">) => void; resetLocalData: () => void };

const initialState: AppState = {
  library: seedBooks.map((book, index) => ({ ...book, progress: book.progress ?? 0, addedAt: new Date(Date.now() - index * 86400000).toISOString(), rating: book.id === 3 ? 4.5 : undefined, edition: "Paperback · English" })),
  journal: [
    { id: "j-1", bookId: 1, type: "Reflection", text: "Maybe home is not a place, but the people who let us become unknowable.", page: "Chapter 7", createdAt: "2026-09-12T09:00:00.000Z", private: true },
    { id: "j-2", bookId: 3, type: "Favorite passage", text: "The grammar of animacy asks us to notice what is alive around us.", page: "p. 48", createdAt: "2026-09-04T09:00:00.000Z", private: true },
  ],
  goals: [{ id: "g-1", label: "Books read", target: 24, current: 8, unit: "books", year: 2026 }],
  circles: [{ id: "c-1", name: "Slow pages club", description: "A gentle circle for atmospheric books and generous conversations.", currentBookId: 4, members: 38, visibility: "Public" }],
  events: [], savedBookIds: [1, 2],
  profile: { name: "Marta Albrici", username: "marta_reads", bio: "Stories with atmosphere, questions without easy answers." },
};

const StoreContext = createContext<Store | null>(null);
const STORAGE_KEY = "bookloom-local-state-v1";

export function LocalStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    if (typeof window === "undefined") return initialState;
    try { const saved = window.localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) as AppState : initialState; } catch { return initialState; }
  });
  const hydrated = true;
  useEffect(() => { if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state, hydrated]);

  const store = useMemo<Store>(() => ({ ...state,
    addBook: (book) => setState((current) => current.library.some((item) => item.id === book.id) ? current : { ...current, library: [{ ...book, progress: book.progress ?? 0, addedAt: new Date().toISOString(), edition: "Paperback · English" }, ...current.library], events: [{ type: "book_added", bookId: book.id, createdAt: new Date().toISOString() }, ...current.events] }),
    updateBook: (id, patch) => setState((current) => ({ ...current, library: current.library.map((book) => book.id === id ? { ...book, ...patch } : book), events: [{ type: patch.status === "Finished" ? "book_finished" : "progress_updated", bookId: id, createdAt: new Date().toISOString() }, ...current.events] })),
    removeBook: (id) => setState((current) => ({ ...current, library: current.library.filter((book) => book.id !== id), events: [{ type: "book_removed", bookId: id, createdAt: new Date().toISOString() }, ...current.events] })),
    addJournal: (entry) => setState((current) => ({ ...current, journal: [{ ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...current.journal], events: [{ type: "journal_created", bookId: entry.bookId, createdAt: new Date().toISOString() }, ...current.events] })),
    addGoal: (goal) => setState((current) => ({ ...current, goals: [{ ...goal, id: crypto.randomUUID() }, ...current.goals] })),
    toggleSaved: (id) => setState((current) => ({ ...current, savedBookIds: current.savedBookIds.includes(id) ? current.savedBookIds.filter((bookId) => bookId !== id) : [...current.savedBookIds, id] })),
    addCircle: (circle) => setState((current) => ({ ...current, circles: [{ ...circle, id: crypto.randomUUID() }, ...current.circles] })),
    resetLocalData: () => setState(initialState),
  }), [state]);
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useBookloom() { const store = useContext(StoreContext); if (!store) throw new Error("useBookloom must be used inside LocalStoreProvider"); return store; }
export function getBookById(id: number) { return seedBooks.find((book) => book.id === id); }
