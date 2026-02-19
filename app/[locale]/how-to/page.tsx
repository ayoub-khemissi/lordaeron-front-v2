"use client";

import { Snippet } from "@heroui/snippet";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const steps = [
  {
    key: "step1",
    icon: "/WoW Vanilla_Classic Icon Pack/Items/INV_Misc_Bag_20.png",
    bg: "/img/World of Warcraft Classic 1920x1080/WoW_ClassicLaunchPressKit_ThousandNeedles_1920x1080.jpg",
  },
  {
    key: "step2",
    icon: "/WoW Vanilla_Classic Icon Pack/Items/INV_Misc_Note_01.png",
    bg: "/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_Dalaran_007_1080p_png_jpgcopy.jpg",
  },
  {
    key: "step3",
    icon: "/WoW Vanilla_Classic Icon Pack/Items/INV_Letter_08.png",
    bg: "/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_ArthasThrone_003_1080p_png_jpgcopy.jpg",
  },
  {
    key: "step4",
    icon: "/WoW Vanilla_Classic Icon Pack/Items/INV_Misc_Horn_02.png",
    bg: "/img/Wrath Classic Fall of the Lich King Launch Screenshots/WoW_WrathClassic_Fall_of_the_Lich_King_(5)_png_jpgcopy.jpg",
  },
];

export default function HowToPage() {
  const t = useTranslations("howTo");

  return (
    <div
      className="relative bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('/img/World of Warcraft Classic 1920x1080/ClassicLaunch_WoW_STV_1920x1080.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-wow-darker/90" />

      <div className="relative container mx-auto max-w-4xl px-6 py-16">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-black wow-gradient-text mb-3">
            {t("title")}
          </h1>
          <p className="text-gray-300 mb-4">{t("subtitle")}</p>
          <div className="shimmer-line w-32 mx-auto" />
        </motion.div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.key}
              animate={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="relative overflow-hidden rounded-2xl group glow-gold">
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-45 group-hover:scale-105 transition-all duration-700"
                  style={{ backgroundImage: `url('${step.bg}')` }}
                />

                <div className="relative glass border-wow-gold/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-5 items-start">
                  {/* Step WoW icon */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-wow-gold/40 glow-gold bg-wow-darker/50">
                      <img
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                        src={step.icon}
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-wow-gold/50 text-sm font-mono">
                        0{index + 1}
                      </span>
                      <h3 className="text-wow-gold font-bold text-xl">
                        {t(`${step.key}Title`)}
                      </h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {t(`${step.key}Desc`)}
                    </p>

                    {step.key === "step2" && (
                      <div className="mt-5">
                        <Snippet
                          classNames={{
                            base: "glass-blue border-wow-blue/20 w-full glow-blue",
                            pre: "text-wow-blue-ice font-mono text-sm",
                            copyButton: "text-wow-blue hover:text-wow-blue-ice",
                          }}
                          symbol=""
                          variant="bordered"
                        >
                          {t("realmlist")}
                        </Snippet>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Version badge */}
        <motion.div
          animate={{ opacity: 1 }}
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="inline-block glass-gold glow-gold-strong rounded-full px-8 py-3">
            <p className="text-wow-gold font-semibold text-sm tracking-wide">
              {t("version")}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
