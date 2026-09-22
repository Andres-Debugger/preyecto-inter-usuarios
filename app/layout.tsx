import type { Metadata } from "next";
import "./globals.css";
import { PaletteProvider } from "@/context/PaletteContext";
import { TypographyProvider } from "@/context/TypographyContext";
import { CVCProvider } from "@/context/CVCContext";
import { TangramProvider } from "@/context/TangramContext";
import { ToastProvider } from "@/components/Toast";
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
    <html lang="es">
      <body className="min-h-screen">
        <PaletteProvider>
          <TypographyProvider>
            <CVCProvider>
              <TangramProvider>
                <ToastProvider>
                  <PaletteStyles />
                  {children}
                </ToastProvider>
              </TangramProvider>
            </CVCProvider>
          </TypographyProvider>
        </PaletteProvider>
      </body>
    </html>
  );
}
