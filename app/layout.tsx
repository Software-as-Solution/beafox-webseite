// IMPORTS
import Script from "next/script";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
// CUSTOM COMPONENTS
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CookieBanner from "@/components/CookieBanner";
import ShopCartProvider from "@/components/ShopCartProvider";
import ShopCart from "@/components/ShopCart";
// CSS
import "./globals.css";

// CONSTANTS
const GA_ID = "G-J0GWX92CNH";
const THEME_COLOR = "#E87720";
const BASE_URL = "https://beafox.app";
const AHREFS_KEY = "6IuvzSgHsLDI1sabZKDkjA";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const GA_INIT_SCRIPT = `
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());
try{var c=JSON.parse(localStorage.getItem('cookieConsent')||'{}');
if(c.analytics){var s=document.createElement('script');s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';s.async=true;document.head.appendChild(s);
gtag('consent','default',{'analytics_storage':'granted'});gtag('config','${GA_ID}')}
else{gtag('consent','default',{'analytics_storage':'denied'})}}
catch(e){gtag('consent','default',{'analytics_storage':'denied'})}`;

export async function generateMetadata(): Promise<Metadata> {
  // HOOKS
  const locale = await getLocale();
  const t = await getTranslations("rootMeta");
  // CONSTANTS
  const keywords = (t.raw("keywords") as string[]) ?? [];

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: t("title"),
      template: `%s | BeAFox`,
    },
    description: t("description"),
    keywords,
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
      locale: locale === "de" ? "de_DE" : "en_US",
      url: BASE_URL,
      siteName: "BeAFox",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [
        {
          url: "/assets/og-image.jpg",
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
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
    alternates: {
      canonical: BASE_URL,
      languages: {
        "de-DE": BASE_URL,
      },
    },
    other: {
      "theme-color": THEME_COLOR,
    },
    icons: {
      icon: [
        { url: "/Logo.png", sizes: "any", type: "image/png" },
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // HOOKS
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        {/* Preconnects for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          crossOrigin="anonymous"
          href="https://fonts.gstatic.com"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        {/* Hreflang — DE is primary, self-referencing */}
        <link rel="alternate" hrefLang="de" href={BASE_URL} />
        <link rel="alternate" hrefLang="x-default" href={BASE_URL} />
      </head>
      <body className="antialiased bg-primaryWhite">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Google Analytics */}
          <Script
            id="ga-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: GA_INIT_SCRIPT }}
          />
          {/* Ahrefs Analytics */}
          <Script
            data-key={AHREFS_KEY}
            strategy="afterInteractive"
            src="https://analytics.ahrefs.com/analytics.js"
          />
          <ShopCartProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <ShopCart />
            <Footer />
          </ShopCartProvider>
          <ScrollToTop />
          <CookieBanner />
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
