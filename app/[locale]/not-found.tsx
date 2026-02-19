import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const t = await getTranslations("common");

  return (
    <div
      className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_Icecrown_008_1080p_png_jpgcopy.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-wow-darker/80 via-wow-darker/90 to-wow-darker" />

      <div className="relative z-10 text-center px-6 max-w-lg">
        <p className="text-[10rem] leading-none font-black wow-gradient-text drop-shadow-[0_0_40px_rgba(180,140,60,0.3)]">
          404
        </p>

        <div className="shimmer-line w-24 mx-auto my-6" />

        <h1 className="text-3xl font-heading text-gray-100 mb-3">
          {t("notFoundTitle")}
        </h1>
        <p className="text-gray-400 mb-10 leading-relaxed">
          {t("notFoundDesc")}
        </p>

        <Link
          className="inline-block glass-gold glow-gold-strong rounded-full px-10 py-3.5 text-wow-gold font-bold text-sm tracking-wide uppercase hover:brightness-125 transition-all duration-300"
          href="/"
        >
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
