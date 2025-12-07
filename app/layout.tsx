import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://beafox.app"),
  title: {
    default: "BeAFox - Finanzbildungs-Ökosystem für junge Menschen",
    template: "%s | BeAFox",
  },
  description:
    "Das erste unabhängige, spielerische Lern-App für Finanzbildung junger Menschen. Speziell für Schulen und Ausbildungsbetriebe entwickelt.",
  keywords: [
    "Finanzbildung",
    "Finanzkompetenz",
    "Finanzwissen",
    "Schule",
    "Ausbildung",
    "App",
    "Finanzbildung App",
    "Finanzwissen lernen",
    "Geld lernen",
    "Finanzkompetenz für Jugendliche",
    "BeAFox",
    "Finanzbildung für Schulen",
    "Finanzbildung für Unternehmen",
  ],
  authors: [{ name: "BeAFox UG (haftungsbeschränkt)" }],
  creator: "BeAFox",
  publisher: "BeAFox UG (haftungsbeschränkt)",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://beafox.app",
    siteName: "BeAFox",
    title: "BeAFox - Finanzbildungs-Ökosystem für junge Menschen",
    description:
      "Das erste unabhängige, spielerische Lern-App für Finanzbildung junger Menschen. Speziell für Schulen und Ausbildungsbetriebe entwickelt.",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BeAFox - Finanzbildungs-Ökosystem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BeAFox - Finanzbildungs-Ökosystem für junge Menschen",
    description:
      "Das erste unabhängige, spielerische Lern-App für Finanzbildung junger Menschen.",
    images: ["/assets/og-image.jpg"],
    creator: "@beafox_app",
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
  verification: {
    // Google Search Console
    // google: "your-google-verification-code",
    // Bing Webmaster Tools
    // other: "your-bing-verification-code",
  },
  alternates: {
    canonical: "https://beafox.app",
  },
  icons: {
    icon: [
      { url: "/assets/Logo-EST.jpg", sizes: "any" },
      { url: "/assets/Logo.jpg", sizes: "any" },
    ],
    apple: [{ url: "/assets/Logo-EST.jpg", sizes: "180x180" }],
    shortcut: "/assets/Logo-EST.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="antialiased bg-primaryWhite">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J0GWX92CNH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J0GWX92CNH');
          `}
        </Script>

        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
