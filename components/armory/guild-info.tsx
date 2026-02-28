"use client";

interface GuildInfoProps {
  guildName: string | null;
  guildRankName: string | null;
}

export function GuildInfo({ guildName, guildRankName }: GuildInfoProps) {
  if (!guildName) return null;

  return (
    <div className="text-center mt-1">
      <p className="text-wow-gold font-semibold">&lt;{guildName}&gt;</p>
      {guildRankName && (
        <p className="text-xs text-gray-400">{guildRankName}</p>
      )}
    </div>
  );
}
