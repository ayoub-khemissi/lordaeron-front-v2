"use client";

import type { NewsRow } from "@/types";

import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { Tabs, Tab } from "@heroui/tabs";
import { DatePicker } from "@heroui/date-picker";
import {
  now,
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const LOCALES = ["en", "fr", "es", "de", "it"] as const;

interface NewsFormProps {
  article?: NewsRow;
  onSubmit: (data: Record<string, unknown>) => void;
  loading: boolean;
}

export function NewsForm({ article, onSubmit, loading }: NewsFormProps) {
  const t = useTranslations("admin.news");

  const [titleEn, setTitleEn] = useState(article?.title_en || "");
  const [titleFr, setTitleFr] = useState(article?.title_fr || "");
  const [titleEs, setTitleEs] = useState(article?.title_es || "");
  const [titleDe, setTitleDe] = useState(article?.title_de || "");
  const [titleIt, setTitleIt] = useState(article?.title_it || "");

  const [contentEn, setContentEn] = useState(article?.content_en || "");
  const [contentFr, setContentFr] = useState(article?.content_fr || "");
  const [contentEs, setContentEs] = useState(article?.content_es || "");
  const [contentDe, setContentDe] = useState(article?.content_de || "");
  const [contentIt, setContentIt] = useState(article?.content_it || "");

  const [authorName, setAuthorName] = useState(article?.author_name || "");
  const [publishedAt, setPublishedAt] = useState(() => {
    if (article?.published_at) {
      return parseAbsoluteToLocal(new Date(article.published_at).toISOString());
    }

    return now(getLocalTimeZone());
  });
  const [isActive, setIsActive] = useState(article?.is_active !== false);
  const [imageUrl, setImageUrl] = useState(article?.image_url || "");

  const titles: Record<string, [string, (v: string) => void]> = {
    en: [titleEn, setTitleEn],
    fr: [titleFr, setTitleFr],
    es: [titleEs, setTitleEs],
    de: [titleDe, setTitleDe],
    it: [titleIt, setTitleIt],
  };

  const contents: Record<string, [string, (v: string) => void]> = {
    en: [contentEn, setContentEn],
    fr: [contentFr, setContentFr],
    es: [contentEs, setContentEs],
    de: [contentDe, setContentDe],
    it: [contentIt, setContentIt],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title_en: titleEn,
      title_fr: titleFr,
      title_es: titleEs,
      title_de: titleDe,
      title_it: titleIt,
      content_en: contentEn,
      content_fr: contentFr,
      content_es: contentEs,
      content_de: contentDe,
      content_it: contentIt,
      author_name: authorName,
      published_at: publishedAt.toDate().toISOString(),
      is_active: isActive,
      image_url: imageUrl || null,
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Titles */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-400">
          {t("articleTitle")}
        </h3>
        {LOCALES.map((loc) => (
          <Input
            key={`title_${loc}`}
            classNames={{
              inputWrapper: "bg-[#161b22] border-gray-700",
              input: "text-gray-200",
            }}
            isRequired={loc === "en"}
            label={`${t("articleTitle")} (${loc.toUpperCase()})`}
            value={titles[loc][0]}
            variant="bordered"
            onValueChange={titles[loc][1]}
          />
        ))}
      </div>

      {/* Content with Tabs */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-400">{t("content")}</h3>
        <Tabs
          classNames={{
            tabList: "bg-[#161b22] border border-gray-700",
            cursor: "bg-wow-gold/20",
            tab: "text-gray-400",
            tabContent: "group-data-[selected=true]:text-wow-gold",
          }}
          variant="solid"
        >
          {LOCALES.map((loc) => (
            <Tab key={loc} title={loc.toUpperCase()}>
              <div data-color-mode="dark">
                <MDEditor
                  height={400}
                  value={contents[loc][0]}
                  onChange={(val) => contents[loc][1](val || "")}
                />
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>

      {/* Author, Published At, Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          isRequired
          classNames={{
            inputWrapper: "bg-[#161b22] border-gray-700",
            input: "text-gray-200",
          }}
          label={t("authorName")}
          value={authorName}
          variant="bordered"
          onValueChange={setAuthorName}
        />
        <DatePicker
          classNames={{
            inputWrapper: "bg-[#161b22] border-gray-700",
            input: "text-gray-200",
          }}
          granularity="minute"
          label={t("publishedAt")}
          value={publishedAt}
          variant="bordered"
          onChange={(val) => {
            if (val) setPublishedAt(val);
          }}
        />
      </div>

      <Input
        classNames={{
          inputWrapper: "bg-[#161b22] border-gray-700",
          input: "text-gray-200",
        }}
        label={t("imageUrl")}
        value={imageUrl}
        variant="bordered"
        onValueChange={setImageUrl}
      />

      {imageUrl && (
        <div className="rounded-lg overflow-hidden border border-gray-700 max-w-xs">
          <img alt="Preview" className="w-full h-auto" src={imageUrl} />
        </div>
      )}

      {/* Active toggle */}
      <div className="flex items-center gap-3">
        <Switch
          classNames={{
            wrapper: "group-data-[selected=true]:bg-green-500 bg-gray-700",
          }}
          isSelected={isActive}
          onValueChange={setIsActive}
        />
        <span className="text-sm text-gray-300">
          {isActive ? t("active") : t("inactive")}
        </span>
      </div>

      <Button
        className="bg-gradient-to-r from-wow-gold to-wow-gold-light text-black font-bold"
        isLoading={loading}
        type="submit"
      >
        {t("save")}
      </Button>
    </form>
  );
}
