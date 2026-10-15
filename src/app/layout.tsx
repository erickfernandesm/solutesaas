import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mesmas fontes do site da Solute RH, auto-hospedadas (arquivos variáveis).
const sora = localFont({
  src: "../fonts/sora-latin.woff2",
  weight: "100 800",
  variable: "--font-sora",
  display: "swap",
});
const inter = localFont({
  src: "../fonts/inter-latin.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Sistemas Solute RH", template: "%s | Sistemas Solute RH" },
  description:
    "Solute Gestão, Solute Ponto, Solute Recruta e Solute Forms. Os sistemas da Solute RH para organizar equipes, controlar o ponto, conduzir processos seletivos e ouvir pessoas.",
  icons: { icon: "/assets/favicon.png" },
  openGraph: { locale: "pt_BR", type: "website", siteName: "Sistemas Solute RH" },
};

export const viewport: Viewport = { themeColor: "#060607", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${inter.variable}`}>
      <body className="font-sans text-[16px] leading-[1.6]">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
