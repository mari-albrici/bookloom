import type { Metadata } from "next";
import { LocalStoreProvider } from "@/lib/local-store";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bookloom | Books are more than stars",
  description: "A more meaningful reading journey.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><LocalStoreProvider>{children}</LocalStoreProvider></body>
    </html>
  );
}
