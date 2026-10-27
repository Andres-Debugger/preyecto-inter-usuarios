import "cropperjs/dist/cropper.css";
import type { Metadata } from "next";
import "./globals.css";
import { PaletteProvider } from "@/context/PaletteContext";
import { TypographyProvider } from "@/context/TypographyContext";
import { CVCProvider } from "@/context/CVCContext";
import { TangramProvider } from "@/context/TangramContext";
import { ToastProvider } from "@/components/Toast";
import { VideoProvider } from "@/context/VideoContext";
import { GalleryProvider } from "@/context/GalleryContext";
import PaletteStyles from "@/components/PaletteStyles";
import PageTransition from "@/components/PageTransition";
import { PAGE_LOADER_STORAGE_KEY } from "@/utils/loaderPreference";

const loaderPreferenceScript = `try{if(localStorage.getItem('${PAGE_LOADER_STORAGE_KEY}')==='off'){document.documentElement.dataset.pageLoader='off'}}catch(e){}`;

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
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: loaderPreferenceScript }} />
      </head>
      <body className="min-h-screen">
        <PaletteProvider>
          <TypographyProvider>
            <CVCProvider>
              <TangramProvider>
                <ToastProvider>
                  <VideoProvider>
                    <GalleryProvider>
                      <PaletteStyles />
                      <PageTransition />
                      {children}
                    </GalleryProvider>
                  </VideoProvider>
                </ToastProvider>
              </TangramProvider>
            </CVCProvider>
          </TypographyProvider>
        </PaletteProvider>
      </body>
    </html>
  );
}
