import type { Metadata } from "next";

import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";

const ogLocaleMap: Record<string, string> = {
  en: "en_US",
  fr: "fr_FR",
  es: "es_ES",
  de: "de_DE",
  it: "it_IT",
};

export function buildPageMetadata(
  locale: string,
  path: string,
  overrides: Metadata = {},
): Metadata {
  const canonical = `${siteConfig.baseUrl}/${locale}${path}`;

  const languages: Record<string, string> = {
    "x-default": `${siteConfig.baseUrl}/en${path}`,
  };

  for (const loc of routing.locales) {
    languages[loc] = `${siteConfig.baseUrl}/${loc}${path}`;
  }

  const alternateLocale = routing.locales
    .filter((l) => l !== locale)
    .map((l) => ogLocaleMap[l] || l);

  return {
    ...overrides,
    alternates: {
      canonical,
      languages,
      ...overrides.alternates,
    },
    openGraph: {
      url: canonical,
      locale: ogLocaleMap[locale] || locale,
      alternateLocale,
      ...(typeof overrides.openGraph === "object" ? overrides.openGraph : {}),
    },
  };
}
