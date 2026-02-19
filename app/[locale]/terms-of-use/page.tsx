import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { LegalAccordion } from "@/components/legal-accordion";
import { JsonLd } from "@/components/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

const sectionKeys = [
  "acceptance",
  "access",
  "account",
  "conduct",
  "ip",
  "liability",
  "termination",
  "modifications",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.cgu" });

  return buildPageMetadata(locale, "/terms-of-use", {
    title: t("title"),
    description: t("description"),
  });
}

export default async function CguPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
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
              name: "Terms of Use",
              item: `${siteConfig.baseUrl}/${locale}/terms-of-use`,
            },
          ],
        }}
      />
      <LegalAccordion namespace="cgu" sectionKeys={sectionKeys} />
    </>
  );
}
