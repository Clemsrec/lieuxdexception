import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lieux d'Exception",
  description: "Site vitrine des lieux d'exception",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}