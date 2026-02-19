import type { ShopPurchase } from "@/types";

import { updatePurchaseStatus } from "@/lib/queries/shop-purchases";
import { getShopSetItems } from "@/lib/queries/shop-sets";
import { charactersDb } from "@/lib/db";

const SOAP_HOST = process.env.SOAP_HOST || "127.0.0.1";
const SOAP_PORT = process.env.SOAP_PORT || "7878";
const SOAP_USERNAME = process.env.SOAP_USERNAME || "";
const SOAP_PASSWORD = process.env.SOAP_PASSWORD || "";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sanitizeInput(str: string): string {
  return str.replace(/[^\w\s.,!?'-]/g, "");
}

function buildEnvelope(command: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:ns1="urn:TC"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"
  SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
  <SOAP-ENV:Body>
    <ns1:executeCommand>
      <command>${escapeXml(command)}</command>
    </ns1:executeCommand>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;
}

export async function executeCommand(
  command: string,
): Promise<{ success: boolean; message: string }> {
  const url = `http://${SOAP_HOST}:${SOAP_PORT}/`;
  const body = buildEnvelope(command);
  const auth = Buffer.from(`${SOAP_USERNAME}:${SOAP_PASSWORD}`).toString(
    "base64",
  );

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        Authorization: `Basic ${auth}`,
        SOAPAction: "urn:TC#executeCommand",
      },
      body,
      signal: AbortSignal.timeout(10000),
    });

    const text = await res.text();

    if (!res.ok) {
      return { success: false, message: `SOAP HTTP ${res.status}: ${text}` };
    }

    // Check for fault in response
    if (text.includes("faultstring")) {
      const match = text.match(/<faultstring>([\s\S]*?)<\/faultstring>/);

      return {
        success: false,
        message: match ? match[1] : "Unknown SOAP fault",
      };
    }

    return { success: true, message: text };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "SOAP connection failed",
    };
  }
}

export async function sendItem(
  characterName: string,
  subject: string,
  body: string,
  itemId: number,
  count: number = 1,
): Promise<{ success: boolean; message: string }> {
  const safeName = sanitizeInput(characterName);
  const safeSubject = sanitizeInput(subject);
  const safeBody = sanitizeInput(body);

  const command = `.send items ${safeName} "${safeSubject}" "${safeBody}" ${itemId}:${count}`;

  const result = await executeCommand(command);

  if (result.success) {
    await markMailAsNonReturnable(safeName, safeSubject);
  }

  return result;
}

export async function sendItems(
  characterName: string,
  subject: string,
  body: string,
  items: { itemId: number; count: number }[],
): Promise<{ success: boolean; message: string }> {
  const safeName = sanitizeInput(characterName);
  const safeSubject = sanitizeInput(subject);
  const safeBody = sanitizeInput(body);

  const itemPairs = items.map((i) => `${i.itemId}:${i.count}`).join(" ");
  const command = `.send items ${safeName} "${safeSubject}" "${safeBody}" ${itemPairs}`;

  const result = await executeCommand(command);

  if (result.success) {
    await markMailAsNonReturnable(safeName, safeSubject);
  }

  return result;
}

async function markMailAsNonReturnable(
  characterName: string,
  subject: string,
): Promise<void> {
  try {
    await charactersDb.execute(
      `UPDATE mail SET messageType = 3
       WHERE receiver = (SELECT guid FROM characters WHERE name = ?)
       AND subject = ?
       ORDER BY id DESC LIMIT 1`,
      [characterName, subject],
    );
  } catch (error) {
    console.error("Failed to mark mail as non-returnable:", error);
  }
}

export async function retryPurchaseDelivery(
  purchase: ShopPurchase,
): Promise<{ success: boolean; message: string }> {
  const recipient =
    purchase.is_gift && purchase.gift_to_character_name
      ? purchase.gift_to_character_name
      : purchase.character_name;

  const subject = purchase.is_gift
    ? "Gift from the Lordaeron Shop"
    : "Lordaeron Shop";

  const body =
    purchase.is_gift && purchase.gift_message
      ? purchase.gift_message
      : "Thank you for your purchase!";

  // Set purchase: send all set items
  if (purchase.set_id_ref) {
    const setItems = await getShopSetItems(purchase.set_id_ref);

    if (setItems.length === 0) {
      return { success: false, message: "No items found for set" };
    }

    const result = await sendItems(
      recipient,
      subject,
      body,
      setItems.map((i) => ({ itemId: i.item_id, count: 1 })),
    );

    if (result.success) {
      await updatePurchaseStatus(purchase.id, "completed");
    }

    return result;
  }

  // Single item purchase
  if (!purchase.wow_item_id) {
    return { success: false, message: "No wow_item_id on purchase" };
  }

  const result = await sendItem(
    recipient,
    subject,
    body,
    purchase.wow_item_id,
    1,
  );

  if (result.success) {
    await updatePurchaseStatus(purchase.id, "completed");
  }

  return result;
}
