import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "./components/site-header";

const avenirLTPro = localFont({
  src: [
    {
      path: "../public/fonts/avenir/AvenirLTProLight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/avenir/AvenirLTProLightOblique.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/avenir/AvenirLTProBook.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/avenir/AvenirLTProBookOblique.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/avenir/AvenirLTProRoman.otf",
      weight: "450",
      style: "normal",
    },
    {
      path: "../public/fonts/avenir/AvenirLTProOblique.otf",
      weight: "450",
      style: "italic",
    },
    {
      path: "../public/fonts/avenir/AvenirLTProMedium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/avenir/AvenirLTProMediumOblique.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/avenir/AvenirLTProHeavy.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/avenir/AvenirLTProHeavyOblique.otf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../public/fonts/avenir/AvenirLTProBlack.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/avenir/AvenirLTProBlackOblique.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

const avenirHeading = localFont({
  src: [
    {
      path: "../public/fonts/avenir/AvenirLTProHeavy.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/avenir/AvenirLTProBlack.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LabBio Archivo Científico",
  description:
    "Repositorio digital para cargar, clasificar y consultar papers de biología.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${avenirLTPro.variable} ${avenirHeading.variable} antialiased`}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
