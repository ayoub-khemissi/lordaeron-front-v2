"use client";

import { useTranslations } from "next-intl";

import { ArmoryCharacter, ArenaTeamInfo } from "@/types/armory";

interface PvpPanelProps {
  character: ArmoryCharacter;
  arenaTeams: ArenaTeamInfo[];
}

const ARENA_TYPE_LABEL: Record<number, string> = {
  2: "2v2",
  3: "3v3",
  5: "5v5",
};

export function PvpPanel({ character, arenaTeams }: PvpPanelProps) {
  const t = useTranslations("armory");

  return (
    <div className="space-y-4">
      {/* Honor stats */}
      <div className="glass rounded-xl p-4 border border-white/5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">
              {character.totalKills.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">{t("honorKills")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-wow-gold">
              {character.totalHonorPoints.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">{t("honorPoints")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-wow-gold">
              {character.arenaPoints.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">{t("arenaPoints")}</p>
          </div>
        </div>
      </div>

      {/* Arena teams */}
      <div>
        <h4 className="text-sm font-semibold text-wow-gold mb-3">
          {t("arena")}
        </h4>
        {arenaTeams.length === 0 ? (
          <p className="text-sm text-gray-500 italic">{t("noArenaTeams")}</p>
        ) : (
          <div className="space-y-3">
            {arenaTeams.map((team) => (
              <div
                key={team.name}
                className="glass rounded-xl p-4 border border-white/5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-white">{team.name}</p>
                    <p className="text-xs text-gray-400">
                      {ARENA_TYPE_LABEL[team.type] ||
                        `${team.type}v${team.type}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-wow-gold">
                      {team.rating}
                    </p>
                    <p className="text-xs text-gray-400">{t("rating")}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("personalRating")}</span>
                    <span className="text-white">{team.personalRating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("seasonGames")}</span>
                    <span className="text-white">{team.seasonGames}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("seasonWins")}</span>
                    <span className="text-white">{team.seasonWins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("weekGames")}</span>
                    <span className="text-white">{team.weekGames}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t("weekWins")}</span>
                    <span className="text-white">{team.weekWins}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
