import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuyTrack — Net Monitor Premium",
  description: "Surveillance de consommation internet nouvelle génération",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col" style={{ background: 'var(--bg-primary)' }}>
        {children}
      </body>
    </html>
  );
}
