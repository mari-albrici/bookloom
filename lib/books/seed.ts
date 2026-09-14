export type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
  mood: string;
  status: "Reading" | "Want to read" | "Finished" | "Paused" | "DNF" | "Re-reading";
  color: string;
  progress?: number;
  quote?: string;
  provider?: "seed" | "openlibrary" | "google-books";
  providerId?: string;
  isbn10?: string;
  isbn13?: string;
  pages?: number;
  publishedYear?: number;
  description?: string;
  coverUrl?: string;
};

export const books: Book[] = [
  { id: 1, title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", genre: "Speculative fiction", mood: "Atmospheric", status: "Reading", progress: 64, color: "#b9c7bb", quote: "Light is the left hand of darkness.", provider: "seed", providerId: "seed-left-hand" },
  { id: 2, title: "Sea of Tranquility", author: "Emily St. John Mandel", genre: "Literary fiction", mood: "Time-bending", status: "Want to read", color: "#d2baa7", provider: "seed", providerId: "seed-sea-tranquility" },
  { id: 3, title: "Braiding Sweetgrass", author: "Robin Wall Kimmerer", genre: "Nature writing", mood: "Reflective", status: "Finished", progress: 100, color: "#b7c8b3", provider: "seed", providerId: "seed-braiding-sweetgrass" },
  { id: 4, title: "Piranesi", author: "Susanna Clarke", genre: "Fantasy", mood: "Dreamlike", status: "Want to read", color: "#c7b6c5", provider: "seed", providerId: "seed-piranesi" },
];
