import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { NewsList } from "@/components/news-list";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default function NewsPage() {
  const t = useTranslations("news");

  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold wow-gradient-text mb-3">
          {t("title")}
        </h1>
        <p className="text-gray-400">{t("subtitle")}</p>
        <div className="shimmer-line w-24 mx-auto mt-3" />
      </div>
      <NewsList />
    </div>
  );
}
