"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { useTranslations } from "next-intl";

import { PriceDisplay } from "./price-display";
import { WowheadLink } from "@/components/wowhead-link";
import { RACE_NAMES, getQualityColor } from "@/lib/shop-utils";
import type { ShopItemLocalized } from "@/types";

interface ItemDetailModalProps {
  item: ShopItemLocalized | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy: () => void;
  onGift: () => void;
  hasCharacter: boolean;
}

export function ItemDetailModal({
  item,
  isOpen,
  onClose,
  onBuy,
  onGift,
  hasCharacter,
}: ItemDetailModalProps) {
  const t = useTranslations("shop");

  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      classNames={{
        base: "bg-[#0d1117] border border-wow-gold/20",
        header: "border-b border-wow-gold/10",
        footer: "border-t border-wow-gold/10",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          {item.icon_url && (
            <div className="w-12 h-12 rounded-lg bg-wow-dark/50 border border-wow-gold/20 flex items-center justify-center overflow-hidden">
              {item.item_id ? (
                <WowheadLink itemId={item.item_id} className="flex items-center justify-center">
                  <img src={item.icon_url} alt={item.name} className="w-10 h-10 object-contain" />
                </WowheadLink>
              ) : (
                <img src={item.icon_url} alt={item.name} className="w-10 h-10 object-contain" />
              )}
            </div>
          )}
          <div>
            <h3 className={`text-lg font-medium ${getQualityColor(item.quality)}`}>
              {item.item_id ? (
                <WowheadLink itemId={item.item_id} className="text-inherit hover:text-wow-gold">
                  {item.name}
                </WowheadLink>
              ) : (
                item.name
              )}
            </h3>
            <p className="text-xs text-gray-400">{t(`categories.${item.category}`)}</p>
          </div>
        </ModalHeader>

        <ModalBody className="py-6">
          {item.description && (
            <p className="text-gray-300 text-sm mb-4">{item.description}</p>
          )}

          <div className="mb-4">
            <PriceDisplay
              price={item.price}
              discountedPrice={item.discounted_price}
              discountPercentage={item.discount_percentage}
              size="lg"
            />
          </div>

          {/* Restrictions */}
          {(item.realm_ids || item.race_ids || item.class_ids || item.faction !== "both") && (
            <div className="bg-[#161b22] rounded-lg p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{t("restrictions")}</p>
              <div className="flex flex-wrap gap-2">
                {item.faction !== "both" && (
                  <Chip
                    size="sm"
                    className={
                      item.faction === "alliance"
                        ? "bg-wow-alliance/20 text-blue-300"
                        : "bg-wow-horde/20 text-red-300"
                    }
                  >
                    {t("factionRestriction")}: {item.faction}
                  </Chip>
                )}
                {item.race_ids && (
                  <Chip size="sm" className="bg-orange-500/10 text-orange-300">
                    {t("raceRestriction")}: {item.race_ids.map((id) => RACE_NAMES[id]).join(", ")}
                  </Chip>
                )}
                {item.class_ids && (
                  <Chip size="sm" className="bg-cyan-500/10 text-cyan-300">
                    {t("classRestriction")}: {item.class_ids.map((id) => t(`className_${id}`)).join(", ")}
                  </Chip>
                )}
              </div>
            </div>
          )}

          <div className="mt-3">
            <Chip
              size="sm"
              className={item.is_refundable ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}
            >
              {item.is_refundable ? t("refundable") : t("nonRefundable")}
            </Chip>
            {item.is_refundable && item.category !== "services" && (
              <p className="text-xs text-gray-400 mt-1">{t("refundPolicy")}</p>
            )}
          </div>
        </ModalBody>

        <ModalFooter className="flex-col items-stretch gap-3">
          {!hasCharacter && (
            <p className="text-xs text-yellow-400/80 text-center">{t("noCharacterSelected")}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="light" onPress={onClose} className="text-gray-400">
              {t("close")}
            </Button>
            {item.category !== "services" && (
              <Button
                onPress={onGift}
                variant="bordered"
                className="border-purple-500/30 text-purple-400"
                isDisabled={!hasCharacter}
              >
                {t("gift")}
              </Button>
            )}
            <Button
              onPress={onBuy}
              className="bg-gradient-to-r from-wow-gold to-wow-gold-light text-black font-bold"
              isDisabled={!hasCharacter}
            >
              {t("buyNow")}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
