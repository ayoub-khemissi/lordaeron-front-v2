"use client";

import { Select, SelectItem } from "@heroui/select";
import { useTranslations } from "next-intl";

import type { Character } from "@/types";
import { RACE_NAMES, CLASS_NAMES } from "@/lib/shop-utils";

interface RealmCharacterSelectorProps {
  characters: Character[];
  selectedCharacter: Character | null;
  onCharacterSelect: (character: Character) => void;
}

export function RealmCharacterSelector({
  characters,
  selectedCharacter,
  onCharacterSelect,
}: RealmCharacterSelectorProps) {
  const t = useTranslations("shop");

  if (characters.length === 0) {
    return (
      <div className="sticky top-16 z-40 glass rounded-xl p-4 mb-6 border border-wow-gold/10">
        <p className="text-sm text-yellow-400/80 text-center">{t("noCharacters")}</p>
      </div>
    );
  }

  return (
    <div className="sticky top-16 z-40 glass rounded-xl p-4 mb-6 border border-wow-gold/10">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Select
          label={t("selectCharacter")}
          placeholder={t("selectCharacter")}
          selectedKeys={selectedCharacter ? [String(selectedCharacter.guid)] : []}
          onSelectionChange={(keys) => {
            const key = Array.from(keys)[0] as string;
            const char = characters.find((c) => String(c.guid) === key);
            if (char) onCharacterSelect(char);
          }}
          classNames={{
            trigger: "glass border-wow-gold/20 hover:border-wow-gold/40 data-[open=true]:border-wow-gold/40",
            popoverContent: "bg-[#161b22] border border-wow-gold/15",
          }}
          size="sm"
          className="max-w-xs"
        >
          {characters.map((char) => (
            <SelectItem key={String(char.guid)} textValue={char.name}>
              <div className="flex items-center gap-2">
                <span className="font-medium text-wow-gold">{char.name}</span>
                <span className="text-xs text-gray-400">
                  Lv.{char.level} {RACE_NAMES[char.race]} {CLASS_NAMES[char.class]}
                </span>
              </div>
            </SelectItem>
          ))}
        </Select>

        {selectedCharacter && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-wow-gold font-medium">{selectedCharacter.name}</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">
              Lv.{selectedCharacter.level} {RACE_NAMES[selectedCharacter.race]} {CLASS_NAMES[selectedCharacter.class]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
