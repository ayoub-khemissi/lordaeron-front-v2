"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const rates = [
  { key: "xp", value: "x5" },
  { key: "honor", value: "x2" },
  { key: "professions", value: "x2" },
  { key: "reputation", value: "x2" },
];

export const RatesSection = () => {
  const t = useTranslations("features");

  return (
    <div className="relative overflow-hidden rounded-3xl group">
      <Image
        alt=""
        className="object-cover opacity-30 group-hover:opacity-45 group-hover:scale-110 transition-[opacity,scale] duration-700"
        fill={true}
        loading="lazy"
        sizes="(max-width: 768px) 100vw, 900px"
        src="/img/Wrath of the Lich King Classic Cinematic Stills/Wrath_of_the_Lich_King_Classic_Cinematic_Still__(4).jpg"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-wow-darker/60 to-wow-darker/90" />

      <motion.div
        className="relative p-8 sm:p-12"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold wow-gradient-text text-center mb-2">
          {t("ratesTitle")}
        </h2>
        <p className="text-gray-300 text-center mb-8 text-sm">
          {t("ratesSubtitle")}
        </p>

        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {rates.map((rate, i) => (
              <motion.div
                key={rate.key}
                className="glass-gold-lite rounded-xl py-6 px-4 text-center glow-gold flex flex-col items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                <p className="text-3xl font-black wow-gradient-text mb-2">
                  {rate.value}
                </p>
                <p className="text-gray-300 text-xs uppercase tracking-wider leading-tight">
                  {t(rate.key)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
