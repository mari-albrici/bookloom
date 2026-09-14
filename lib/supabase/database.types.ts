export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Row<T> = T;
type Insert<T> = Partial<Omit<T, "id" | "created_at" | "updated_at">> & Partial<Pick<T, Extract<keyof T, "id" | "created_at" | "updated_at">>>;
type Update<T> = Partial<Omit<T, "created_at" | "updated_at">> & Partial<Pick<T, Extract<keyof T, "updated_at">>>;

type Profile = {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  profile_visibility: "private" | "followers" | "public";
  created_at: string;
  updated_at: string;
};

type Work = {
  id: string;
  title: string;
  authors: string[];
  provider: "openlibrary" | "google-books";
  provider_id: string;
  subtitle: string | null;
  description: string | null;
  first_published_year: number | null;
  editorial_source: string | null;
  created_at: string;
};

type Edition = {
  id: string;
  work_id: string;
  isbn10: string | null;
  isbn13: string | null;
  publisher: string | null;
  publication_date: string | null;
  language: string | null;
  pages: number | null;
  cover_url: string | null;
  format: string | null;
  is_canonical: boolean;
  created_at: string;
};

type UserBook = {
  id: string;
  user_id: string;
  work_id: string;
  edition_id: string | null;
  status: "want_to_read" | "reading" | "read" | "paused" | "dnf" | "rereading";
  visibility: "private" | "followers" | "public";
  started_at: string | null;
  finished_at: string | null;
  progress_pages: number;
  progress_percent: number;
  reread_count: number;
  created_at: string;
  updated_at: string;
};

type Rating = {
  id: string;
  user_id: string;
  work_id: string;
  overall: number;
  dimensions: Json;
  expectation: "low" | "medium" | "high" | null;
  outcome: "below" | "met" | "exceeded" | null;
  origin: "organic" | "community" | "editorial" | "derived" | "sponsored";
  created_at: string;
  updated_at: string;
};

type JournalEntry = {
  id: string;
  user_id: string;
  work_id: string | null;
  entry_type: "note" | "quote" | "thought" | "prediction" | "character_note" | "favorite_passage" | "progress_update";
  body: string;
  page: number | null;
  chapter: string | null;
  progress_percent: number | null;
  is_private: boolean;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Row<Profile>; Insert: Insert<Profile>; Update: Update<Profile>; Relationships: [] };
      works: { Row: Row<Work>; Insert: Insert<Work>; Update: Update<Work>; Relationships: [] };
      editions: { Row: Row<Edition>; Insert: Insert<Edition>; Update: Update<Edition>; Relationships: [] };
      user_books: { Row: Row<UserBook>; Insert: Insert<UserBook>; Update: Update<UserBook>; Relationships: [] };
      ratings: { Row: Row<Rating>; Insert: Insert<Rating>; Update: Update<Rating>; Relationships: [] };
      journal_entries: { Row: Row<JournalEntry>; Insert: Insert<JournalEntry>; Update: Update<JournalEntry>; Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      reading_status: UserBook["status"];
      visibility: Profile["profile_visibility"];
      data_origin: Rating["origin"];
    };
    CompositeTypes: Record<string, never>;
  };
};
