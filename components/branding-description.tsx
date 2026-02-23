"use client";

import { useTranslations } from "next-intl";

export const BrandingDescription = () => {
  const t = useTranslations("branding");

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-heading text-gray-300">
        {t("sectionTitle")}
      </h2>
      <div className="glass border border-wow-gold/10 rounded-2xl p-6 space-y-4 text-sm text-gray-300 leading-relaxed">
        <p>{t("desc1")}</p>
        <p>{t("desc2")}</p>
        <p>{t("desc3")}</p>
        <p>{t("desc4")}</p>
        <p className="text-wow-gold/60">
          www.lordaeron.eu &middot; set realmlist logon.lordaeron.eu
        </p>
      </div>
    </section>
  );
};
