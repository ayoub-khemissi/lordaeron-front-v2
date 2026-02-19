"use client";

import type { ServerStats as ServerStatsType } from "@/types";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

// Background images for each stat card
const statImages = [
  "/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_Dalaran_004_1080p_png_jpgcopy.jpg",
  "/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_Dalaran_007_1080p_png_jpgcopy.jpg",
  "/img/World of Warcraft Classic 1920x1080/ClassicStormwind.jpg",
  "/img/World of Warcraft Classic 1920x1080/ClassicOrgrimmar.jpg",
];

export const ServerStats = () => {
  const t = useTranslations("home");
  const [stats, setStats] = useState<ServerStatsType | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/server/stats");
        const data = await res.json();

        setStats(data);
      } catch {
        setStats({ onlineCount: 0, totalAccounts: 0, alliance: 0, horde: 0 });
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  const total = (stats?.alliance || 0) + (stats?.horde || 0);
  const alliancePercent =
    total > 0 ? ((stats?.alliance || 0) / total) * 100 : 50;
  const hordePercent = total > 0 ? ((stats?.horde || 0) / total) * 100 : 50;

  const cards = [
    {
      value: stats?.onlineCount,
      label: t("players"),
      color: "text-wow-blue-ice",
      glowClass: "glow-blue",
      borderClass: "border-wow-blue/20",
    },
    {
      value: stats?.totalAccounts,
      label: t("totalAccounts"),
      color: "text-wow-gold-light",
      glowClass: "glow-gold",
      borderClass: "border-wow-gold/20",
    },
    {
      value: stats?.alliance,
      label: t("alliance"),
      color: "text-wow-alliance",
      glowClass: "glow-alliance",
      borderClass: "border-wow-alliance/20",
    },
    {
      value: stats?.horde,
      label: t("horde"),
      color: "text-wow-horde",
      glowClass: "glow-horde",
      borderClass: "border-wow-horde/20",
    },
  ];

  return (
    <section className="container mx-auto max-w-7xl px-6 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div
              className={`relative overflow-hidden rounded-2xl ${card.glowClass} group`}
            >
              {/* BG image */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-45 group-hover:scale-110 transition-all duration-700"
                style={{ backgroundImage: `url('${statImages[index]}')` }}
              />
              {/* Glass overlay */}
              <div
                className={`relative glass ${card.borderClass} rounded-2xl text-center py-8 px-4`}
              >
                <p
                  className={`text-5xl font-black ${card.color} drop-shadow-lg`}
                >
                  {card.value ?? "..."}
                </p>
                <p className="text-gray-300 text-sm mt-2 uppercase tracking-wider font-medium">
                  {card.label}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Faction balance bar */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <p className="text-center text-gray-300 text-sm mb-3 uppercase tracking-wider font-medium">
          {t("factionBalance")}
        </p>
        <div className="relative max-w-2xl mx-auto">
          <div className="flex h-5 rounded-full overflow-hidden glass border border-white/5">
            <motion.div
              className="bg-gradient-to-r from-wow-alliance to-blue-400 rounded-l-full"
              initial={{ width: 0 }}
              style={{ boxShadow: "0 0 15px rgba(0,120,255,0.4)" }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              whileInView={{ width: `${alliancePercent}%` }}
            />
            <motion.div
              className="bg-gradient-to-r from-red-600 to-wow-horde rounded-r-full"
              initial={{ width: 0 }}
              style={{ boxShadow: "0 0 15px rgba(179,0,0,0.4)" }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              whileInView={{ width: `${hordePercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs font-medium">
            <span className="text-wow-alliance drop-shadow-[0_0_8px_rgba(0,120,255,0.5)]">
              {t("alliance")} {alliancePercent.toFixed(0)}%
            </span>
            <span className="text-wow-horde drop-shadow-[0_0_8px_rgba(179,0,0,0.5)]">
              {t("horde")} {hordePercent.toFixed(0)}%
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
