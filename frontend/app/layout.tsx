import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StellarApp | NASA Microgravity Fire Safety & AI Combustion Intelligence",
  description: "Interactive AI dashboard interpreting NASA microgravity flame experiments for Moon and Mars exploration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
