import type { SupabaseClient } from "@supabase/supabase-js";
import type { NormalizedBook } from "@/lib/books/types";
import type { Database } from "@/lib/supabase/database.types";

export type BookloomSupabaseClient = SupabaseClient<Database>;

function assertNoError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function getCurrentUserId(client: BookloomSupabaseClient) {
  const { data, error } = await client.auth.getUser();
  assertNoError(error);
  return data.user?.id ?? null;
}

export async function upsertProfile(
  client: BookloomSupabaseClient,
  profile: { id: string; username: string; displayName: string; bio?: string },
) {
  const { data, error } = await client
    .from("profiles")
    .upsert({
      id: profile.id,
      username: profile.username,
      display_name: profile.displayName,
      bio: profile.bio ?? null,
    })
    .select()
    .single();
  assertNoError(error);
  return data;
}

export async function upsertWork(client: BookloomSupabaseClient, book: NormalizedBook) {
  if (!book.providerId) throw new Error("Cannot persist a book without a provider id.");

  const { data, error } = await client
    .from("works")
    .upsert({
      title: book.title,
      authors: book.authors,
      provider: book.provider,
      provider_id: book.providerId,
      description: book.description ?? null,
      first_published_year: book.publishedYear ?? null,
    }, { onConflict: "provider,provider_id" })
    .select()
    .single();
  assertNoError(error);
  return data;
}

export async function upsertEdition(client: BookloomSupabaseClient, workId: string, book: NormalizedBook) {
  if (!book.isbn10 && !book.isbn13) return null;

  const { data, error } = await client
    .from("editions")
    .upsert({
      work_id: workId,
      isbn10: book.isbn10 ?? null,
      isbn13: book.isbn13 ?? null,
      language: book.language ?? null,
      pages: book.pages ?? null,
      cover_url: book.coverUrl ?? null,
      is_canonical: true,
    }, { onConflict: book.isbn13 ? "work_id,isbn13" : "work_id,isbn10" })
    .select()
    .single();
  assertNoError(error);
  return data;
}

export async function addJournalEntry(
  client: BookloomSupabaseClient,
  entry: {
    workId?: string;
    type: "note" | "quote" | "thought" | "prediction" | "character_note" | "favorite_passage" | "progress_update";
    body: string;
    page?: number;
    chapter?: string;
    progressPercent?: number;
    isPrivate?: boolean;
  },
) {
  const userId = await getCurrentUserId(client);
  if (!userId) throw new Error("You must be signed in to save a journal entry.");

  const { data, error } = await client
    .from("journal_entries")
    .insert({
      user_id: userId,
      work_id: entry.workId ?? null,
      entry_type: entry.type,
      body: entry.body,
      page: entry.page ?? null,
      chapter: entry.chapter ?? null,
      progress_percent: entry.progressPercent ?? null,
      is_private: entry.isPrivate ?? true,
    })
    .select()
    .single();
  assertNoError(error);
  return data;
}
