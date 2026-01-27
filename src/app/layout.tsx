import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { getMainArtistWithFallback } from "@/services/artists";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ArtistOne - Music Artist Portfolio",
  description: "Professional music artist portfolio",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const artist = await getMainArtistWithFallback();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable}`}>
        <ThemeProvider>
          <div className="viewport-frame" aria-hidden="true" />
          <Navbar 
            avatarUrl={artist.avatarUrl ?? undefined}
            name={artist.name}
            role={artist.role}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
