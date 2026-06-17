import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GameVault | 15 Oyun",
  description: "Snake, Tetris, 2048, Minesweeper və daha çoxu!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}