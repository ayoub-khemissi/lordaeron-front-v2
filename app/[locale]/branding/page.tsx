import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { ResizableBanner } from "@/components/resizable-banner";
import { BrandingDescription } from "@/components/branding-description";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.branding" });

  return buildPageMetadata(locale, "/branding", {
    title: t("title"),
    description: t("description"),
  });
}

export default function BrandingPage() {
  return (
    <div className="container mx-auto max-w-5xl px-6 py-16 space-y-16">
      <div className="text-center">
        <h1 className="text-4xl font-black wow-gradient-text mb-3">
          Branding — OG Image Preview
        </h1>
        <p className="text-gray-400 text-sm">
          Screenshot each card at exact dimensions and save as{" "}
          <code className="text-wow-gold">og-default.png</code> (1200x630) and{" "}
          <code className="text-wow-gold">og-twitter.png</code> (1200x600) in{" "}
          <code className="text-wow-gold">public/img/og/</code>
        </p>
      </div>

      {/* Server Description */}
      <BrandingDescription />

      {/* Resizable Banner — default 468x60 */}
      <section className="space-y-3">
        <h2 className="text-lg font-heading text-gray-300">
          Banner — <span className="text-wow-gold">468 x 60</span>
        </h2>
        <ResizableBanner />
      </section>

      {/* Open Graph Card — 1200x630 */}
      <section className="space-y-3">
        <h2 className="text-lg font-heading text-gray-300">
          Open Graph — <span className="text-wow-gold">1200 x 630</span>
        </h2>
        <div
          className="relative overflow-hidden border border-wow-gold/20"
          style={{ width: 1200, height: 630 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e14] via-[#111927] to-[#0a0e14]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(180,140,60,0.08),transparent_70%)]" />

          <div className="relative flex flex-col items-center justify-center h-full px-16 text-center">
            <div className="text-7xl font-black tracking-widest wow-gradient-text mb-6">
              {siteConfig.name.toUpperCase()}
            </div>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-wow-gold/60 to-transparent mb-6" />
            <p className="text-2xl text-gray-300 font-medium mb-8">
              {siteConfig.tagline}
            </p>
            <p className="text-lg text-wow-gold/60 tracking-wide">
              www.lordaeron.eu
            </p>
          </div>
        </div>
      </section>

      {/* Twitter Card — 1200x600 */}
      <section className="space-y-3">
        <h2 className="text-lg font-heading text-gray-300">
          Twitter Card — <span className="text-wow-gold">1200 x 600</span>
        </h2>
        <div
          className="relative overflow-hidden border border-wow-gold/20"
          style={{ width: 1200, height: 600 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e14] via-[#111927] to-[#0a0e14]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(180,140,60,0.08),transparent_70%)]" />

          <div className="relative flex flex-col items-center justify-center h-full px-16 text-center">
            <div className="text-6xl font-black tracking-widest wow-gradient-text mb-5">
              {siteConfig.name.toUpperCase()}
            </div>
            <div className="w-28 h-px bg-gradient-to-r from-transparent via-wow-gold/60 to-transparent mb-5" />
            <p className="text-xl text-gray-300 font-medium mb-6">
              {siteConfig.tagline}
            </p>
            <p className="text-base text-wow-gold/60 tracking-wide">
              www.lordaeron.eu
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
