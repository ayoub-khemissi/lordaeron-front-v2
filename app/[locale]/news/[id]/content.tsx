"use client";

import type { News } from "@/types";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import NextLink from "next/link";

import { MarkdownRenderer } from "@/components/markdown-renderer";

interface Props {
  id: string;
  locale: string;
}

export function NewsArticleContent({ id, locale }: Props) {
  const t = useTranslations("news");
  const [article, setArticle] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/news/${id}?locale=${locale}`);
        const data = await res.json();

        setArticle(data.article || null);
      } catch {
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, locale]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner color="warning" size="lg" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 mb-4">{t("noNews")}</p>
        <Button
          as={NextLink}
          className="text-wow-gold border-wow-gold/30"
          href={`/${locale}/news`}
          variant="bordered"
        >
          {t("backToNews")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      <Button
        as={NextLink}
        className="text-wow-gold border-wow-gold/30 mb-8"
        href={`/${locale}/news`}
        size="sm"
        variant="bordered"
      >
        ← {t("backToNews")}
      </Button>

      {article.image_url && (
        <div className="rounded-2xl overflow-hidden mb-8 border border-wow-gold/10">
          <img
            alt={article.title}
            className="w-full h-auto max-h-[400px] object-cover"
            src={article.image_url}
          />
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl font-bold wow-gradient-text mb-4">
        {article.title}
      </h1>

      <div className="flex items-center gap-3 text-sm text-gray-400 mb-8">
        <span>
          {t("by")} {article.author_name}
        </span>
        <span>·</span>
        <span>{new Date(article.published_at).toLocaleDateString(locale)}</span>
      </div>

      <div className="glass rounded-2xl p-8 border-wow-gold/10">
        <MarkdownRenderer content={article.content} />
      </div>
    </div>
  );
}
