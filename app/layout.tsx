import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display, DM_Sans } from "next/font/google";
import Providers from "./providers";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Optimasi render font (Mencegah CLS/FOIT)
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// Viewport dipisah dari Metadata sesuai standar Next.js 15
export const viewport: Viewport = {
  themeColor: "#ffffff", // Sesuaikan dengan warna dominan background Cardify lu
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://cardify-web-kappa.vercel.app"), // Ganti dengan domain asli nanti
  title: {
    default: "Cardify — Digital Greeting Card & Photobooth Maker", // Menargetkan keyword utama dalam bahasa Inggris
    template: "%s | Cardify", // Halaman lain otomatis jadi "Nama Halaman | Cardify"
  },
  description:
    "Buat kartu ucapan digital yang personal dan berkesan. Online creator for aesthetic greeting cards, photostrips, birthday cards, and wedding invitations.",
  keywords: [
    "Cardify",
    "greeting card maker",
    "digital greeting card",
    "online greeting card",
    "create greeting card",
    "birthday card maker",
    "aesthetic greeting card",
    "photobooth online",
    "photostrip maker",
    "online photobooth",
    "graduation card",
    "wedding card maker",
  ],
  authors: [{ name: "Cardify Team" }],
  creator: "Cardify",
  publisher: "Cardify",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US", // Ganti ke id_ID jika target utamanya hanya Indonesia
    url: "/",
    title: "Cardify — Aesthetic Digital Greeting Card & Photobooth Maker",
    description:
      "Create beautiful digital greeting cards and aesthetic photobooth strips instantly. Buat memori tak terlupakan bersama Cardify.",
    siteName: "Cardify",
    images: [
      {
        url: "/og-image.jpg", // Pastikan lu buat desain banner 1200x630 dan taruh di folder /public
        width: 1200,
        height: 630,
        alt: "Cardify - Aesthetic Digital Greeting Card Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cardify — Digital Greeting Card & Photobooth Maker",
    description: "Create beautiful digital greeting cards and aesthetic photobooth strips instantly.",
    images: ["/og-image.jpg"], 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  verification: {
    google: "A3gLShkxD4zgasfXrEUnJ1cvalZoNi3j4XzGVEeNV68",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en" // Jika lu fokus pasar Indo, ubah ini jadi "id"
      suppressHydrationWarning // Best practice Next.js untuk mencegah warning dari <Providers>
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${dmSans.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}