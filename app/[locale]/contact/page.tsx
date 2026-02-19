import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { ContactContent } from "./contact-content";

import { JsonLd } from "@/components/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.contact" });

  return buildPageMetadata(locale, "/contact", {
    title: t("title"),
    description: t("description"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_Icecrown_008_1080p_png_jpgcopy.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-wow-darker/90" />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: `${siteConfig.baseUrl}/${locale}`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Contact",
              item: `${siteConfig.baseUrl}/${locale}/contact`,
            },
          ],
        }}
      />

      <div className="relative container mx-auto max-w-7xl px-6 py-16">
        <ContactContent />
      </div>
    </div>
  );
}
