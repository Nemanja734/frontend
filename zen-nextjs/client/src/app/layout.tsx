import type { Metadata } from "next";
import "./globals.css";
import { geistSans } from "@/config/data/fonts";

export const metadata: Metadata = {
  title: "Zen Tattoo | Das digitale Tattoostudio",
  description: "Entdecke talentierte Tätowierer aus ganz Deutschland, vergleiche ihre Portfolios und buche dein Wunsch-Tattoo bequem über das Internet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={geistSans.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
