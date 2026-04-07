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
import ShopCart from "@/components/ShopCart";
import ScrollToTop from "@/components/ScrollToTop";
import CookieBanner from "@/components/CookieBanner";
import ShopCartProvider from "@/components/ShopCartProvider";
// CSS
import "./globals.css";

// CONSTANTS
const GA_ID = "G-J0GWX92CNH";
const THEME_COLOR = "#E87720";
const BASE_URL = "https://beafox.app";
const AHREFS_KEY = "6IuvzSgHsLDI1sabZKDkjA";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ANALYTICS_INIT_SCRIPT = `
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());
try{var c=JSON.parse(localStorage.getItem('cookieConsent')||'{}');
if(c&&c.preferences&&c.preferences.analytics){
var s=document.createElement('script');s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';s.async=true;document.head.appendChild(s);
gtag('consent','default',{'analytics_storage':'granted'});gtag('config','${GA_ID}');
var a=document.createElement('script');a.src='https://analytics.ahrefs.com/analytics.js';a.async=true;a.dataset.key='${AHREFS_KEY}';document.head.appendChild(a)}
else{gtag('consent','default',{'analytics_storage':'denied'})}}
catch(e){gtag('consent','default',{'analytics_storage':'denied'})}`;

export async function generateMetadata(): Promise<Metadata> {
  // HOOKS
  const locale = await getLocale();
  const t = await getTranslations("rootMeta");
  // CONSTANTS
  const keywords = (t.raw("keywords") as string[]) ?? [];

  return {
    keywords,
    creator: "BeAFox",
    description: t("description"),
    metadataBase: new URL(BASE_URL),
    publisher: "BeAFox UG (haftungsbeschränkt)",
    authors: [{ name: "BeAFox UG (haftungsbeschränkt)" }],
    title: {
      default: t("title"),
      template: `%s | BeAFox`,
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      url: BASE_URL,
      type: "website",
      siteName: "BeAFox",
      title: t("ogTitle"),
      description: t("ogDescription"),
      locale: locale === "de" ? "de_DE" : "en_US",
      images: [
        {
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
          url: "/assets/og-image.webp",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@beafox_app",
      title: t("twitterTitle"),
      images: ["/assets/og-image.webp"],
      description: t("twitterDescription"),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-video-preview": -1,
        "max-image-preview": "large",
      },
    },
    alternates: {
      canonical: BASE_URL,
      languages: {
        "de-DE": BASE_URL,
      },
    },
    icons: {
      shortcut: "/assets/Logos/Logo.webp",
      icon: { url: "/assets/Logos/Logo.webp", type: "image/png" },
      apple: { url: "/assets/Logos/Logo.webp", type: "image/png" },
    },
    themeColor: THEME_COLOR,
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
        <link rel="alternate" hrefLang="de" href={BASE_URL} />
        <link rel="alternate" hrefLang="en" href={BASE_URL} />
        <link rel="alternate" hrefLang="x-default" href={BASE_URL} />
      </head>
      <body className="antialiased bg-primaryWhite">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Analytics (GA4 + Ahrefs) – consent-gated */}
          <Script
            id="analytics-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: ANALYTICS_INIT_SCRIPT }}
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
