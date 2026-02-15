"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const rates = [
  { key: "xp", value: "x10" },
  { key: "honor", value: "x2" },
  { key: "professions", value: "x2" },
  { key: "reputation", value: "x2" },
];

type RaidRow =
  | { type: "raid"; tier: string; raids: string; ilvl: string }
  | { type: "separator"; label: string };

const raidProgression: RaidRow[] = [
  { type: "separator", label: "Vanilla" },
  { type: "raid", tier: "Tier 1", raids: "Molten Core", ilvl: "61-70" },
  { type: "raid", tier: "Tier 2", raids: "Blackwing Lair", ilvl: "73-83" },
  { type: "raid", tier: "Transition", raids: "Zul'Gurub", ilvl: "65-68" },
  { type: "raid", tier: "Tier 2.5", raids: "AQ40 + AQ20", ilvl: "66-88" },
  { type: "separator", label: "The Burning Crusade" },
  { type: "raid", tier: "Tier 4", raids: "Karazhan / Gruul / Magtheridon", ilvl: "115-125" },
  { type: "raid", tier: "Tier 5", raids: "SSC / The Eye", ilvl: "128-133" },
  { type: "raid", tier: "Tier 6", raids: "Hyjal / Black Temple", ilvl: "141-151" },
  { type: "raid", tier: "Transition", raids: "Zul'Aman", ilvl: "128-141" },
  { type: "raid", tier: "Tier 6.5", raids: "Sunwell Plateau", ilvl: "154-164" },
  { type: "separator", label: "Wrath of the Lich King" },
  { type: "raid", tier: "Tier 7", raids: "Naxxramas / Malygos / Sartharion", ilvl: "200-213" },
  { type: "raid", tier: "Tier 8", raids: "Ulduar", ilvl: "219-239" },
  { type: "raid", tier: "Tier 9", raids: "Trial of the Crusader / Onyxia 80", ilvl: "232-258" },
  { type: "raid", tier: "Tier 10", raids: "Icecrown Citadel (ICC)", ilvl: "251-277" },
  { type: "raid", tier: "Final", raids: "Ruby Sanctum", ilvl: "258-284" },
];

export const RatesSection = () => {
  const t = useTranslations("features");

  return (
      <div className="relative overflow-hidden rounded-3xl">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('/img/Wrath of the Lich King Classic Cinematic Stills/Wrath_of_the_Lich_King_Classic_Cinematic_Still__(4).jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-wow-darker/60 to-wow-darker/90" />

        <motion.div
          className="relative glass rounded-3xl p-8 sm:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
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
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-gold rounded-xl py-6 px-4 text-center glow-gold flex flex-col items-center justify-center"
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

export const RaidProgressionSection = () => {
  const t = useTranslations("features");

  return (
      <div className="relative overflow-hidden rounded-3xl">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('/img/Wrath Classic Fall of the Lich King Launch Screenshots/WoW_WrathClassic_Fall_of_the_Lich_King_(3)_png_jpgcopy.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-wow-darker/60 to-wow-darker/90" />

        <motion.div
          className="relative glass rounded-3xl p-8 sm:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold wow-ice-text text-center mb-2">
            {t("progressionTitle")}
          </h2>
          <p className="text-gray-300 text-center mb-8 text-sm">
            {t("progressionSubtitle")}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="bg-wow-darker/60 border-b border-wow-gold/10">
                  <th className="text-wow-gold text-xs uppercase tracking-wider text-left px-4 py-3">{t("tier")}</th>
                  <th className="text-wow-gold text-xs uppercase tracking-wider text-left px-4 py-3">{t("raids")}</th>
                  <th className="text-wow-gold text-xs uppercase tracking-wider text-left px-4 py-3">{t("ilvl")}</th>
                </tr>
              </thead>
              <tbody>
                {raidProgression.map((row, i) =>
                  row.type === "separator" ? (
                    <tr key={i}>
                      <td colSpan={3} className="px-4 py-3 border-b border-wow-gold/10">
                        <span className="text-sm font-bold uppercase tracking-widest wow-gradient-text">
                          {row.label}
                        </span>
                      </td>
                    </tr>
                  ) : (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors border-b border-white/5">
                      <td className="px-4 py-3">
                        <span className={`font-bold whitespace-nowrap ${row.tier === "Final" ? "text-wow-gold drop-shadow-[0_0_6px_rgba(199,156,62,0.5)]" : row.tier.includes("Transition") ? "text-gray-400 italic" : "text-wow-blue"}`}>
                          {row.tier}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 font-medium">
                        {row.raids}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-mono ${row.ilvl ? "text-wow-gold-light" : "text-default-600"}`}>
                          {row.ilvl || "-"}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
  );
};
