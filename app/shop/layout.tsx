import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop - BeAFox Merchandise",
  description:
    "Entdecke unser exklusives BeAFox Merchandise - T-Shirts, Hoodies, Tassen, Sticker und mehr. Zeige deine BeAFox-Leidenschaft!",
  keywords: [
    "BeAFox Merch",
    "BeAFox Shop",
    "BeAFox Merchandise",
    "Finanzbildung Merch",
    "BeAFox T-Shirt",
    "BeAFox Hoodie",
  ],
  openGraph: {
    title: "Shop - BeAFox Merchandise",
    description:
      "Entdecke unser exklusives BeAFox Merchandise - T-Shirts, Hoodies, Tassen, Sticker und mehr.",
    url: "https://beafox.app/shop",
    type: "website",
  },
  alternates: {
    canonical: "https://beafox.app/shop",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

