"use client";

import { useTranslations } from "next-intl";

import { ArmoryStats } from "@/types/armory";

interface StatsPanelProps {
  stats: ArmoryStats;
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center py-1.5 px-3 rounded hover:bg-white/5">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm text-white font-medium">{value}</span>
    </div>
  );
}

function StatSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-xl p-4 border border-white/5">
      <h4 className="text-sm font-semibold text-wow-gold mb-2">{title}</h4>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const t = useTranslations("armory");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatSection title={t("attributes")}>
        <StatRow label={t("health")} value={stats.maxhealth.toLocaleString()} />
        <StatRow label={t("mana")} value={stats.maxpower1.toLocaleString()} />
        <StatRow label={t("strength")} value={stats.strength} />
        <StatRow label={t("agility")} value={stats.agility} />
        <StatRow label={t("stamina")} value={stats.stamina} />
        <StatRow label={t("intellect")} value={stats.intellect} />
        <StatRow label={t("spirit")} value={stats.spirit} />
      </StatSection>

      <StatSection title={t("defense")}>
        <StatRow label={t("armor")} value={stats.armor.toLocaleString()} />
        <StatRow label={t("dodge")} value={`${stats.dodgePct.toFixed(2)}%`} />
        <StatRow label={t("parry")} value={`${stats.parryPct.toFixed(2)}%`} />
        <StatRow label={t("block")} value={`${stats.blockPct.toFixed(2)}%`} />
        <StatRow label={t("resilience")} value={stats.resilience} />
      </StatSection>

      <StatSection title={t("melee")}>
        <StatRow label={t("attackPower")} value={stats.attackPower} />
        <StatRow label={t("crit")} value={`${stats.critPct.toFixed(2)}%`} />
      </StatSection>

      <StatSection title={t("spell")}>
        <StatRow label={t("spellPower")} value={stats.spellPower} />
        <StatRow
          label={t("crit")}
          value={`${stats.spellCritPct.toFixed(2)}%`}
        />
      </StatSection>

      <StatSection title={t("ranged")}>
        <StatRow label={t("attackPower")} value={stats.rangedAttackPower} />
        <StatRow
          label={t("crit")}
          value={`${stats.rangedCritPct.toFixed(2)}%`}
        />
      </StatSection>
    </div>
  );
}
