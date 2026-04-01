import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

const SUPPORTED_LOCALES = ["de", "en"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function normalizeLocale(input: string | null | undefined): SupportedLocale | null {
  if (!input) return null;
  const raw = input.trim().toLowerCase();
  // accept forms like "de", "de-de", "en-US"
  const base = raw.split(/[-_]/)[0];
  return (SUPPORTED_LOCALES as readonly string[]).includes(base)
    ? (base as SupportedLocale)
    : null;
}

function localeFromAcceptLanguage(value: string | null): SupportedLocale | null {
  if (!value) return null;
  // Example: "de-DE,de;q=0.9,en;q=0.8"
  const parts = value.split(",").map((p) => p.trim());
  for (const part of parts) {
    const lang = part.split(";")[0];
    const normalized = normalizeLocale(lang);
    if (normalized) return normalized;
  }
  return null;
}

const I18N_USAGE_META_KEY = "__i18nUsage";

export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = normalizeLocale(store.get("locale")?.value);

  const hdrs = await headers();
  const headerLocale = localeFromAcceptLanguage(hdrs.get("accept-language"));

  const locale: SupportedLocale = cookieLocale ?? headerLocale ?? "de";

  const raw = (await import(`../messages/${locale}.json`)).default as Record<
    string,
    unknown
  >;
  const { [I18N_USAGE_META_KEY]: _usage, ...messages } = raw;

  return {
    locale,
    messages,
  };
});

