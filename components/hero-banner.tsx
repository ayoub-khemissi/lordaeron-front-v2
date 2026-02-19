"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { useTranslations, useLocale } from "next-intl";
import NextLink from "next/link";
import { motion } from "framer-motion";

const heroBackgrounds = [
  // Vanilla
  "/img/World of Warcraft Classic 1920x1080/ClassicLaunch_WoW_STV_1920x1080.jpg",
  "/img/World of Warcraft Classic 1920x1080/ClassicLaunch_WoW_Onyxia_1920x1080.jpg",
  "/img/World of Warcraft Classic 1920x1080/ClassicStormwind.jpg",
  "/img/World of Warcraft Classic 1920x1080/ClassicOrgrimmar.jpg",
  "/img/World of Warcraft Classic 1920x1080/ClassicLaunch_WoW_Andorhal_1920x1080.jpg",
  "/img/World of Warcraft Classic 1920x1080/WoW_ClassicLaunchPressKit_UngoroHunter_1920x1080.jpg",
  "/img/World of Warcraft Classic 1920x1080/ClassicDungeon.jpg",
  // TBC
  "/img/Burning Crusade Classic  Black Temple Screenshots 1080/BCC_Black_Temple_Illidan.jpg",
  "/img/Burning Crusade Classic  Black Temple Screenshots 1080/BCC_Hyjal_Archimonde.jpg",
  "/img/Burning Crusade Classic  Black Temple Screenshots 1080/BCC_BlackTemple_Entrance.jpg",
  "/img/Burning Crusade Classic Overlords of Outland Screenshots 1080p/BCC_Overlords_of_Outland_Serpentshrine_Cavern_1920x1080.jpg",
  "/img/Burning Crusade Classic Overlords of Outland Screenshots 1080p/BCC_Overlords_of_Outland_Lady_Vashj_1920x1080.jpg",
  "/img/Burning Crusade Classic Overlords of Outland Announce/BCC_Overlords_of_Outland_KaelThas_1920x1080.jpg",
  "/img/Burning Crusade Classic Fury of the Sunwell Screenshots 4K/WoW_BCC_FuryOfTheSunwell_Kiljaeden_010_png_jpgcopy.jpg",
  "/img/Burning Crusade Classic  The Gods of ZulAman Screenshots 1080p/BCC_Zul_Aman_Zuljin_002_1920x1080_png_jpgcopy.jpg",
  // WotLK
  "/img/Wrath of the Lich King Classic Cinematic Stills/Wrath_of_the_Lich_King_Classic_Cinematic_Still__(1).jpg",
  "/img/Wrath of the Lich King Classic Cinematic Stills/Wrath_of_the_Lich_King_Classic_Cinematic_Still__(5).jpg",
  "/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_Icecrown_006_1080p_png_jpgcopy.jpg",
  "/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_HowlingFjord_007_1080p_png_jpgcopy.jpg",
  "/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_Dalaran_004_1080p_png_jpgcopy.jpg",
  "/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_Ulduar_003_1080p_png_jpgcopy.jpg",
  "/img/Wrath of the Lich King Classic Secret of Ulduar Screenshots 4K/WoW_Wrath_Ulduar_003_4K_png_jpgcopy.jpg",
  "/img/Wrath Classic Fall of the Lich King Launch Screenshots/WoW_WrathClassic_Fall_of_the_Lich_King_(3)_png_jpgcopy.jpg",
  "/img/Wrath Classic Fall of the Lich King Launch Screenshots/WoW_WrathClassic_Fall_of_the_Lich_King_(5)_png_jpgcopy.jpg",
];

export const HeroBanner = () => {
  const t = useTranslations("home");
  const locale = useLocale();
  const [bgImage, setBgImage] = useState(heroBackgrounds[0]);

  useEffect(() => {
    setBgImage(
      heroBackgrounds[Math.floor(Math.random() * heroBackgrounds.length)],
    );
  }, []);

  return (
    <section className="relative w-full min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />

      {/* Multi-layer overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-wow-darker/80 via-wow-darker/40 to-wow-darker" />
      <div className="absolute inset-0 bg-gradient-to-r from-wow-darker/50 via-transparent to-wow-darker/50" />

      {/* Radial glow from center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,195,247,0.08)_0%,transparent_70%)]" />

      {/* Bottom edge glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-wow-blue/30 to-transparent" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Decorative top line */}
        <motion.div
          animate={{ opacity: 1, scaleX: 1 }}
          className="shimmer-line w-32 mx-auto mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          transition={{ duration: 1 }}
        />

        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="text-wow-blue text-sm uppercase tracking-[0.3em] font-semibold mb-4 drop-shadow-[0_0_10px_rgba(79,195,247,0.4)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          Epic Progressive Server
        </motion.p>

        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl sm:text-6xl md:text-8xl font-black wow-gradient-text mb-6 tracking-tight leading-tight drop-shadow-[0_0_30px_rgba(199,156,62,0.3)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          {t("title")}
        </motion.h1>

        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <Button
            as={NextLink}
            className="bg-gradient-to-r from-wow-gold to-wow-gold-light text-black font-bold text-lg px-10 h-14 glow-gold-strong hover:shadow-[0_0_40px_rgba(199,156,62,0.5)] transition-all duration-300"
            href={`/${locale}/how-to`}
            size="lg"
          >
            {t("cta")}
          </Button>
          <Button
            as={NextLink}
            className="border-wow-blue/30 text-wow-blue font-semibold text-lg px-10 h-14 hover:bg-wow-blue/10 hover:border-wow-blue/50 hover:shadow-[0_0_30px_rgba(79,195,247,0.15)] transition-all duration-300 backdrop-blur-sm"
            href={`/${locale}/register`}
            size="lg"
            variant="bordered"
          >
            {t("ctaRegister")}
          </Button>
        </motion.div>

        {/* Decorative bottom line */}
        <motion.div
          animate={{ opacity: 1, scaleX: 1 }}
          className="shimmer-line w-48 mx-auto mt-12"
          initial={{ opacity: 0, scaleX: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        />
      </div>
    </section>
  );
};
