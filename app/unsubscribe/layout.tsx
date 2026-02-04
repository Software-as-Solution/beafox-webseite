import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter abmelden",
  description:
    "Vom BeAFox-Newsletter abmelden. Wir benachrichtigen info@beafox.app, damit du aus dem Verteiler entfernt wirst.",
  robots: "noindex, nofollow",
};

export default function UnsubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
