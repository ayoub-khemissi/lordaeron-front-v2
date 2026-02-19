import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";

const locales = routing.locales;

const shopCategories = [
  "services",
  "bags",
  "heirlooms",
  "transmog",
  "mounts",
  "tabards",
  "pets",
  "toys",
];

type PageEntry = {
  path: string;
  priority: number;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
};

const pages: PageEntry[] = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/how-to", priority: 0.8, changeFrequency: "monthly" },
  { path: "/features", priority: 0.8, changeFrequency: "monthly" },
  { path: "/shop", priority: 0.7, changeFrequency: "weekly" },
  { path: "/branding", priority: 0.3, changeFrequency: "yearly" },
  ...shopCategories.map(
    (cat): PageEntry => ({
      path: `/shop/${cat}`,
      priority: 0.6,
      changeFrequency: "weekly",
    }),
  ),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      const languages: Record<string, string> = {};

      for (const loc of locales) {
        languages[loc] = `${siteConfig.baseUrl}/${loc}${page.path}`;
      }
      languages["x-default"] = `${siteConfig.baseUrl}/en${page.path}`;

      entries.push({
        url: `${siteConfig.baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages },
      });
    }
  }

  return entries;
}
