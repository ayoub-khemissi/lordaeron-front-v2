"use client";

import { useTranslations } from "next-intl";

import { PROFESSION_SKILL_IDS } from "@/lib/armory-constants";
import { ArmoryProfession } from "@/types/armory";

interface ProfessionsPanelProps {
  professions: ArmoryProfession[];
}

export function ProfessionsPanel({ professions }: ProfessionsPanelProps) {
  const t = useTranslations("armory");

  if (professions.length === 0) {
    return <p className="text-sm text-gray-500 italic">{t("noProfessions")}</p>;
  }

  return (
    <div className="space-y-3">
      {professions.map((prof) => {
        const name = PROFESSION_SKILL_IDS[prof.skill] || `Skill ${prof.skill}`;
        const pct = prof.max > 0 ? (prof.value / prof.max) * 100 : 0;

        return (
          <div
            key={prof.skill}
            className="glass rounded-lg p-3 border border-white/5"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white">{name}</span>
              <span className="text-xs text-gray-400">
                {prof.value} / {prof.max}
              </span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-wow-gold/70 to-wow-gold rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
