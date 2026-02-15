"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const features = [
  {
    key: "transmog",
    icon: "/WoW Vanilla_Classic Icon Pack/Items/INV_Misc_ArmorKit_17.png",
    bg: "/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_HowlingFjord_007_1080p_png_jpgcopy.jpg",
  },
  {
    key: "epicProgression",
    icon: "/WoW Vanilla_Classic Icon Pack/Items/INV_Misc_Orb_02.png",
    bg: "/img/Burning Crusade Classic  Black Temple Screenshots 1080/BCC_Black_Temple_Illidan.jpg",
  },
  {
    key: "tankAsDps",
    icon: "/WoW Vanilla_Classic Icon Pack/Items/INV_Misc_Rune_08.png",
    bg: "/img/Wrath of the Lich King Classic Cinematic Stills/Wrath_of_the_Lich_King_Classic_Cinematic_Still__(5).jpg",
  },
];

const qol = [
  {
    key: "dungeonNoLock",
    icon: "/WoW Vanilla_Classic Icon Pack/Items/INV_Misc_Key_08.png",
    bg: "/img/World of Warcraft Classic 1920x1080/ClassicDungeon.jpg",
  },
  {
    key: "raidReset",
    icon: "/WoW Vanilla_Classic Icon Pack/Items/INV_Misc_Idol_02.png",
    bg: "/img/Wrath of the Lich King Classic Call of the Crusade Screenshots/Wrath_Classic_Call_of_the_Crusade_Trial_of_the_Crusader_003.jpg",
  },
  {
    key: "crossfaction",
    icon: "/WoW Vanilla_Classic Icon Pack/Items/INV_Misc_Horn_01.png",
    bg: "/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_Dalaran_004_1080p_png_jpgcopy.jpg",
  },
  {
    key: "aoeLoot",
    icon: "/WoW Vanilla_Classic Icon Pack/Items/INV_Misc_Bag_10_Blue.png",
    bg: "/img/World of Warcraft Classic 1920x1080/WoW_ClassicLaunchPressKit_ScarletMonastery_1920x1080.jpg",
  },
  {
    key: "autolearnSpells",
    icon: "/WoW Vanilla_Classic Icon Pack/Items/INV_Misc_Book_09.png",
    bg: "/img/Burning Crusade Classic Fury of the Sunwell Screenshots 4K/WoW_BCC_FuryOfTheSunwell_Kalecgos_010_png_jpgcopy.jpg",
  },
];

function FeatureCard({
  featureKey,
  iconUrl,
  bgImage,
  index,
}: {
  featureKey: string;
  iconUrl: string;
  bgImage: string;
  index: number;
}) {
  const t = useTranslations("features");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <div className="relative overflow-hidden rounded-2xl group h-full glow-gold">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-45 group-hover:scale-110 transition-all duration-700"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />

        {/* Glass content */}
        <div className="relative glass border-wow-gold/10 rounded-2xl p-8 text-center h-full flex flex-col items-center">
          {/* WoW icon from local pack */}
          <div className="w-16 h-16 rounded-xl overflow-hidden mb-4 border-2 border-wow-gold/40 glow-gold-strong bg-wow-darker/50">
            <img
              src={iconUrl}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <h3 className="text-wow-gold font-bold text-lg mb-2 drop-shadow-lg">
            {t(featureKey)}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {t(`${featureKey}Desc`)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export const FeaturesGrid = () => {
  const t = useTranslations("features");

  return (
    <div className="space-y-20">
      {/* Unique Features */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold wow-gradient-text mb-3">
            {t("featuresTitle")}
          </h2>
          <div className="shimmer-line w-24 mx-auto" />
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <FeatureCard
              key={feat.key}
              featureKey={feat.key}
              iconUrl={feat.icon}
              bgImage={feat.bg}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Quality of Life */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold wow-ice-text mb-3">
            {t("qolTitle")}
          </h2>
          <div className="shimmer-line w-24 mx-auto" />
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {qol.map((feat, i) => (
            <FeatureCard
              key={feat.key}
              featureKey={feat.key}
              iconUrl={feat.icon}
              bgImage={feat.bg}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
