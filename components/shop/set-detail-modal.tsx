"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { useTranslations } from "next-intl";

import { PriceDisplay } from "./price-display";
import { WowheadLink } from "@/components/wowhead-link";
import { getQualityColor } from "@/lib/shop-utils";
import type { ShopSetLocalized } from "@/types";

interface SetDetailModalProps {
  set: ShopSetLocalized | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy: () => void;
  onGift: () => void;
  hasCharacter: boolean;
}

export function SetDetailModal({
  set,
  isOpen,
  onClose,
  onBuy,
  onGift,
  hasCharacter,
}: SetDetailModalProps) {
  const t = useTranslations("shop");

  if (!set) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      classNames={{
        base: "bg-[#0d1117] border border-wow-gold/20",
        header: "border-b border-wow-gold/10",
        footer: "border-t border-wow-gold/10",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          {set.icon_url && (
            <div className="w-12 h-12 rounded-lg bg-wow-dark/50 border border-wow-gold/20 flex items-center justify-center overflow-hidden">
              <img src={set.icon_url} alt={set.name} className="w-10 h-10 object-contain" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium text-purple-400">{set.name}</h3>
            <p className="text-xs text-gray-400">
              {t("setContains", { count: set.items.length })}
            </p>
          </div>
        </ModalHeader>

        <ModalBody className="py-6">
          {set.description && (
            <p className="text-gray-300 text-sm mb-4">{set.description}</p>
          )}

          <div className="mb-4">
            <PriceDisplay
              price={set.price}
              discountedPrice={set.discounted_price}
              discountPercentage={set.discount_percentage}
              size="lg"
            />
          </div>

          {/* Set pieces list */}
          <div className="bg-[#161b22] rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
              {t("setPieces", { count: set.items.length })}
            </p>
            <div className="space-y-2">
              {set.items.map((piece) => (
                <div key={piece.id} className="flex items-center gap-3">
                  {piece.icon_url && (
                    <div className="w-8 h-8 rounded bg-wow-dark/30 border border-gray-700/50 flex items-center justify-center overflow-hidden shrink-0">
                      <WowheadLink itemId={piece.item_id} className="flex items-center justify-center">
                        <img src={piece.icon_url} alt="" className="w-7 h-7 object-contain" />
                      </WowheadLink>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <WowheadLink
                      itemId={piece.item_id}
                      className={`text-sm hover:text-wow-gold transition-colors ${getQualityColor(piece.quality)}`}
                    >
                      {piece.name}
                    </WowheadLink>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Restrictions */}
          {(set.class_ids || set.faction !== "both") && (
            <div className="bg-[#161b22] rounded-lg p-4 mb-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{t("restrictions")}</p>
              <div className="flex flex-wrap gap-2">
                {set.faction !== "both" && (
                  <Chip
                    size="sm"
                    className={
                      set.faction === "alliance"
                        ? "bg-wow-alliance/20 text-blue-300"
                        : "bg-wow-horde/20 text-red-300"
                    }
                  >
                    {t("factionRestriction")}: {set.faction}
                  </Chip>
                )}
                {set.class_ids && (
                  <Chip size="sm" className="bg-cyan-500/10 text-cyan-300">
                    {t("classRestriction")}: {set.class_ids.map((id) => t(`className_${id}`)).join(", ")}
                  </Chip>
                )}
              </div>
            </div>
          )}

        </ModalBody>

        <ModalFooter className="flex-col items-stretch gap-3">
          {!hasCharacter && (
            <p className="text-xs text-yellow-400/80 text-center">{t("noCharacterSelected")}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="light" onPress={onClose} className="text-gray-400">
              {t("close")}
            </Button>
            <Button
              onPress={onGift}
              variant="bordered"
              className="border-purple-500/30 text-purple-400"
              isDisabled={!hasCharacter}
            >
              {t("gift")}
            </Button>
            <Button
              onPress={onBuy}
              className="bg-gradient-to-r from-wow-gold to-wow-gold-light text-black font-bold"
              isDisabled={!hasCharacter}
            >
              {t("buySet")}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
