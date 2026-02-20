"use client";

import type { ContactMessage } from "@/types";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { useTranslations } from "next-intl";

type FilterStatus = "all" | "read" | "unread";

export default function AdminContactMessagesPage() {
  const t = useTranslations("admin.contactMessages");
  const tc = useTranslations("admin.common");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "50",
        offset: String(offset),
      });

      if (filter === "read") params.set("is_read", "true");
      if (filter === "unread") params.set("is_read", "false");

      const res = await fetch(`/api/admin/contact-messages?${params}`);
      const data = await res.json();

      setMessages(data.messages || []);
      setTotal(data.total || 0);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, [offset, filter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleView = async (message: ContactMessage) => {
    setSelectedMessage(message);

    if (!message.is_read) {
      await fetch(`/api/admin/contact-messages/${message.id}/read`, {
        method: "PATCH",
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, is_read: true } : m)),
      );
    }
  };

  const handleFilterChange = (newFilter: FilterStatus) => {
    setFilter(newFilter);
    setOffset(0);
  };

  return (
    <div>
      <h1 className="text-2xl font-heading text-gray-100 mb-6">{t("title")}</h1>

      <div className="flex gap-2 mb-6">
        {(["all", "unread", "read"] as FilterStatus[]).map((f) => (
          <Button
            key={f}
            className={
              filter === f
                ? "bg-wow-gold/20 text-wow-gold"
                : "text-gray-400 bg-[#161b22]"
            }
            size="sm"
            variant={filter === f ? "flat" : "bordered"}
            onPress={() => handleFilterChange(f)}
          >
            {t(f)}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner color="warning" size="lg" />
        </div>
      ) : messages.length === 0 ? (
        <p className="text-gray-500 text-center py-16">{t("noMessages")}</p>
      ) : (
        <>
          <Table
            aria-label="Contact messages"
            classNames={{
              wrapper: "bg-[#161b22] border border-gray-800",
              th: "bg-[#0d1117] text-gray-400",
              td: "text-gray-300",
            }}
          >
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>{t("username")}</TableColumn>
              <TableColumn>{t("email")}</TableColumn>
              <TableColumn>{t("subject")}</TableColumn>
              <TableColumn>{t("status")}</TableColumn>
              <TableColumn>{t("date")}</TableColumn>
              <TableColumn>{t("actions")}</TableColumn>
            </TableHeader>
            <TableBody>
              {messages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell>{msg.id}</TableCell>
                  <TableCell className="font-medium">{msg.username}</TableCell>
                  <TableCell className="text-gray-400">{msg.email}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {msg.subject}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={msg.is_read ? "success" : "warning"}
                      size="sm"
                      variant="flat"
                    >
                      {msg.is_read ? t("read") : t("unread")}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      className="bg-wow-gold/20 text-wow-gold"
                      size="sm"
                      onPress={() => handleView(msg)}
                    >
                      {t("view")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {total > 50 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                className="text-gray-400"
                isDisabled={offset === 0}
                size="sm"
                variant="light"
                onPress={() => setOffset(Math.max(0, offset - 50))}
              >
                {tc("previous")}
              </Button>
              <span className="text-sm text-gray-500 py-2">
                {offset + 1}-{Math.min(offset + 50, total)} / {total}
              </span>
              <Button
                className="text-gray-400"
                isDisabled={offset + 50 >= total}
                size="sm"
                variant="light"
                onPress={() => setOffset(offset + 50)}
              >
                {tc("next")}
              </Button>
            </div>
          )}
        </>
      )}

      <Modal
        classNames={{
          base: "bg-[#161b22] border border-gray-800",
          header: "border-b border-gray-800",
          body: "py-4",
          footer: "border-t border-gray-800",
        }}
        isOpen={!!selectedMessage}
        size="2xl"
        onClose={() => setSelectedMessage(null)}
      >
        <ModalContent>
          {selectedMessage && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-gray-100">{selectedMessage.subject}</span>
                <span className="text-sm font-normal text-gray-400">
                  {selectedMessage.username} ({selectedMessage.email}) —{" "}
                  {new Date(selectedMessage.created_at).toLocaleString()}
                </span>
              </ModalHeader>
              <ModalBody>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="text-gray-400"
                  variant="light"
                  onPress={() => setSelectedMessage(null)}
                >
                  {tc("cancel")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
