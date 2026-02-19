import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { HeroBanner, heroBackgrounds } from "@/components/hero-banner";
import { ServerStatus } from "@/components/server-status";
import { ServerStats } from "@/components/server-stats";
import { NewsSection } from "@/components/news-section";
import { JsonLd } from "@/components/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });

  return buildPageMetadata(locale, "", {
    title: t("title"),
    description: t("description"),
  });
}

export const dynamic = "force-dynamic";

export default function HomePage() {
  const bgImage =
    heroBackgrounds[Math.floor(Math.random() * heroBackgrounds.length)];

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.name,
          url: siteConfig.baseUrl,
          description: siteConfig.description,
          potentialAction: {
            "@type": "SearchAction",
            target: `${siteConfig.baseUrl}/en/shop?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.baseUrl,
          logo: `${siteConfig.baseUrl}/img/og/og-default.png`,
          sameAs: [siteConfig.links.discord],
        }}
      />
      <HeroBanner bgImage={bgImage} />
      <div className="flex justify-center mt-6 relative z-10">
        <ServerStatus />
      </div>
      <ServerStats />
      <NewsSection />
    </div>
  );
}
