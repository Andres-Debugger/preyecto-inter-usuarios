import type { Metadata } from "next";
import "./globals.css";
import { PaletteProvider } from "@/context/PaletteContext";
import PaletteStyles from "@/components/PaletteStyles";

export const metadata: Metadata = {
  title: "Brillo & Co | Fine Jewelry",
  description:
    "Discover exquisite jewelry inspired by timeless elegance. A touch of grace for your most cherished moments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <PaletteProvider>
          <PaletteStyles />
          {children}
        </PaletteProvider>
      </body>
    </html>
  );
}
