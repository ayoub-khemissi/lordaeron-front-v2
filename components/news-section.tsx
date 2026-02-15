"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";

import type { News } from "@/types";

// Fallback images for news cards when no image_url
const fallbackImages = [
  "/img/Wrath Classic Fall of the Lich King Launch Screenshots/WoW_WrathClassic_Fall_of_the_Lich_King_(1)_png_jpgcopy.jpg",
  "/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_Icecrown_001_1080p_png_jpgcopy.jpg",
  "/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_Ulduar_000_1080p_png_jpgcopy.jpg",
];

export const NewsSection = () => {
  const t = useTranslations("home");
  const locale = useLocale();
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/news?locale=${locale}&limit=3`);
        const data = await res.json();
        setNews(data);
      } catch {
        setNews([]);
      }
    };

    fetchNews();
  }, [locale]);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Section background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-15"
        style={{
          backgroundImage:
            "url('/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_Icecrown_005_1080p_png_jpgcopy.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-wow-darker via-transparent to-wow-darker" />

      <div className="relative container mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold wow-gradient-text mb-3">
            {t("newsTitle")}
          </h2>
          <div className="shimmer-line w-24 mx-auto" />
        </motion.div>

        {news.length === 0 ? (
          <p className="text-center text-gray-400">{t("noNews")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <div className="relative overflow-hidden rounded-2xl group h-full glow-gold">
                  {/* Card background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                    style={{
                      backgroundImage: `url('${item.image_url || fallbackImages[index % fallbackImages.length]}')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wow-darker via-wow-darker/80 to-wow-darker/30" />

                  {/* Content */}
                  <div className="relative glass border-wow-gold/10 rounded-2xl p-6 h-full flex flex-col justify-end min-h-[280px]">
                    <h3 className="text-wow-gold font-bold text-lg mb-2 drop-shadow-lg">
                      {item.title}
                    </h3>
                    <p className="text-gray-300/80 text-sm line-clamp-3 mb-3">
                      {item.content}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(item.created_at).toLocaleDateString(locale)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
