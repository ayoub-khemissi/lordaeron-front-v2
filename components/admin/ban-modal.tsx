"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { useTranslations } from "next-intl";

interface BanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { account_id: number; reason: string; expires_at: string | null }) => Promise<void>;
}

export function BanModal({ isOpen, onClose, onSubmit }: BanModalProps) {
  const t = useTranslations("admin.bans");
  const tc = useTranslations("admin.common");
  const [accountId, setAccountId] = useState("");
  const [reason, setReason] = useState("");
  const [isPermanent, setIsPermanent] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!accountId || !reason) return;
    setLoading(true);
    try {
      await onSubmit({
        account_id: parseInt(accountId),
        reason,
        expires_at: isPermanent ? null : expiresAt || null,
      });
      setAccountId("");
      setReason("");
      setIsPermanent(true);
      setExpiresAt("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} classNames={{ base: "bg-[#161b22] border border-gray-800" }}>
      <ModalContent>
        <ModalHeader>{t("addBan")}</ModalHeader>
        <ModalBody>
          <Input
            label={t("accountId")}
            value={accountId}
            onValueChange={setAccountId}
            type="number"
            classNames={{ inputWrapper: "bg-[#0d1117] border-gray-700" }}
          />
          <Input
            label={t("reason")}
            value={reason}
            onValueChange={setReason}
            classNames={{ inputWrapper: "bg-[#0d1117] border-gray-700" }}
          />
          <Switch isSelected={isPermanent} onValueChange={setIsPermanent}>
            <span className="text-gray-300 text-sm">{t("permanent")}</span>
          </Switch>
          {!isPermanent && (
            <Input
              label={t("expiresAt")}
              value={expiresAt}
              onValueChange={setExpiresAt}
              type="datetime-local"
              classNames={{ inputWrapper: "bg-[#0d1117] border-gray-700" }}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} className="text-gray-400">{tc("cancel")}</Button>
          <Button
            onPress={handleSubmit}
            isLoading={loading}
            isDisabled={!accountId || !reason}
            className="bg-red-500 text-white font-bold"
          >
            {t("addBan")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
