import { getTranslations } from "next-intl/server";

import { NewsArticleContent } from "./content";

import { getNewsById } from "@/lib/queries/news";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const article = await getNewsById(parseInt(id));

  if (!article) {
    const t = await getTranslations({ locale, namespace: "news" });

    return { title: t("title") };
  }

  const title =
    (article[`title_${locale}` as keyof typeof article] as string) ||
    article.title_en;
  const content =
    (article[`content_${locale}` as keyof typeof article] as string) ||
    article.content_en;

  return {
    title,
    description: content.replace(/[#*`>\-\[\]()!]/g, "").slice(0, 160),
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  return <NewsArticleContent id={id} locale={locale} />;
}
