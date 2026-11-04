import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AquaZen Piscinas | Sua piscina em perfeito equilíbrio",
  description:
    "Limpeza, manutenção e tratamento profissional para piscinas residenciais e comerciais. Cuidado para aproveitar a piscina durante todo o ano.",
  applicationName: "AquaZen Piscinas",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "AquaZen Piscinas | Sua piscina em perfeito equilíbrio",
    description:
      "Limpeza, manutenção e tratamento profissional para você aproveitar o melhor da sua piscina.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
