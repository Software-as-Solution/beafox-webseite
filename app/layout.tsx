import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CookieBanner from "@/components/CookieBanner";
import SnipcartProvider from "@/components/SnipcartProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://beafox.app"),
  title: {
    default: "BeAFox - Finanzbildungs-Ökosystem für junge Menschen",
    template: "%s | BeAFox",
  },
  description:
    "Digitale Finanzbildungsplattform für junge Menschen: Finanzbildung App für Privatnutzer, Finanzbildung für Unternehmen und Finanzbildung für Schulen. Spielerische Lern-App mit Finanzbildung für Azubis, Finanzbildung im Schulunterricht und Finanzbildung für Vereine.",
  keywords: [
    "Finanzbildung",
    "Finanzbildung App",
    "digitale Finanzbildung",
    "Finanzbildung für Unternehmen",
    "Finanzbildung für Schulen",
    "Finanzbildung für Azubis",
    "Finanzbildung im Schulunterricht",
    "Finanzbildung Schüler",
    "Finanzbildung für Vereine",
    "Finanzbildung für Jugendvereine",
    "Finanzbildung Community",
    "Lern-App für Finanzen",
    "Finanz-App Premium",
    "Finanzwissen lernen",
    "Geld lernen",
    "Finanztraining Azubis",
    "digitale Lernplattform",
    "spielerische Lernplattform",
    "gamification lernen",
    "BeAFox",
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
      // Hauptfavicon - Logo.png als Browser-Tab Icon
      { url: "/Logo.png", sizes: "any", type: "image/png" },
      // Fallback auf Standard-Favicons, falls vorhanden
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
      // Fallback auf Logo.png
      { url: "/Logo.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/Logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <body className="antialiased bg-primaryWhite">
        <NextIntlClientProvider locale={locale} messages={messages}>
        {/* Google Analytics - wird nur geladen wenn Cookie-Consent gegeben wurde */}
        <Script
          id="google-analytics-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              // Prüfe Cookie-Consent
              const cookieConsent = localStorage.getItem('cookieConsent');
              if (cookieConsent) {
                try {
                  const preferences = JSON.parse(cookieConsent);
                  if (preferences.analytics) {
                    // Lade Google Analytics Script
                    const script = document.createElement('script');
                    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-J0GWX92CNH';
                    script.async = true;
                    document.head.appendChild(script);
                    
                    // Konfiguriere Google Analytics
                    gtag('consent', 'default', {
                      'analytics_storage': 'granted'
                    });
                    gtag('config', 'G-J0GWX92CNH');
                  } else {
                    // Analytics abgelehnt
                    gtag('consent', 'default', {
                      'analytics_storage': 'denied'
                    });
                  }
                } catch (e) {
                  // Fallback: Analytics standardmäßig deaktiviert
                  gtag('consent', 'default', {
                    'analytics_storage': 'denied'
                  });
                }
              } else {
                // Noch keine Entscheidung: Analytics deaktiviert bis Consent
                gtag('consent', 'default', {
                  'analytics_storage': 'denied'
                });
              }
            `,
          }}
        />

        {/* Ahrefs Analytics */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="6IuvzSgHsLDI1sabZKDkjA"
          strategy="afterInteractive"
        />

        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ScrollToTop />
        <CookieBanner />
        <SnipcartProvider />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
